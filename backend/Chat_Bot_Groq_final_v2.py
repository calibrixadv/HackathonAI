import os
import json
import re
from typing import List, Dict, Any

from groq import Groq
from dotenv import load_dotenv


# ------------- Config & loading -------------


def load_config() -> dict:
    """Load configuration from .env and return a simple dict."""
    load_dotenv()

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")

    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    # default locations file (can be overridden via .env)
    locations_path = os.getenv("LOCATIONS_PATH", "locatii_cu_categorii.json")

    return {
        "api_key": api_key,
        "model": model,
        "locations_path": locations_path,
    }


def load_places(path: str) -> List[Dict[str, Any]]:
    """
    Load places from JSON file.

    Accepts either:
    - dict with key 'locations' (format locatii_cu_categorii.json)
    - list of places (old simple format)
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Locations file not found: {path}")

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if isinstance(data, dict) and "locations" in data:
        places = data["locations"]
    elif isinstance(data, list):
        places = data
    else:
        raise ValueError("Unexpected JSON structure for locations")

    if not isinstance(places, list):
        raise ValueError("Expected 'locations' to be a list")

    return places


# ------------- Basic helpers -------------


def extract_city(address: str) -> str:
    """Extract city as the last component of the address (after the last comma)."""
    if not address:
        return ""
    parts = [p.strip() for p in address.split(",") if p.strip()]
    return parts[-1] if parts else ""


def format_place_for_prompt(place: Dict[str, Any], idx: int) -> str:
    """
    Format a place into a readable string for the prompt.

    We include: name, city, address, rating, categories, short_description.
    """
    name = place.get("name", f"Place {idx}")
    address = place.get("address", "")
    rating = place.get("rating", None)
    short_desc = place.get("short_description", "")
    categories = place.get("categories", [])

    city = extract_city(address)

    lines = [f"{idx}. {name}"]
    details = []
    if city:
        details.append(f"city: {city}")
    if address:
        details.append(f"address: {address}")
    if rating is not None:
        details.append(f"rating: {rating}")

    if details:
        lines.append(" | ".join(details))

    if categories:
        lines.append("categories: " + ", ".join(categories))

    if short_desc:
        lines.append(f"description: {short_desc}")

    return "\n".join(lines)


def build_places_block(places: List[Dict[str, Any]]) -> str:
    """Build a single text block with all places in the dataset."""
    lines: List[str] = []
    for idx, place in enumerate(places, start=1):
        lines.append(format_place_for_prompt(place, idx))
        lines.append("")  # empty line between places
    return "\n".join(lines)


# ------------- Language + intent detection -------------


# translation table for Romanian diacritics -> ASCII
_DIACRITIC_TRANS = str.maketrans(
    {
        "ă": "a",
        "â": "a",
        "î": "i",
        "ș": "s",
        "ş": "s",
        "ț": "t",
        "ţ": "t",
    }
)


def normalize_for_intent(text: str) -> str:
    """Lowercase + remove Romanian diacritics for matching."""
    text = text.lower()
    return text.translate(_DIACRITIC_TRANS)


def tokenize_intent(text: str) -> List[str]:
    """Tokenize using normalized text (no diacritics)."""
    normalized = normalize_for_intent(text)
    return re.findall(r"[a-z]+", normalized)


def detect_language(text: str) -> str:
    """
    Simple RO vs EN detection based on tokens.
    Returns 'ro' or 'en'.
    """
    tokens = set(tokenize_intent(text))

    ro_hints = {
        "unde",
        "ce",
        "imi",
        "vreau",
        "pot",
        "nu",
        "loc",
        "locuri",
        "locatii",
        "oras",
        "mancare",
        "cafea",
        "cafenea",
        "cafenele",
        "pranz",
        "cina",
        "prieteni",
        "gasca",
        "ieftin",
        "scump",
    }

    en_hints = {
        "what",
        "where",
        "which",
        "places",
        "place",
        "location",
        "locations",
        "coffee",
        "brunch",
        "breakfast",
        "lunch",
        "dinner",
        "cheap",
        "expensive",
        "friends",
        "date",
        "cozy",
        "burger",
        "pizza",
        "vegan",
        "pub",
        "bar",
        "remote",
        "work",
    }

    ro_hits = len(tokens & ro_hints)
    en_hits = len(tokens & en_hints)

    if en_hits > ro_hits:
        return "en"
    if ro_hits > en_hits:
        return "ro"

    # fallback: dacă apar clar cuvinte englezești
    if tokens & en_hints:
        return "en"

    # altfel default RO (aplicația e locală)
    return "ro"


CITY_TOKENS = {
    "bucharest",
    "bucuresti",
    "cluj",
    "napoca",
    "clujnapoca",
    "timisoara",
    "iasi",
    "brasov",
    "sibiu",
    "constanta",
    "oradea",
    "galati",
    "craiova",
    "ploiesti",
    "targu",
    "targumures",
    "mures",
    "alba",
    "iulia",
}


def is_all_places_question(query: str) -> bool:
    """
    Detect queries like:
    - 'Ce locații ai în aplicație?'
    - 'Ce locații ai în baza ta de date?'
    - 'What locations do you have?'
    - 'List all places you know'
    """
    tokens = set(tokenize_intent(query))

    # dacă apare un oraș, nu tratăm ca întrebare globală
    if tokens & CITY_TOKENS:
        return False

    # Romanian: questions explicitly about "locații / locuri"
    if {"locatii", "locuri", "localuri"} & tokens:
        if {"ce", "care"} & tokens and {"ai", "aveti", "sunt"} & tokens:
            return True
        if "aplicatie" in tokens:
            return True
        if "baza" in tokens and "date" in tokens:
            return True
        if "toate" in tokens:
            return True

    # English: all places / locations you have
    if ("places" in tokens or "locations" in tokens) and (
        "all" in tokens
        or "list" in tokens
        or ("have" in tokens and "you" in tokens)
    ):
        return True

    return False


def is_restaurants_list_question(query: str) -> bool:
    """
    Detect queries like:
    - 'Poți să-mi listezi toate restaurantele pe care le știi?'
    - 'List all restaurants you know'
    """
    tokens = set(tokenize_intent(query))

    if {"restaurant", "restaurante", "restaurantele", "restaurants"} & tokens:
        if {"toate", "all", "listezi", "list"} & tokens:
            return True
        if "stii" in tokens or "stiti" in tokens or "know" in tokens:
            return True

    return False


def is_cafes_list_question(query: str) -> bool:
    """
    Detect queries like:
    - 'Ce cafenele ai în baza ta de date?'
    - 'What coffee shops do you have?'
    """
    tokens = set(tokenize_intent(query))

    cafe_tokens = {
        "cafenea",
        "cafenele",
        "cafea",
        "cafe",
        "coffee",
        "coffeeshop",
        "coffeeshops",
        "shop",
        "shops",
    }
    has_cafe_word = bool(cafe_tokens & tokens)

    if not has_cafe_word:
        return False

    # Romanian list-style
    if {"ce", "care", "toate"} & tokens and {"ai", "aveti"} & tokens:
        return True
    if "baza" in tokens and "date" in tokens:
        return True
    if "listezi" in tokens or "list" in tokens:
        return True

    # English: "what coffee shops do you have"
    if "what" in tokens and ("have" in tokens or "got" in tokens):
        return True

    return False


# ------------- Type classification via categories -------------


RESTAURANT_CATEGORIES = {
    "Mâncare tradițională",
    "Pizza & Italian",
    "Fast-food / Kebab",
    "Burger & Street Food",
    "Seafood / Pește",
    "Restaurant",
    "Vegan / Healthy",
    "Bar / Pub & Social",
}

CAFE_CATEGORIES = {
    "Cafea / Study",
    "Mic dejun & Brunch",
}


def get_restaurants(places: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Return places that look like restaurants / mâncare."""
    result: List[Dict[str, Any]] = []
    for p in places:
        cats = set(p.get("categories", []))
        if cats & RESTAURANT_CATEGORIES:
            result.append(p)
    return result


def get_cafes(places: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Return places that look like cafés / coffee places."""
    result: List[Dict[str, Any]] = []
    for p in places:
        cats = set(p.get("categories", []))
        if cats & CAFE_CATEGORIES:
            result.append(p)
    return result


def _format_rating(rating: Any) -> str:
    try:
        val = float(rating)
        return f"{val:.1f}"
    except (TypeError, ValueError):
        return str(rating) if rating is not None else "?"


# ------------- Direct answers (fără Groq) -------------


def handle_list_all_places(places: List[Dict[str, Any]], lang: str) -> str:
    """Answer 'what locations do you have' using ONLY Python."""
    total = len(places)

    # group by city
    by_city: Dict[str, List[Dict[str, Any]]] = {}
    for p in places:
        city = extract_city(p.get("address", "")) or "Other"
        by_city.setdefault(city, []).append(p)

    lines: List[str] = []

    if lang == "en":
        lines.append(f"I know {total} places in the app. Here they are grouped by city:")
    else:
        lines.append(f"Am {total} locații în aplicație. Uite-le grupate pe oraș:")

    for city in sorted(by_city.keys()):
        lines.append(f"\n{city}:")
        for p in by_city[city]:
            name = p.get("name", "Unknown place")
            rating_str = _format_rating(p.get("rating"))
            lines.append(f"  • {name} (rating {rating_str})")

    return "\n".join(lines)


def handle_list_restaurants(places: List[Dict[str, Any]], lang: str) -> str:
    """Answer 'list all restaurants you know'."""
    restaurants = get_restaurants(places)
    if not restaurants:
        if lang == "en":
            return "I don't have any restaurants in my dataset yet."
        else:
            return "Momentan nu am restaurante în baza de date."

    # group by city
    by_city: Dict[str, List[Dict[str, Any]]] = {}
    for p in restaurants:
        city = extract_city(p.get("address", "")) or "Other"
        by_city.setdefault(city, []).append(p)

    lines: List[str] = []
    if lang == "en":
        lines.append("Here are all the restaurants and food places I know, grouped by city:")
    else:
        lines.append(
            "Uite toate restaurantele și locurile de mâncare pe care le am în aplicație, grupate pe oraș:"
        )

    for city in sorted(by_city.keys()):
        lines.append(f"\n{city}:")
        for p in by_city[city]:
            name = p.get("name", "Unknown place")
            rating_str = _format_rating(p.get("rating"))
            lines.append(f"  • {name} (rating {rating_str})")

    return "\n".join(lines)


def handle_list_cafes(places: List[Dict[str, Any]], lang: str) -> str:
    """Answer 'what cafes / coffee shops do you have'."""
    cafes = get_cafes(places)
    if not cafes:
        if lang == "en":
            return "I don't have any cafés or coffee shops in my dataset yet."
        else:
            return "Momentan nu am cafenele în baza de date."

    by_city: Dict[str, List[Dict[str, Any]]] = {}
    for p in cafes:
        city = extract_city(p.get("address", "")) or "Other"
        by_city.setdefault(city, []).append(p)

    lines: List[str] = []
    if lang == "en":
        lines.append("Here are all the cafés and coffee places I know:")
    else:
        lines.append("Uite toate cafenelele și locurile de cafea pe care le am în aplicație:")

    for city in sorted(by_city.keys()):
        lines.append(f"\n{city}:")
        for p in by_city[city]:
            name = p.get("name", "Unknown place")
            rating_str = _format_rating(p.get("rating"))
            lines.append(f"  • {name} (rating {rating_str})")

    return "\n".join(lines)


# ------------- Groq wrapper -------------


def call_groq(
    client: Groq,
    model: str,
    messages: List[Dict[str, str]],
    max_tokens: int = 260,
    temperature: float = 0.25,
) -> str:
    """
    Small wrapper around Groq chat completions.

    V2: temperatură mai mică pentru răspunsuri mai stabile.
    """
    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return completion.choices[0].message.content.strip()


# ------------- Vibe generator (for a single place) -------------


def generate_vibe_for_place(
    client: Groq,
    model: str,
    place: Dict[str, Any],
) -> str:
    """Generate a vibe description in Romanian for a single place."""
    system_msg = {
        "role": "system",
        "content": (
            "Ești un copywriter local pentru o aplicație de ghid al orașului din România. "
            "Scrii descrieri prietenoase, la persoana a doua, în limba română. "
            "Nu inventezi detalii factuale noi (program exact, prețuri exacte), "
            "dar poți colora puțin tonul (atmosferă, vibe, tip de oameni care vin aici)."
        ),
    }

    name = place.get("name", "Loc fără nume")
    address = place.get("address", "")
    rating = place.get("rating", None)
    short_desc = place.get("short_description", "")
    categories = place.get("categories", [])

    user_lines = [
        f"Nume: {name}",
        f"Descriere inițială: {short_desc}",
        f"Categorii: {', '.join(categories)}",
    ]
    if address:
        user_lines.append(f"Adresă: {address}")
    if rating is not None:
        user_lines.append(f"Rating: {rating}")

    user_lines.append(
        "\nTe rog să scrii o descriere vibe în română, "
        "aproximativ 80–120 de cuvinte, ton relaxat, ca un prieten local. "
        "Include 1–2 propoziții despre atmosferă și pentru ce tip de oameni "
        "sau ocazii se potrivește locul (work from cafe, ieșit cu prietenii, întâlniri etc.)."
    )

    user_msg = {
        "role": "user",
        "content": "\n".join(user_lines),
    }

    # temperatură 0.25 pentru stabilitate, dar încă suficient de creativ
    return call_groq(client, model, [system_msg, user_msg], max_tokens=220, temperature=0.25)


# ------------- Chatbot loop (consolă) -------------


def chatbot_loop(client: Groq, model: str, places: List[Dict[str, Any]]) -> None:
    """
    Console chat loop using ALL JSON places as knowledge base.

    - User can talk in Romanian or English.
    - Bot answers in the SAME language as the last user message.
    - Certain list-type questions are answered directly from Python
      (no Groq, no halucinații, listă completă).
    - LLM vede și câmpul 'categories' pentru fiecare loc.
    """
    print("\n=== Chatbot AI (scrie 'exit' ca să ieși) ===\n")

    history: List[Dict[str, str]] = []
    places_block = build_places_block(places)

    while True:
        user_input = input("Tu: ").strip()
        if user_input.lower() in {"exit", "quit", "q"}:
            print("Ies din chat.\n")
            break

        history.append({"role": "user", "content": user_input})
        lang = detect_language(user_input)

        # 1) Hard-coded intents (no Groq cost, răspuns 100% din JSON)
        try:
            if is_all_places_question(user_input):
                answer = handle_list_all_places(places, lang)
                history.append({"role": "assistant", "content": answer})
                print(f"\nBot: {answer}\n")
                continue

            if is_restaurants_list_question(user_input):
                answer = handle_list_restaurants(places, lang)
                history.append({"role": "assistant", "content": answer})
                print(f"\nBot: {answer}\n")
                continue

            if is_cafes_list_question(user_input):
                answer = handle_list_cafes(places, lang)
                history.append({"role": "assistant", "content": answer})
                print(f"\nBot: {answer}\n")
                continue
        except Exception as e:
            # dacă se întâmplă ceva ciudat în logică, nu blocăm chat-ul
            print(f"\n[Warning] Eroare în handler-ul local: {e}. Continui cu Groq.\n")

        # 2) Restul întrebărilor merg la Groq cu FULL list
        history_lines: List[str] = []
        # last few turns only, ca să nu umflăm prompt-ul
        for msg in history[-6:]:
            prefix = "User" if msg["role"] == "user" else "Asistent"
            history_lines.append(f"{prefix}: {msg['content']}")
        history_text = "\n".join(history_lines)

        system_msg = {
            "role": "system",
            "content": (
                "You are a friendly local city guide assistant for a mobile app in Romania.\n"
                "- The user can write either in Romanian or in English.\n"
                "- ALWAYS answer in the SAME language as the last user message.\n"
                "- You receive the FULL list of all places that exist in the app.\n"
                "- For each place you know: name, city, address, rating (1–5), categories "
                "(like 'Cafea / Study', 'Pizza & Italian', 'Vegan / Healthy', etc.) "
                "and a short text description.\n"
                "- You MUST NOT invent any other factual details that are not clearly implied "
                "by these fields. In particular, do NOT invent exact prices, menus, discounts, "
                "opening hours, Wi-Fi availability, parking, or booking options.\n"
                "- If the user asks about something that is not in the data, clearly say that "
                "this information is not available in the current dataset, and then you can "
                "still recommend 1–3 places based on rating, categories and description.\n"
                "- You MUST ONLY use and recommend places from the list I provide "
                "(do not invent new venues or addresses).\n"
                "- If the question asks for a recommendation, suggest 1–3 options and explain briefly why, "
                "using the categories to match the vibe (e.g. 'Cafea / Study' for coffee + work, "
                "'Bar / Pub & Social' for going out with friends, 'Vegan / Healthy' for light, healthy food, etc.).\n"
                "- If the user explicitly asks for a specific type (for example ONLY burgers, ONLY pizza, "
                "ONLY vegan), then recommend ONLY places whose categories clearly match that type. "
                "Do not add extra places that do not really match, unless you have zero direct matches.\n"
                "- If the user mentions a city, prefer places from that city.\n"
                "- If you truly cannot find a matching place in the list, say clearly that "
                "you do not have that type of place in the current dataset.\n"
                "- Tone: friendly, relaxed, like a local friend. Keep answers short (2–5 sentences).\n"
                "- In Romanian, use natural phrases like 'îți recomand...' or 'poți merge la...'. "
                "Avoid stiff or repetitive wording like 'te pot recomanda la'.\n"
                "- When you mention ratings, do it briefly (e.g. 'are rating 4.8'), "
                "not in every sentence."
            ),
        }

        user_msg = {
            "role": "user",
            "content": (
                "Below you have the recent chat with the user and then the FULL list "
                "of all places available in the city guide app.\n\n"
                "=== Recent conversation ===\n"
                f"{history_text}\n\n"
                "=== ALL places in the dataset ===\n"
                f"{places_block}\n\n"
                "Now answer ONLY the LAST user message, using ONLY the places above."
            ),
        }

        reply = call_groq(
            client,
            model,
            [system_msg, user_msg],
            max_tokens=380,
            temperature=0.25,
        )
        history.append({"role": "assistant", "content": reply})

        print(f"\nBot: {reply}\n")


# ------------- Single-turn API for app (cu filtrare pe oraș) -------------


def answer_message(
    client: Groq,
    model: str,
    places: List[Dict[str, Any]],
    history: List[Dict[str, str]],
    user_input: str,
) -> Dict[str, Any]:
    """
    Single-turn variant of the chatbot, pentru integrat în aplicație.

    Primește:
      - client: Groq(...)
      - model: numele modelului (ex: 'llama-3.3-70b-versatile')
      - places: lista completă de locații încărcate din JSON
      - history: listă de mesaje anterioare [{"role": "user"|"assistant", "content": "..."}]
      - user_input: ultimul mesaj al utilizatorului (string)

    Returnează:
      {
        "reply": <răspunsul botului ca string>,
        "history": <istoricul actualizat (cu user + assistant)>
      }

    V2: bugfix pentru București/Bucharest – nu mai amestecă orașele.
    """
    # clonăm history ca să nu-l modificăm accidental în afara funcției
    history = list(history)
    history.append({"role": "user", "content": user_input})
    lang = detect_language(user_input)

    # 1) Încercăm întâi handler-ele locale (liste de locuri, restaurante, cafenele)
    try:
        if is_all_places_question(user_input):
            answer = handle_list_all_places(places, lang)
            history.append({"role": "assistant", "content": answer})
            return {"reply": answer, "history": history}

        if is_restaurants_list_question(user_input):
            answer = handle_list_restaurants(places, lang)
            history.append({"role": "assistant", "content": answer})
            return {"reply": answer, "history": history}

        if is_cafes_list_question(user_input):
            answer = handle_list_cafes(places, lang)
            history.append({"role": "assistant", "content": answer})
            return {"reply": answer, "history": history}
    except Exception as e:
        # dacă se întâmplă ceva ciudat în logică, nu blocăm chat-ul
        print(f"[Warning] Eroare în handler-ul local: {e} – continui cu Groq.")

    # 2) Restul întrebărilor merg la Groq cu listă FILTRATĂ pe oraș (dacă apare în întrebare)

    # mapare token -> numele orașului EXACT cum apare în adrese
    # IMPORTANT: aici folosim 'Bucharest' (nu 'București') ca să se potrivească cu JSON-ul.
    city_tokens_ro = {
        # București
        "bucuresti": "Bucharest",
        "bucharest": "Bucharest",
        # alte orașe (aceste valori se potrivesc cu ce ai în JSON)
        "ploiesti": "Ploiești",
        "cluj": "Cluj-Napoca",
        "clujnapoca": "Cluj-Napoca",
        "iasi": "Iași",
        "brasov": "Brașov",
        "sibiu": "Sibiu",
        "constanta": "Constanța",
        "timisoara": "Timișoara",
        "oradea": "Oradea",
        "galati": "Galați",
        "craiova": "Craiova",
        "targumures": "Târgu Mureș",
        "mures": "Târgu Mureș",
        "alba": "Alba Iulia",
        "iulia": "Alba Iulia",
    }

    norm_query = normalize_for_intent(user_input)
    city_in_query = None
    for token, city_name in city_tokens_ro.items():
        if token in norm_query:
            city_in_query = city_name
            break

    if city_in_query:
        # filtrăm locațiile STRICT după numele de oraș din adrese
        filtered_places = [
            p
            for p in places
            if extract_city(p.get("address", "")).strip().lower()
            == city_in_query.lower()
        ]

        # dacă nu găsim nimic, folosește toată lista,
        # dar îi spunem LLM-ului explicit că nu avem locații în orașul cerut
        no_matches_for_city = len(filtered_places) == 0
        if not filtered_places:
            filtered_places = places
    else:
        filtered_places = places
        no_matches_for_city = False

    places_block = build_places_block(filtered_places)

    # construim history scurt pentru LLM
    history_lines: List[str] = []
    for msg in history[-6:]:
        prefix = "User" if msg["role"] == "user" else "Asistent"
        history_lines.append(f"{prefix}: {msg['content']}")
    history_text = "\n".join(history_lines)

    # mesaj de context despre oraș
    if city_in_query and not no_matches_for_city:
        city_hint = (
            f"\nA city was detected in the user's message: {city_in_query}. "
            "You MUST ONLY recommend places from this city and MUST NOT suggest "
            "places from other cities."
        )
    elif city_in_query and no_matches_for_city:
        city_hint = (
            f"\nThe user asked for the city '{city_in_query}', but there are NO places "
            "from this city in the dataset. You MUST say this clearly. After that, you "
            "MAY recommend 1–2 alternatives from other cities, but say explicitly that "
            "they are in a different city."
        )
    else:
        city_hint = ""

    system_msg = {
        "role": "system",
        "content": (
            "You are a friendly local city guide assistant for a mobile app in Romania.\n"
            "- The user can write either in Romanian or in English.\n"
            "- ALWAYS answer in the SAME language as the last user message.\n"
            "- You receive the list of places that are in scope for this question "
            "(possibly already filtered by city).\n"
            "- For each place you know: name, city, address, rating (1–5), categories "
            "(like 'Cafea / Study', 'Pizza & Italian', 'Vegan / Healthy', etc.) "
            "and a short text description.\n"
            "- You MUST NOT invent any other factual details that are not clearly implied "
            "by these fields. In particular, do NOT invent exact prices, menus, discounts, "
            "opening hours, Wi-Fi availability, parking, or booking options.\n"
            "- You MUST ONLY use and recommend places from the list I provide "
            "(do not invent new venues or addresses).\n"
            "- If the question asks for a recommendation, suggest 1–3 options and explain briefly why, "
            "using the categories to match the vibe (e.g. 'Cafea / Study' for coffee + work, "
            "'Bar / Pub & Social' for going out with friends, 'Vegan / Healthy' for light, healthy food, etc.).\n"
            "- If the user explicitly asks for a specific type (for example ONLY burgers, ONLY pizza, "
            "ONLY vegan), then recommend ONLY places whose categories clearly match that type. "
            "Do not add extra places that do not really match, unless you have zero direct matches.\n"
            "- If you truly cannot find a matching place in the list, say clearly that "
            "you do not have that type of place in the current dataset.\n"
            "- Tone: friendly, relaxed, like a local friend. Keep answers short (2–5 sentences).\n"
            "- In Romanian, use natural phrases like 'îți recomand...' or 'poți merge la...'. "
            "Avoid stiff or repetitive wording like 'te pot recomanda la'.\n"
            "- When you mention ratings, do it briefly (e.g. 'are rating 4.8'), "
            "not in every sentence."
            f"{city_hint}"
        ),
    }

    user_msg = {
        "role": "user",
        "content": (
            "Below you have the recent chat with the user and then the list of "
            "places available in the city guide app (already filtered if a city was mentioned).\n\n"
            "=== Recent conversation ===\n"
            f"{history_text}\n\n"
            "=== Places in scope ===\n"
            f"{places_block}\n\n"
            "Now answer ONLY the LAST user message, using ONLY the places above."
        ),
    }

    reply = call_groq(
        client,
        model,
        [system_msg, user_msg],
        max_tokens=380,
        temperature=0.25,
    )

    history.append({"role": "assistant", "content": reply})
    return {"reply": reply, "history": history}


# ------------- Main debug menu -------------


def main() -> None:
    """Main debug entrypoint: simple console menu."""
    config = load_config()
    client = Groq(api_key=config["api_key"])
    places = load_places(config["locations_path"])

    print("=== Thecon Hackathon AI Debug (Chat_Bot_Groq_final.py v2) ===")
    print(f"Loaded {len(places)} places from {os.path.abspath(config['locations_path'])}")
    print("Model:", config["model"])
    print()

    while True:
        print("Alege o opțiune:")
        print("1) Listează primele 5 locații")
        print("2) Generează Vibe pentru o locație")
        print("3) Pornește Chatbot AI (consolă)")
        print("0) Ieșire")
        choice = input("> ").strip()

        if choice == "0":
            print("La revedere!")
            break

        elif choice == "1":
            print("\nPrimele 5 locații:\n")
            for idx, place in enumerate(places[:5], start=1):
                print(format_place_for_prompt(place, idx))
                print("-" * 40)
            print()

        elif choice == "2":
            print(f"\nAi {len(places)} locații în total.")
            idx_str = input("Introdu indexul locației (1-based, ex: 1): ").strip()
            if not idx_str.isdigit():
                print("Index invalid.\n")
                continue

            idx = int(idx_str)
            if not (1 <= idx <= len(places)):
                print("Index în afara intervalului.\n")
                continue

            place = places[idx - 1]
            print("\nLoc selectat:")
            print(format_place_for_prompt(place, idx))
            print("\nGenerez descriere vibe.\n")

            try:
                vibe = generate_vibe_for_place(client, config["model"], place)
                print("=== Vibe generat ===\n")
                print(vibe)
                print("\n====================\n")
            except Exception as e:
                print(f"Eroare la generare vibe: {e}\n")

        elif choice == "3":
            try:
                chatbot_loop(client, config["model"], places)
            except Exception as e:
                print(f"Eroare în chat: {e}\n")

        else:
            print("Opțiune necunoscută.\n")


if __name__ == "__main__":
    main()

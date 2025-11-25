#!/usr/bin/env python
import sys
import json
import os
from typing import List, Dict, Any

# --- PATH setup (backend + libs) ---

BASE_DIR = os.path.dirname(__file__)
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, "libs"))

from groq import Groq
# dacă fișierul tău se numește altfel, schimbă linia de mai jos
from Chat_Bot_Groq_final_v2 import (
    load_config,
    load_places,
    answer_message,
    generate_vibe_for_place,
)

# ----------------- Global init -----------------

CONFIG = load_config()
CLIENT = Groq(api_key=CONFIG["api_key"])
PLACES = load_places(CONFIG["locations_path"])
MODEL = CONFIG["model"]


# ----------------- helper: chat -----------------


def chat_single_turn(message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
    if not isinstance(history, list):
        history = []

    cleaned_history: List[Dict[str, str]] = []
    for item in history:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role in {"user", "assistant"} and isinstance(content, str):
            cleaned_history.append({"role": role, "content": content})

    result = answer_message(
        client=CLIENT,
        model=MODEL,
        places=PLACES,
        history=cleaned_history,
        user_input=message,
    )

    return {
        "reply": result.get("reply", ""),
        "history": result.get("history", cleaned_history),
    }


# ----------------- helper: vibe -----------------


def vibe_for_place_index(place_index: int) -> Dict[str, Any]:
    """
    Generează vibe pentru o locație, după index 1-based (ca în meniul din consolă).
    """
    if not (1 <= place_index <= len(PLACES)):
        raise ValueError(
            f"place_index out of range: {place_index} (1..{len(PLACES)})"
        )

    place = PLACES[place_index - 1]  # 1-based -> 0-based
    vibe_text = generate_vibe_for_place(CLIENT, MODEL, place)

    return {
        "place_index": place_index,
        "place_name": place.get("name", ""),
        "vibe": vibe_text,
    }


# ----------------- CLI interface (Node / curl) -----------------


def main() -> None:
    """
    Input pe stdin (JSON):

      {
        "mode": "chat",
        "message": "Salut...",
        "history": [ ... ]
      }

    sau:

      {
        "mode": "vibe",
        "place_index": 3
      }

    Output (JSON) pentru mode=chat:

      {
        "reply": "...",
        "history": [ ... ]
      }

    Output (JSON) pentru mode=vibe:

      {
        "place_index": 3,
        "place_name": "...",
        "vibe": "text vibe..."
      }
    """

    # health check: python chatBot.py --ping
    if len(sys.argv) > 1 and sys.argv[1] == "--ping":
        print(json.dumps({"status": "ok", "version": "chatBot.py v2"}, ensure_ascii=False))
        return

    raw = sys.stdin.read()

    if not raw.strip():
        print(json.dumps({"error": "empty_input"}, ensure_ascii=False))
        return

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(
            json.dumps(
                {"error": "invalid_json", "details": str(e)},
                ensure_ascii=False,
            )
        )
        return

    mode = data.get("mode", "chat")

    try:
        if mode == "chat":
            message = data.get("message", "")
            history = data.get("history", [])

            if not isinstance(message, str) or not message.strip():
                print(json.dumps({"error": "message_required"}, ensure_ascii=False))
                return

            result = chat_single_turn(message=message, history=history)
            print(json.dumps(result, ensure_ascii=False))
            return

        elif mode == "vibe":
            place_index = data.get("place_index", None)
            if not isinstance(place_index, int):
                print(
                    json.dumps(
                        {
                            "error": "place_index_required",
                            "details": "For mode='vibe' you must send an integer 'place_index' (1-based).",
                        },
                        ensure_ascii=False,
                    )
                )
                return

            result = vibe_for_place_index(place_index)
            print(json.dumps(result, ensure_ascii=False))
            return

        else:
            print(
                json.dumps(
                    {"error": "unknown_mode", "details": f"mode='{mode}'"},
                    ensure_ascii=False,
                )
            )
            return

    except Exception as e:
        print(
            json.dumps(
                {"error": "internal_error", "details": str(e)},
                ensure_ascii=False,
            )
        )


if __name__ == "__main__":
    main()
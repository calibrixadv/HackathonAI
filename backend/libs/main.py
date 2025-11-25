from typing import List, Literal

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq

from ../Chat_Bot_Groq_final_v2 import (  # sau Chat_Bot_Groq_final dacă așa se numește la tine
    load_config,
    load_places,
    answer_message,
    generate_vibe_for_place,
)

# ----------------- Models -----------------


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    history: List[ChatMessage]


class VibeRequest(BaseModel):
    place_index: int  # 1-based


class VibeResponse(BaseModel):
    place_index: int
    place_name: str
    vibe: str


# ----------------- App init -----------------

app = FastAPI(title="Spot&Snack AI API")

config = load_config()
client = Groq(api_key=config["api_key"])
places = load_places(config["locations_path"])
model = config["model"]


# ----------------- Routes -----------------


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(body: ChatRequest):
    if not body.message.strip():
        raise HTTPException(status_code=400, detail="message is required")

    history_dicts = [{"role": m.role, "content": m.content} for m in body.history]

    result = answer_message(
        client=client,
        model=model,
        places=places,
        history=history_dicts,
        user_input=body.message,
    )

    reply = result.get("reply", "")
    history_out = result.get("history", history_dicts)

    history_models = [
        ChatMessage(role=m["role"], content=m["content"]) for m in history_out
    ]

    return ChatResponse(reply=reply, history=history_models)


@app.post("/vibe", response_model=VibeResponse)
async def vibe_endpoint(body: VibeRequest):
    idx = body.place_index
    if not (1 <= idx <= len(places)):
        raise HTTPException(
            status_code=400,
            detail=f"place_index out of range (1..{len(places)})",
        )

    place = places[idx - 1]
    vibe_text = generate_vibe_for_place(client, model, place)

    return VibeResponse(
        place_index=idx,
        place_name=place.get("name", ""),
        vibe=vibe_text,
    )
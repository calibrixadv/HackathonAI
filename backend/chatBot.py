import sys
import json

from Chat_Bot_Groq_final_v2 import load_config, load_places, answer_message
from groq import Groq

# Load config & places
config = load_config()
client = Groq(api_key=config["api_key"])
places = load_places(config["locations_path"])

if __name__ == "__main__":
    try:
        # primim JSON de la Node.js
        input_data = json.loads(sys.stdin.read())
        message = input_data.get("message", "")
        history = input_data.get("history", [])

        if not message:
            raise ValueError("Message is required")

        result = answer_message(client, config["model"], places, history, message)
        # trimite JSON către Node.js
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

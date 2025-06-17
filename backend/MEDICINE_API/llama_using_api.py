import sys
import os
from cerebras.cloud.sdk import Cerebras
from image_to_text import auto_text

file_path = sys.argv[1]
report = auto_text(file_path)




user_prompt = (
        "You are a senior medical consultant. Analyze the provided medical report, "
        "summarize it, and list all medications with their side effects.\n\n"
        + report
)
def LLM_ANS(user_prompt):
    API_KEY = os.environ.get("CEREBRAS_API_KEY", "csk-kjdnkhmmcrw4wfced48mjrjmpejewktm2392kx4k3vm2n56c") # expected key name

    if not API_KEY:
        raise ValueError("Missing Cerebras API key. Please set the environment variable 'CS_API_KEY'.")

    # === Create Cerebras client ===
    client = Cerebras(api_key=API_KEY)
    try:
        chat_completion = client.chat.completions.create(
            model="llama3.1-8b",
            messages=[{"role": "user", "content": user_prompt}],
        )
        print(chat_completion.choices[0].message.content)

    except Exception as e:
        print("Error during Cerebras API call:", str(e))

LLM_ANS(user_prompt)
import sys
import os
from cerebras.cloud.sdk import Cerebras
from image_to_text import auto_text

sys.stdout.reconfigure(line_buffering=True)  # stream print outputs

file_path = sys.argv[1]
report = auto_text(file_path)

# print("Extracted report:\n", report[:300], "\n---\n")
# preview first 300 chars

user_prompt = (
    "You are a senior medical consultant. Analyze the provided medical report, "
    "summarize it, and list all medications with their side effects.\n\n"
    + report
)

def LLM_ANS(user_prompt):
    API_KEY = os.environ.get("CEREBRAS_API_KEY", "csk-kjdnkhmmcrw4wfced48mjrjmpejewktm2392kx4k3vm2n56c")

    if not API_KEY:
        raise ValueError("Missing Cerebras API key.")

    client = Cerebras(api_key=API_KEY)

    print("Sending prompt to LLM...\n")

    try:
        chat_completion = client.chat.completions.create(
            model="llama3.1-8b",
            messages=[{"role": "user", "content": user_prompt}],
        )

        print("LLM Response:\n")

        response = chat_completion.choices[0].message.content
        for line in response.split('\n'):
            print(line)

    except Exception as e:
        print("Error during Cerebras API call:", str(e))

LLM_ANS(user_prompt)

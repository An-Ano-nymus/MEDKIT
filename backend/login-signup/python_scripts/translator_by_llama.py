import sys
import os
from cerebras.cloud.sdk import Cerebras
from image_to_text import auto_text

sys.stdout.reconfigure(encoding='utf-8',line_buffering=True)  # stream print outputs

file_path = sys.argv[1]
report = auto_text(file_path)
source_lang=sys.argv[2]
target_lang=sys.argv[3]

# print("Extracted report:\n", report[:300], "\n---\n")
# preview first 300 chars





def LLM_ANS(source_lang,target_lang):
    user_prompt = (
    f"Translate this report from {source_lang} to {target_lang} in a easy to understand language :\n\n"
    + report
    )
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



LLM_ANS(source_lang,target_lang)

import sys
import json
from image_to_text import auto_text
from cerebras.cloud.sdk import Cerebras
import os

def analyze(path):
    report = auto_text(path)
    prompt = (
    "You are a senior medical consultant. Analyze the provided medical report, "
    "summarize it, and list all medications with their side effects.\n\n" + report
    )
    client = Cerebras(api_key=os.getenv("CEREBRAS_API_KEY"))
    response = client.chat.completions.create(
        model="llama3.1-8b",
        messages=[{"role": "user", "content": prompt}]
    )
    output = response.choices[0].message.content
    print(json.dumps({"output": output}))  # Return in JSON

if name == "main":
    file_path = sys.argv[1]
    analyze(file_path)
import os
import urllib.request
import json

api_key = os.environ.get("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"

payload = {
    "contents": [{
        "parts": [{"text": "Translate 'Hello' to Arabic"}]
    }]
}

headers = {'Content-Type': 'application/json'}
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(result['candidates'][0]['content']['parts'][0]['text'])
except Exception as e:
    print("Error:", e)

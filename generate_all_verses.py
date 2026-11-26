import os
import urllib.request
import urllib.parse
import urllib.error
import json
import re
import time

api_key = os.environ.get("GEMINI_API_KEY")
gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"

schema = {
    "type": "ARRAY",
    "items": {
        "type": "OBJECT",
        "properties": {
            "number": { "type": "INTEGER" },
            "arabic": { "type": "STRING" },
            "transliteration": { "type": "STRING" },
            "translation": {
                "type": "OBJECT",
                "properties": {
                    "en": { "type": "STRING" },
                    "ar": { "type": "STRING" },
                    "am": { "type": "STRING" },
                    "har": { "type": "STRING" }
                },
                "required": ["en", "ar", "am", "har"]
            }
        },
        "required": ["number", "arabic", "transliteration", "translation"]
    }
}

def call_gemini(prompt):
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": schema
        }
    }
    
    headers = {'Content-Type': 'application/json'}
    req = urllib.request.Request(gemini_url, data=json.dumps(payload).encode('utf-8'), headers=headers)
    
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                result = json.loads(response.read().decode('utf-8'))
                text = result['candidates'][0]['content']['parts'][0]['text'].strip()
                return text
        except urllib.error.HTTPError as e:
            if e.code == 429:
                sleep_time = 15 * (attempt + 1)
                print(f"Gemini API rate limited (429). Attempt {attempt+1}/8. Sleeping for {sleep_time} seconds...")
                time.sleep(sleep_time)
            else:
                print(f"Gemini API HTTP Error {e.code}. Attempt {attempt+1}/8. Retrying...")
                time.sleep(5)
        except Exception as e:
            print(f"Gemini API attempt {attempt+1}/8 failed with general error: {e}")
            time.sleep(5)
    return None

# Step 1: Fetch Arabic verses from Wikisource
print("Fetching Arabic verses from Wikisource...")
url = "https://ar.wikisource.org/wiki/" + urllib.parse.quote("نونية_القحطاني")
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

# Remove HTML tags cleanly and retain lines
text_with_no_tags = re.sub(r'<[^>]+>', '\n', html)
lines = [line.strip() for line in text_with_no_tags.split('\n') if line.strip()]

start_phrase = "يا منزل الآيات والفرقان"
start_idx = -1
for i, line in enumerate(lines):
    if start_phrase in line:
        start_idx = i
        break

if start_idx == -1:
    print("Could not find start phrase in Wikisource HTML!")
    exit(1)

end_phrase = "رحم الإله صداك"
poem_lines = []
for i in range(start_idx, len(lines)):
    line = lines[i]
    poem_lines.append(line)
    if end_phrase in line:
        break

# Pair up lines
wikisource_verses = []
for j in range(0, len(poem_lines), 2):
    if j + 1 < len(poem_lines):
        shatr1 = poem_lines[j]
        shatr2 = poem_lines[j+1]
        wikisource_verses.append(f"{shatr1} ... {shatr2}")
    else:
        wikisource_verses.append(poem_lines[j])

total_verses_count = len(wikisource_verses)
print(f"Total verses parsed from Wikisource: {total_verses_count}")

# Step 2: Determine starting state (Load from partial if exists)
partial_path = "components/nooniyahData_partial.json"
final_verses = []

if os.path.exists(partial_path):
    print(f"Found existing partial data at {partial_path}. Loading...")
    try:
        with open(partial_path, "r", encoding="utf-8") as pf:
            final_verses = json.load(pf)
        print(f"Successfully loaded {len(final_verses)} verses from checkpoint.")
    except Exception as e:
        print(f"Error loading checkpoint: {e}. Reverting to original 80.")

if not final_verses:
    print("No valid checkpoint found. Reading existing 80 verses from components/nooniyahData.ts...")
    filepath = "components/nooniyahData.ts"
    with open(filepath, 'r', encoding='utf-8') as f:
        existing_content = f.read()

    pattern = re.compile(r'\{\s*number:\s*(\d+),\s*arabic:\s*"([^"]+)",\s*transliteration:\s*"([^"]+)",\s*translation:\s*\{\s*en:\s*"([^"]+)",\s*ar:\s*"([^"]+)",\s*am:\s*"([^"]+)",\s*har:\s*"([^"]+)"\s*\}\s*\}', re.DOTALL)
    existing_matches = pattern.findall(existing_content)

    for m in existing_matches:
        final_verses.append({
            "number": int(m[0]),
            "arabic": m[1],
            "transliteration": m[2],
            "translation": {
                "en": m[3],
                "ar": m[4],
                "am": m[5],
                "har": m[6]
            }
        })
    print(f"Parsed {len(final_verses)} existing verses.")

# Ensure we sort the verses by number
final_verses.sort(key=lambda x: x["number"])

# Find the highest verse number we have
highest_completed = 0
if final_verses:
    highest_completed = max(v["number"] for v in final_verses)
print(f"Highest completed verse: {highest_completed}")

# Step 3: Loop through remaining verses and translate in batches
batch_size = 40
start_v_num = highest_completed + 1
end_v_num = total_verses_count

if start_v_num > end_v_num:
    print("All verses are already translated!")
else:
    print(f"Translating remaining verses from {start_v_num} to {end_v_num} in batches of {batch_size}...")

    for start in range(start_v_num, end_v_num + 1, batch_size):
        end = min(start + batch_size - 1, end_v_num)
        print(f"Processing Batch: Verses {start} to {end}...")
        
        # Prepare the list of verses for the prompt
        verses_sublist = []
        for num in range(start, end + 1):
            arabic_text = wikisource_verses[num - 1]
            verses_sublist.append(f"Verse {num}: {arabic_text}")
            
        verses_prompt_text = "\n".join(verses_sublist)
        
        prompt = f"""You are an expert translator and scholar of classical Islamic poetry and languages (English, Arabic, Amharic, Harari).
Below is a list of consecutive verses of the classical Arabic poem 'Nooniyah Al-Qahtani' (verses {start} to {end}).
For each verse, please provide:
1. 'transliteration': High-quality phonetic transliteration of the Arabic text into the Latin alphabet.
2. 'translation': An object with:
   - 'en': A poetic, accurate, and eloquent English translation of the verse's meaning.
   - 'ar': The exact Arabic text.
   - 'am': A precise, clear Amharic translation of the verse's meaning using Ge'ez script. Do not include raw unescaped newlines.
   - 'har': An accurate Harari translation (written in Ge'ez script). Do not include raw unescaped newlines.

Here are the verses:
{verses_prompt_text}
"""

        response_text = call_gemini(prompt)
        if not response_text:
            print(f"Error: Failed to get response for batch {start}-{end}")
            exit(1)
            
        try:
            batch_data = json.loads(response_text)
            print(f"Successfully parsed JSON for batch {start}-{end}. Received {len(batch_data)} verses.")
            
            # Map items and add to our list
            for item in batch_data:
                num = item.get("number")
                arabic = item.get("arabic", "")
                trans = item.get("transliteration", "")
                trans_obj = item.get("translation", {})
                en = trans_obj.get("en", "")
                ar_trans = trans_obj.get("ar", arabic)
                am = trans_obj.get("am", "")
                har = trans_obj.get("har", "")
                
                # Clean string replacements (newlines, spaces)
                en = en.replace('\n', ' ').replace('\r', '').strip()
                am = am.replace('\n', ' ').replace('\r', '').strip()
                har = har.replace('\n', ' ').replace('\r', '').strip()
                
                final_verses.append({
                    "number": int(num),
                    "arabic": arabic,
                    "transliteration": trans,
                    "translation": {
                        "en": en,
                        "ar": ar_trans,
                        "am": am,
                        "har": har
                    }
                })
                
            # Sort after addition
            final_verses.sort(key=lambda x: x["number"])
            
            # Save partial data as a checkpoint
            with open(partial_path, "w", encoding="utf-8") as pf:
                json.dump(final_verses, pf, ensure_ascii=False, indent=2)
            print(f"Saved checkpoint of {len(final_verses)} verses to {partial_path}")
            
        except Exception as e:
            print(f"JSON parsing error in batch {start}-{end}: {e}")
            print("Response received was:")
            print(response_text[:1000])
            exit(1)
            
        time.sleep(2) # Be a good citizen

# Step 4: Write the complete list back to components/nooniyahData.ts
print(f"Generation complete! Total verses: {len(final_verses)}")

filepath = "components/nooniyahData.ts"
ts_output = """export interface Verse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: {
    en: string;
    ar: string;
    am: string;
    har: string;
  };
}

export const nooniyahVerses: Verse[] = [
"""

for idx, v in enumerate(final_verses):
    # Escape quotes and backslashes properly for TS code string
    def clean_val(val):
        return val.replace('\\', '\\\\').replace('"', '\\"')

    arabic_esc = clean_val(v["arabic"])
    trans_esc = clean_val(v["transliteration"])
    en_esc = clean_val(v["translation"]["en"])
    ar_esc = clean_val(v["translation"]["ar"])
    am_esc = clean_val(v["translation"]["am"])
    har_esc = clean_val(v["translation"]["har"])
    
    ts_output += f'  {{\n'
    ts_output += f'    number: {v["number"]},\n'
    ts_output += f'    arabic: "{arabic_esc}",\n'
    ts_output += f'    transliteration: "{trans_esc}",\n'
    ts_output += f'    translation: {{\n'
    ts_output += f'      en: "{en_esc}",\n'
    ts_output += f'      ar: "{ar_esc}",\n'
    ts_output += f'      am: "{am_esc}",\n'
    ts_output += f'      har: "{har_esc}"\n'
    ts_output += f'    }}\n'
    if idx == len(final_verses) - 1:
        ts_output += f'  }}\n'
    else:
        ts_output += f'  }},\n'

ts_output += "];\n"

with open(filepath, 'w', encoding='utf-8') as out:
    out.write(ts_output)

# Clean up partial file if successful
if os.path.exists(partial_path):
    os.remove(partial_path)
    print(f"Removed temporary checkpoint file {partial_path}")

print("Successfully wrote components/nooniyahData.ts!")

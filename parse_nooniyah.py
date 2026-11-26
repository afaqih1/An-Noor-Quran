import urllib.request
import urllib.parse
import re

url = "https://ar.wikisource.org/wiki/" + urllib.parse.quote("نونية_القحطاني")

try:
    headers = {'User-Agent': 'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    
    text_with_no_tags = re.sub(r'<[^>]+>', '\n', html)
    lines = [line.strip() for line in text_with_no_tags.split('\n') if line.strip()]
    
    start_phrase = "يا منزل الآيات والفرقان"
    start_idx = -1
    for i, line in enumerate(lines):
        if start_phrase in line:
            start_idx = i
            break
            
    if start_idx != -1:
        end_phrase = "رحم الإله صداك"
        poem_lines = []
        for i in range(start_idx, len(lines)):
            line = lines[i]
            poem_lines.append(line)
            if end_phrase in line:
                break
                
        print(f"Checking {len(poem_lines)} lines for anomalies...")
        for idx, line in enumerate(poem_lines):
            # Check if line is a header (like Part X, or a subtitle)
            # A poetic shatr has no English words, is relatively short, doesn't contain "باب" or "فصل" or "الجزء" etc.
            if len(line) < 5 or "فصل" in line or "باب" in line or "الجزء" in line or any(char.isdigit() for char in line if char not in "١٢٣٤٥٦٧٨٩٠"):
                print(f"Line {idx} might be anomaly: '{line}'")
except Exception as e:
    print(f"Error: {e}")

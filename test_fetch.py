import urllib.request
import urllib.parse
import re

url = "https://ar.wikisource.org/wiki/" + urllib.parse.quote("نونية_القحطاني")
print(f"Fetching {url}...")

try:
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
    print(f"Successfully fetched! Length: {len(html)}")
    # Print some of the page
    print(html[:1000])
except Exception as e:
    print(f"Error: {e}")

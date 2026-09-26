import urllib.request
import re

url = "https://t.me/s/durov"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")

matches = re.findall(r'<div class="[^"]*js-message_text[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
print(f"Matches for js-message_text: {len(matches)}")
for i, m in enumerate(matches[:3], 1):
    clean = re.sub(r'<[^>]+>', '', m).strip()
    print(f"Post #{i}: {clean[:120].encode('ascii', 'ignore').decode('ascii')}\n")

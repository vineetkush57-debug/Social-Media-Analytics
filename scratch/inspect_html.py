import urllib.request
import re

url = "https://t.me/s/durov"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")

print("HTML length:", len(html))

# Find all divs with text/message
divs = re.findall(r'<div class="([^"]+)"', html)
classes = set(divs)
print("Top classes found:", [c for c in classes if "message" in c or "tgme" in c][:15])

# Print sample HTML snippet where posts are located
matches = re.findall(r'<div class="tgme_widget_message_[^"]+"[^>]*>(.*?)</div>', html, re.DOTALL)
print(f"Found {len(matches)} matches for tgme_widget_message_")
for i, m in enumerate(matches[:5]):
    clean = re.sub(r'<[^>]+>', ' ', m).strip()
    if clean:
        print(f"Sample {i+1}: {clean[:150]}")

import urllib.request
import re
from html import unescape

def fetch_real_telegram_posts(channel_handle: str):
    channel_clean = channel_handle.strip().replace("@", "")
    url = f"https://t.me/s/{channel_clean}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8")
        raw_matches = re.findall(r'class="tgme_widget_message_text[^">]*">(.*?)</div>', html, re.DOTALL)
        clean_posts = []
        for m in raw_matches:
            txt = re.sub(r'<br\s*/?>', '\n', m)
            txt = re.sub(r'<[^>]+>', '', txt)
            txt = unescape(txt).strip()
            if txt:
                clean_posts.append(txt)
        return clean_posts
    except Exception as e:
        print("Error fetching Telegram posts:", e)
        return []

if __name__ == "__main__":
    posts = fetch_real_telegram_posts("durov")
    print(f"Successfully scraped {len(posts)} REAL Telegram posts from @durov:")
    for i, p in enumerate(posts[:5], 1):
        print(f"[{i}] {p[:120]}...\n")

import urllib.request
import json

csv_content = """post_id,timestamp,platform,user_id,entity,entity_type,post_text,hashtags,likes,comments,shares,views,sentiment
301,2026-09-24 12:00:00,X,KohliSuperFan,Virat Kohli,Person,Virat Kohli smashes another milestone century in front of a packed stadium!,#ViratKohli,9800,1200,4500,185000,positive
302,2026-09-24 12:30:00,Telegram,SportsFlash,Virat Kohli,Person,Detailed tactical analysis of Virat Kohli cover drive mechanics.,#CricketAnalysis,2100,180,560,54000,positive
"""

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = (
    f"--{boundary}\r\n"
    'Content-Disposition: form-data; name="file"; filename="Entity_Demo_Dataset.csv"\r\n'
    "Content-Type: text/csv\r\n\r\n"
    f"{csv_content}\r\n"
    f"--{boundary}--\r\n"
).encode("utf-8")

req = urllib.request.Request(
    "http://127.0.0.1:8000/api/posts/upload",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST"
)

try:
    res = urllib.request.urlopen(req)
    data = json.loads(res.read().decode())
    print("Upload Response:")
    print(json.dumps(data, indent=2))
except Exception as e:
    print("Error:", e)

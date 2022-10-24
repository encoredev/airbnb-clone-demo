import requests
import sys
import json
import random

BASE_URL = "https://pr10-airbnb-mkg2.encr.app"

for ln in sys.stdin.readlines():
    data = json.loads(ln)

    try:
        dist = int(data["distance"].split()[0].replace(",", ""))
    except ValueError:
        continue

    beds = random.randint(1, 4)
    if random.randint(1, 6) == 6:
        beds += 2
    baths = random.randint(1, beds//2) if beds > 1 else 1

    price = int(data["pricePerNight"].split()[0].replace(",", "").lstrip("$"))
    resp = requests.post(BASE_URL+"/listing", json={
        "title": data["name"],
        "description": data.get("description", None),
        "location": data["location"],
        "distanceKm": dist,
        "pictures": data["imageURLs"],
        "tags": [data["tag"]],
        "numBeds": beds,
        "numBaths": baths,
        "pricePerNight": price,
        "rating": 3+round(random.random()*2, 2),
    })
    resp.raise_for_status()

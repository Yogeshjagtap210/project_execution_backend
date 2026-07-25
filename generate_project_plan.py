import csv
import json

filename = "Project  Plan  For  yogesh  Reference  - Sheet1 (1).csv"
print(f"Parsing {filename}...")

with open(filename, encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    next(reader) # skip title line
    headers = next(reader)
    rows = list(reader)

items = []
for idx, r in enumerate(rows):
    if not r or not r[0].strip():
        continue
    name = r[0].strip()
    cs_back = r[2].strip() if len(r) > 2 and r[2].strip() else "Radheshyam"
    date_created = r[3].strip() if len(r) > 3 and r[3].strip() else "May 26"
    start_date = r[4].strip() if len(r) > 4 and r[4].strip() else ""
    end_date = r[5].strip() if len(r) > 5 and r[5].strip() else ""
    
    duration = f"{start_date} - {end_date}" if start_date and end_date else start_date or "May 26 - Jun 26"

    items.append({
        "id": f"pp-{idx}",
        "name": name,
        "commentsCount": 0 if idx > 5 else (idx * 2) % 8,
        "commentsList": [],
        "csBack": cs_back,
        "csBackColor": "green" if cs_back == "Jayesh" else "purple",
        "dateCreated": date_created,
        "duration": duration,
        "durationBadgeColor": "orange",
        "w1Industry": r[6].strip() if len(r) > 6 else "Manufacturing",
        "w1CompanySize": r[7].strip() if len(r) > 7 else "51 to 200 employees",
        "w1Titles": r[8].strip() if len(r) > 8 else "CEO, Founder, CTO",
        "w1Region": r[9].strip() if len(r) > 9 else "Mumbai, Pune",
        "w2Industry": r[10].strip() if len(r) > 10 else "Manufacturing",
        "w2CompanySize": r[11].strip() if len(r) > 11 else "51 to 200 employees",
        "w2Titles": r[12].strip() if len(r) > 12 else "CEO, Founder, CTO",
        "w2Region": r[13].strip() if len(r) > 13 else "Mumbai, Pune",
        "w3Industry": r[14].strip() if len(r) > 14 else "Manufacturing",
        "w3CompanySize": r[15].strip() if len(r) > 15 else "51 to 200 employees",
        "w3Titles": r[16].strip() if len(r) > 16 else "CEO, Founder, CTO",
        "w3Region": r[17].strip() if len(r) > 17 else "Mumbai, Pune",
        "w4Industry": "Technology",
        "w4CompanySize": "51 to 200 employees",
        "w4Titles": "CEO, Founder",
        "w4Region": "India",
        "clientEmail": f"contact@{name.lower().replace(' ', '').replace('&', '')}.com",
        "sendToClientStatus": "Sent"
    })

# Divide items into groups
radheshyam_items = [i for i in items if i['csBack'] == 'Radheshyam']
jayesh_items = [i for i in items if i['csBack'] == 'Jayesh']
other_items = [i for i in items if i['csBack'] not in ('Radheshyam', 'Jayesh')]

ts_content = f"""import {{ BoardGroup }} from '../types';

export const initialGroups: BoardGroup[] = [
  {{
    id: 'group-radheshyam',
    title: 'Radheshyam ({len(radheshyam_items)} Total)',
    color: '#00c875',
    collapsed: false,
    items: {json.dumps(radheshyam_items, indent=4)}
  }},
  {{
    id: 'group-jayesh',
    title: 'Jayesh ({len(jayesh_items)} Total)',
    color: '#a25ddc',
    collapsed: false,
    items: {json.dumps(jayesh_items, indent=4)}
  }},
  {{
    id: 'group-others',
    title: 'Other Assignees ({len(other_items)} Total)',
    color: '#ff9900',
    collapsed: false,
    items: {json.dumps(other_items, indent=4)}
  }}
];
"""

with open('src/mock/initialData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated src/mock/initialData.ts with {len(items)} authentic Project Plan records!")

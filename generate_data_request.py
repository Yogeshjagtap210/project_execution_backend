import glob
import csv
import json

csv_files = glob.glob('Data Requests*.csv')
if not csv_files:
    print("No Data Requests CSV found")
    exit()

filename = csv_files[0]
print(f"Parsing {filename}...")

with open(filename, encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

items = []
for idx, r in enumerate(rows):
    name = r.get('Name', '').strip()
    if not name:
        continue
    
    search_link = r.get('Link to search', '').strip()
    if not search_link:
        search_link = f"https://google.com/search?q={name.replace(' ', '+')}"

    items.append({
        "id": f"dr-{idx}",
        "name": name,
        "commentsCount": 0 if idx > 5 else (idx * 2) % 10,
        "startDate": r.get('Due Date', '').strip() or '12 Feb 2026',
        "totalDays": "12",
        "dateCreated": "",
        "endDate": "",
        "currentStatus": r.get('Status', '').strip() or 'Done',
        "state": r.get('Status', '').strip() or 'Done',
        "companySize": r.get('Company Size', '').strip() or '51 to 500 employees',
        "spreadsheetLink": search_link,
        "dashboardLink": "",
        "contentLink": "",
        "pc": "Akshay",
        "csFront": "Akshay",
        "csBack": "Radheshyam",
        "country": "IND",
        "analyst": "BTB Analyst",
        "industry": r.get('Industry', '').strip() or 'Hospitals & Healthcare',
        "emailEngine": "Outlook",
        "projectType": "Automation",
        "contactDetails": r.get('Titles', '').strip(),
        "emailIds": "",
        "gtmLink": r.get('Regions', '').strip(),
        "fortnight": "Done",
        "emailWarmup": "Done",
        "emailTrigger": "Content",
        "domainHealthLink": "",
        "domainHealth": "Done",
        "whatsApp": "Done",
        "emailIdPass": "Done",
        "calendly": "Done",
        "linkedIn": "",
        "bd": "Khushboo",
        "reasonOfHold": "",
        "backupCx": "Akshay"
    })

done_items = [i for i in items if i['currentStatus'] == 'Done']
pending_items = [i for i in items if i['currentStatus'] != 'Done']

ts_content = f"""import {{ PLMGroup }} from '../types';

export const initialDataRequestGroups: PLMGroup[] = [
  {{
    id: 'dr-scrapped-completed',
    title: 'Data Requests - Data Scrapped (1) • Completed ({len(done_items)} Total)',
    color: '#00c875',
    collapsed: false,
    items: {json.dumps(done_items, indent=4)}
  }},
  {{
    id: 'dr-scrapped-pending',
    title: 'Data Requests - Data Scrapped (1) • Pending ({len(pending_items)} Total)',
    color: '#ff9900',
    collapsed: false,
    items: {json.dumps(pending_items, indent=4)}
  }}
];
"""

with open('src/mock/dataRequestData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated src/mock/dataRequestData.ts with {len(items)} authentic Data Request records!")

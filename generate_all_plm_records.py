import glob
import csv
import json

# 1. Parse PLM Tracker CSV (138 Records)
plm_file = glob.glob('PLM_Tracker*.csv')[0]
with open(plm_file, encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    plm_rows = list(reader)

new_onboardings = []
active_items = []

for idx, r in enumerate(plm_rows):
    name = r.get('Project Name', '').strip()
    if not name:
        continue
    status = r.get('Status', '').strip()
    sheet = r.get('Spreadsheet', '').strip() or f"{name} (Linked)"

    item = {
        "id": f"plm-active-{idx}",
        "name": name,
        "commentsCount": 0 if idx > 5 else (idx * 3) % 12,
        "commentsList": [],
        "startDate": r.get('Start Date', '').strip() or 'Jul 7, 2026',
        "totalDays": r.get('Days Active', '').strip() or '18',
        "dateCreated": "",
        "endDate": r.get('End Date', '').strip(),
        "currentStatus": status or 'Active',
        "state": r.get('Project Health', '').strip() or 'Green - Low Risk',
        "companySize": r.get('Company Size', '').strip() or '51-200',
        "spreadsheetLink": sheet,
        "dashboardLink": r.get('Content Doc', '').strip() or f"{name} Dashboard",
        "contentLink": r.get('Content Doc', '').strip() or f"{name} Content",
        "pc": r.get('CS: Front', '').strip() or 'Monika',
        "csFront": r.get('CS: Front', '').strip() or 'Akshay',
        "csBack": r.get('CS: Front', '').strip() or 'Radheshyam',
        "country": r.get('Country', '').strip() or 'IND',
        "analyst": r.get('Analyst', '').strip() or 'BTB Analyst',
        "industry": r.get('Industry', '').strip() or 'IT Solutions & Services',
        "emailEngine": r.get('Email Engine', '').strip() or 'Outlook',
        "projectType": r.get('Project Type', '').strip() or 'Automation',
        "contactDetails": r.get('Contact', '').strip(),
        "emailIds": r.get('Email IDs', '').strip(),
        "gtmLink": r.get('GTM Link', '').strip(),
        "fortnight": "Done",
        "emailWarmup": "Done",
        "emailTrigger": r.get('Email Trigger', '').strip() or 'Content',
        "domainHealthLink": r.get('Domain Health Link', '').strip(),
        "domainHealth": "Done",
        "whatsApp": "Done",
        "emailIdPass": "Done",
        "calendly": "Done",
        "linkedIn": "",
        "bd": r.get('BD Owner', '').strip() or 'Khushboo',
        "reasonOfHold": "",
        "backupCx": "Akshay"
    }

    if 'New Onboarding' in status:
        new_onboardings.append(item)
    else:
        active_items.append(item)

# 2. Parse Copy of PLM_Tracker - Hold Projects.csv (1,096 Records)
hold_file = glob.glob('*Hold Projects*.csv')[0]
with open(hold_file, encoding='utf-8', errors='ignore') as f:
    reader = csv.DictReader(f)
    hold_rows = list(reader)

hold_items = []
for idx, r in enumerate(hold_rows):
    name = r.get('Project Name', '').strip()
    if not name:
        continue

    reason = r.get('Reason of hold') or r.get('Reason for hold') or r.get('Hold Reason') or "Client Request / Paused"
    sheet = r.get('Spreadsheet', '').strip() or f"{name} (Hold Sheet)"

    item = {
        "id": f"plm-hold-{idx}",
        "name": name,
        "commentsCount": 0,
        "commentsList": [],
        "startDate": r.get('Start Date', '').strip() or '2026-01-15',
        "totalDays": r.get('Days Active', '').strip() or '45',
        "dateCreated": "",
        "endDate": r.get('End Date', '').strip(),
        "currentStatus": 'Hold',
        "state": r.get('Project Health', '').strip() or 'Orange - Moderate',
        "companySize": r.get('Company Size', '').strip() or '11-50',
        "spreadsheetLink": sheet,
        "dashboardLink": "",
        "contentLink": r.get('Content Doc', '').strip() or "",
        "pc": r.get('CS: Front', '').strip() or 'Monika',
        "csFront": r.get('CS: Front', '').strip() or 'Akshay',
        "csBack": r.get('CS: Front', '').strip() or 'Radheshyam',
        "country": r.get('Country', '').strip() or 'IND',
        "analyst": r.get('Analyst', '').strip() or 'BTB Analyst',
        "industry": r.get('Industry', '').strip() or 'IT Solutions & Services',
        "emailEngine": r.get('Email Engine', '').strip() or 'Outlook',
        "projectType": r.get('Project Type', '').strip() or 'Automation',
        "contactDetails": r.get('Contact', '').strip(),
        "emailIds": r.get('Email IDs', '').strip(),
        "gtmLink": r.get('GTM Link', '').strip(),
        "fortnight": "Hold",
        "emailWarmup": "Hold",
        "emailTrigger": r.get('Email Trigger', '').strip() or 'Content',
        "domainHealthLink": r.get('Domain Health Link', '').strip(),
        "domainHealth": "Hold",
        "whatsApp": "Hold",
        "emailIdPass": "Hold",
        "calendly": "Hold",
        "linkedIn": "",
        "bd": r.get('BD Owner', '').strip() or 'Khushboo',
        "reasonOfHold": reason,
        "backupCx": "Akshay"
    }
    hold_items.append(item)

ts_content = f"""import {{ PLMGroup }} from '../types';

export const initialPLMGroups: PLMGroup[] = [
  {{
    id: 'plm-group-new-onboardings',
    title: 'New Onboardings ({len(new_onboardings)} Total)',
    color: '#00c875',
    collapsed: false,
    items: {json.dumps(new_onboardings, indent=4)}
  }},
  {{
    id: 'plm-group-active',
    title: 'Active Projects ({len(active_items)} Total)',
    color: '#00c875',
    collapsed: false,
    items: {json.dumps(active_items, indent=4)}
  }},
  {{
    id: 'plm-group-hold',
    title: 'Hold Projects ({len(hold_items)} Total)',
    color: '#e2445c',
    collapsed: false,
    items: {json.dumps(hold_items, indent=4)}
  }}
];
"""

with open('src/mock/plmData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated src/mock/plmData.ts with {len(new_onboardings)} New, {len(active_items)} Active, and {len(hold_items)} Hold Projects!")

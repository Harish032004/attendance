# check_employees.py
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

creds = ServiceAccountCredentials.from_json_keyfile_name('google_credentials.json', scope)
client = gspread.authorize(creds)
sheet = client.open("Daily Attendance")

employees_ws = sheet.worksheet("Employees")
all_records = employees_ws.get_all_records()

print(f"Found {len(all_records)} employees:")
print("-" * 50)

for record in all_records:
    print(f"ID: {record.get('Employee ID')}")
    print(f"Name: {record.get('Employee Name')}")
    print(f"Active: {record.get('Is Active')}")
    print(f"Hash exists: {'Yes' if record.get('Password Hash') else 'No'}")
    print("-" * 30)
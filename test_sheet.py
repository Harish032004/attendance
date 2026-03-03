import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('google_credentials.json', scope)
client = gspread.authorize(creds)

try:
    sheet = client.open("Daily Attendance")
    print("✅ SUCCESS! Connected to sheet")
    print(f"Sheet URL: https://docs.google.com/spreadsheets/d/{sheet.id}")
    
    # Try to add a test row
    worksheet = sheet.sheet1
    worksheet.append_row(["Test", "999", "2024-01-01", "12:00", "1", "192.168.1.1"])
    print("✅ Successfully wrote test data")
    
except Exception as e:
    print(f"❌ Error: {e}")
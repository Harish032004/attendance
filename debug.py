import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('google_credentials.json', scope)
client = gspread.authorize(creds)

# Your Sheet ID from URL
SHEET_ID = "18NzePEfZKmUGOsloWIamwD6yufKEemK14PxW6G7pJsc"

try:
    # Open by ID (this should work)
    sheet = client.open_by_key(SHEET_ID)
    print("✅ SUCCESS! Connected to sheet by ID")
    print(f"Sheet name: {sheet.title}")
    
    # Add a test row
    worksheet = sheet.sheet1
    worksheet.append_row(["Test User", "999", "2024-01-01", "12:00", "1", "192.168.1.1"])
    print("✅ Test data added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
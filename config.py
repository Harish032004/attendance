# config.py
import os
from datetime import timedelta

# Google Sheets configuration
SHEET_NAME = "Daily Attendance"

# Allowed IP ranges for office WiFi
ALLOWED_IP_RANGES = ['192.168.', '127.', '10.0.', '172.16.', '::1']

# Session configuration
SESSION_TIMEOUT_HOURS = 8
SESSION_TIMEOUT = timedelta(hours=SESSION_TIMEOUT_HOURS)

# Attendance types
ATTENDANCE_TYPES = {
    'WFO': 'Work From Office',
    'WFH': 'Work From Home',
    'Leave': 'Leave'
}

# Default settings
DEFAULT_WORK_HOURS = 8
MIN_WORK_LOG_CHARS = 20

# Password policy
MIN_PASSWORD_LENGTH = 8
REQUIRE_UPPERCASE = True
REQUIRE_LOWERCASE = True
REQUIRE_NUMBER = True
REQUIRE_SPECIAL = True
PASSWORD_EXPIRY_DAYS = 90

# Application settings
APP_NAME = "Smart Attendance System"
COMPANY_NAME = "Your Company Name"
SUPPORT_EMAIL = "support@company.com"

# Feature flags
ENABLE_WFH = True
ENABLE_LEAVE = True
ENABLE_IP_CHECK = True
ENABLE_AUDIT_LOGS = True
ENABLE_NOTIFICATIONS = False
ENABLE_EMAIL_ALERTS = False

# Email configuration (optional)
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@company.com')

# File upload settings
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'xlsx', 'xls'}

# Rate limiting
MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_TIME = 15  # minutes

# Pagination
ITEMS_PER_PAGE = 50

# Cache settings
CACHE_TIMEOUT = 300  # 5 minutes

# Date formats
DATE_FORMAT = '%Y-%m-%d'
DATETIME_FORMAT = '%Y-%m-%d %H:%M:%S'
TIME_FORMAT = '%H:%M:%S'
DISPLAY_DATE_FORMAT = '%d %b %Y'
DISPLAY_DATETIME_FORMAT = '%d %b %Y %I:%M %p'

# Default admin credentials (will be hashed)
DEFAULT_ADMIN_ID = "ADMIN001"
DEFAULT_ADMIN_PASSWORD = "Admin@123"
DEFAULT_ADMIN_NAME = "System Admin"
DEFAULT_ADMIN_EMAIL = "admin@company.com"
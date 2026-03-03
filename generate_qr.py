import qrcode

# Your live application URL
base_url = "https://attendance-bgyd.onrender.com"

# Create QR code
qr = qrcode.QRCode(
    version=3,
    box_size=10,
    border=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H
)
qr.add_data(base_url)
qr.make(fit=True)

# Generate image
img = qr.make_image(fill_color="black", back_color="white")
img.save("attendance_qr.png")

print(f"✅ Single QR Code generated!")
print(f"📌 URL: {base_url}")
print("📁 File: attendance_qr.png")
print("\n📱 When scanned, it will open the live attendance system at:")
print(f"   {base_url}")
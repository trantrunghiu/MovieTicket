import requests

# Figma API token
FIGMA_API_TOKEN = "figd_OzYRTi0L945qFKjck7H2JMF3ma0c6uMPNXLhvJJ1"

# File Key của dự án
FILE_KEY = "eHDxuTUp9Q1YikGqA10iiX"
NODE_ID = "0-1"  # ID của màn hình cần lấy

# URL API
API_URL = f"https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_ID}&format=png"

# Headers
HEADERS = {
    "X-Figma-Token": FIGMA_API_TOKEN
}

# Gửi yêu cầu đến Figma API
response = requests.get(API_URL, headers=HEADERS)
if response.status_code == 200:
    image_url = response.json()["images"][NODE_ID]
    # Tải ảnh từ URL trả về
    image_response = requests.get(image_url)
    if image_response.status_code == 200:
        with open("preview.png", "wb") as file:
            file.write(image_response.content)
        print("Ảnh đã được tải xuống: preview.png")
    else:
        print("Lỗi khi tải ảnh từ URL.")
else:
    print("Lỗi khi gửi yêu cầu đến Figma API:", response.json())

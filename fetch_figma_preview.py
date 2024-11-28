import requests
import os
import urllib.request
# Figma API token
FIGMA_API_TOKEN = os.getenv("FIGMA_API_TOKEN")
# File Key của dự án
FILE_KEY = "eHDxuTUp9Q1YikGqA10iiX"
# URL API để lấy tất cả các node trong file
API_URL = f"https://api.figma.com/v1/files/{FILE_KEY}"
# Headers
HEADERS = {
    "X-Figma-Token": FIGMA_API_TOKEN
}
# Gửi yêu cầu để lấy danh sách tất cả các node trong file
response = requests.get(API_URL, headers=HEADERS)
# Kiểm tra phản hồi từ API
if response.status_code == 200:
    file_data = response.json()
    # Lấy tất cả các node từ file (đây là danh sách các frames trong file Figma)
    nodes = file_data.get("document", {}).get("children", [])
    # Lấy ID của từng node
    node_ids = []
    for node in nodes:
        if "id" in node:
            node_ids.append(node["id"])
    # Lấy ảnh cho tất cả các node
    images_url = f"https://api.figma.com/v1/images/{FILE_KEY}?ids={','.join(node_ids)}&format=png"
    # Gửi yêu cầu để lấy ảnh
    image_response = requests.get(images_url, headers=HEADERS)
    if image_response.status_code == 200:
        images_data = image_response.json()
        if not os.path.exists("figma_images"):
            os.makedirs("figma_images")
        for node_id, image_url in images_data["images"].items():# Kiểm tra xem URL ảnh có hợp lệ không
         image_filename = "preview.png"
    urllib.request.urlretrieve(image_url, image_filename)
    
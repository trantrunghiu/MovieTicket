import requests
import os

# Figma API token
FIGMA_API_TOKEN = "your_figma_api_token"

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

    print("Node IDs found:", node_ids)  # In ra danh sách node IDs

    # Lấy ảnh cho tất cả các node
    images_url = f"https://api.figma.com/v1/images/{FILE_KEY}?ids={','.join(node_ids)}&format=png"

    # Gửi yêu cầu để lấy ảnh
    image_response = requests.get(images_url, headers=HEADERS)

    if image_response.status_code == 200:
        images_data = image_response.json()
        
        # Kiểm tra xem API có trả về ảnh cho các node không
        if "images" not in images_data:
            print("Không có hình ảnh nào được trả về từ API.")
        else:
            # Tạo thư mục để lưu ảnh nếu chưa có
            if not os.path.exists("figma_images"):
                os.makedirs("figma_images")

            # Lưu ảnh từ mỗi node
            for node_id, image_url in images_data["images"].items():
                image_data = requests.get(image_url).content
                with open(f"figma_images/{node_id}.png", "wb") as image_file:
                    image_file.write(image_data)
                print(f"Đã lưu ảnh cho node {node_id}")
    else:
        print("Lỗi khi tải ảnh từ API:", image_response.json())
else:
    print("Lỗi khi gửi yêu cầu để lấy file Figma:", response.json())

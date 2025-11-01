from PIL import Image
import os
import base64

os.makedirs("icons2", exist_ok=True)

for size in [16, 48, 128]:
    path = f"icons2/icon{size}.png"
    if os.path.exists(path):
        os.remove(path)
    img = Image.new("RGB", (size, size), (0, 170, 255))
    img.save(path, format="PNG")
    with Image.open(path) as im:
        pixels = list(im.getdata())
        if all(pixel == (0, 170, 255) for pixel in pixels):
            print(f"{path} OK: all pixels are (0,170,255)")
        else:
            print(f"{path} NG: pixel value mismatch")
    # base64エクスポート
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
        print(f"icon{size}.png base64:\n{b64[:60]}...")

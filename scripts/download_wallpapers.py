import urllib.request
import os
import sys

# High Quality Destiny 2 Key Art URLs (Alphacoders / Textless Press Kits)
urls = [
    "https://images8.alphacoders.com/832/832349.jpg",   # Vanilla Key Art
    "https://images2.alphacoders.com/849/849303.jpg",   # Class lineup
    "https://images.alphacoders.com/133/1330990.jpeg",  # Lightfall
    "https://images3.alphacoders.com/112/1127041.jpg",  # Beyond Light
    "https://images7.alphacoders.com/131/1316045.jpeg", # The Final Shape
    "https://images6.alphacoders.com/909/909641.png"    # Forsaken (Confirmed working)
]

output_dir = "public/backgrounds"
os.makedirs(output_dir, exist_ok=True)

print(f"Downloading {len(urls)} Destiny 2 Wallpapers to {output_dir}...")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://wall.alphacoders.com/'
}

success_count = 0

for i, url in enumerate(urls):
    filename = os.path.join(output_dir, f"bg{i+1}.jpg")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response, open(filename, 'wb') as out_file:
            data = response.read()
            # Basic sanity check to ensure we didn't get a Cloudflare HTML block masking as an image
            if len(data) > 100000: # Ensure valid image size (>100kb)
                out_file.write(data)
                print(f"[SUCCESS] Downloaded {filename} ({len(data) // 1024} KB)")
                success_count += 1
            else:
                print(f"[SKIPPED] {filename} - Received blocked/invalid payload ({len(data)} bytes)")
    except Exception as e:
        print(f"[ERROR] Failed {filename}: {e}")

print(f"\nTask Complete: Successfully locked in {success_count} wallpapers.")
if success_count == 0:
    print("Warning: All strict CDN networks rejected the request. Please consider downloading 4K images manually into public/backgrounds/")

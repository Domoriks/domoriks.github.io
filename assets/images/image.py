from PIL import Image

img = Image.open('no-internet.png').convert("RGBA")

w, h = img.size
target_ratio = 3/2

if w / h > target_ratio:
    new_h = int(w / target_ratio)
    new_w = w
else:
    new_w = int(h * target_ratio)
    new_h = h

new_img = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))

x = (new_w - w) // 2
y = (new_h - h) // 2
new_img.paste(img, (x, y), img)

output_path = 'no_cloud_3_2.png'
new_img.save(output_path)

output_path
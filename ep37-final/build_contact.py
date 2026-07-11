#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.abspath(__file__))
FRAMES_DIR = os.path.join(BASE, "frames")
OUT = os.path.join(BASE, "images", "contact.jpg")

COLS, ROWS = 6, 5
THUMB_W, THUMB_H = 320, 180
PAD = 6
LABEL_H = 22

files = sorted(os.listdir(FRAMES_DIR))
assert len(files) == 30, f"expected 30 frames, got {len(files)}"

cell_w = THUMB_W + PAD * 2
cell_h = THUMB_H + LABEL_H + PAD * 2
sheet_w = cell_w * COLS
sheet_h = cell_h * ROWS

sheet = Image.new("RGB", (sheet_w, sheet_h), (20, 20, 20))
draw = ImageDraw.Draw(sheet)

try:
    font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
except Exception:
    font = ImageFont.load_default()

for idx, fname in enumerate(files):
    t_sec = idx * 18
    mm = t_sec // 60
    ss = t_sec % 60
    label = f"{mm:02d}:{ss:02d}"
    img = Image.open(os.path.join(FRAMES_DIR, fname)).convert("RGB")
    img = img.resize((THUMB_W, THUMB_H))
    col = idx % COLS
    row = idx // COLS
    x = col * cell_w + PAD
    y = row * cell_h + PAD
    sheet.paste(img, (x, y))
    # label background
    draw.rectangle([x, y + THUMB_H, x + THUMB_W, y + THUMB_H + LABEL_H], fill=(0, 0, 0))
    draw.text((x + 6, y + THUMB_H + 3), label, fill=(255, 215, 0), font=font)

sheet.save(OUT, quality=90)
print("saved", OUT, sheet.size)

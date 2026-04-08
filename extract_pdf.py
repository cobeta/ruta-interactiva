import pymupdf
import os

doc = pymupdf.open("boniches.pdf")  # change filename as needed
os.makedirs("extracted/images", exist_ok=True)
os.makedirs("extracted/pages", exist_ok=True)

# Extract all embedded images
img_count = 0
for page_num, page in enumerate(doc):
    for img in page.get_images():
        xref = img[0]
        img_data = doc.extract_image(xref)
        ext = img_data["ext"]
        img_bytes = img_data["image"]
        fname = f"extracted/images/page{page_num+1:02d}_img{img_count:03d}.{ext}"
        with open(fname, "wb") as f:
            f.write(img_bytes)
        print(f"Saved {fname} ({len(img_bytes)//1024}KB)")
        img_count += 1

# Also render each page as high-res PNG (captures everything including vector art)
for page_num, page in enumerate(doc):
    mat = pymupdf.Matrix(3, 3)  # 3x zoom = ~216dpi, good quality
    pix = page.get_pixmap(matrix=mat)
    fname = f"extracted/pages/page{page_num+1:02d}.png"
    pix.save(fname)
    print(f"Rendered {fname}")

print(f"\nDone. {img_count} embedded images + {len(doc)} page renders.")
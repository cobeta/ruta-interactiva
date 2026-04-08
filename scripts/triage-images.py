#!/usr/bin/env python3
"""
Triage extracted PDF images into size buckets.
Run from project root: python3 scripts/triage-images.py
"""
import os
from pathlib import Path

SRC   = Path("extracted/images")
PAGES = Path("extracted/pages")


def human(size):
    return f"{size//1024}KB" if size < 1_000_000 else f"{size/1_000_000:.1f}MB"


if not SRC.exists():
    print(f"ERROR: {SRC} not found. Run from project root.")
    raise SystemExit(1)

files = sorted(SRC.glob("*"), key=lambda f: f.stat().st_size, reverse=True)

print(f"\n{'File':<40} {'Size':>8}  Category")
print("-" * 65)

large, medium, small, bg = [], [], [], []

for f in files:
    s = f.stat().st_size
    if s > 5_000_000:
        cat = "BACKGROUND (skip)"
        bg.append(f)
    elif s > 1_000_000:
        cat = "LARGE — gallery/overview photo"
        large.append(f)
    elif s > 200_000:
        cat = "MEDIUM — species illustration"
        medium.append(f)
    else:
        cat = "small — icon/decoration"
        small.append(f)
    print(f"{f.name:<40} {human(s):>8}  {cat}")

print(f"\nSummary: {len(bg)} backgrounds, {len(large)} large, {len(medium)} medium, {len(small)} small")

if bg:
    print(f"\nBackground files (repeating page texture) — discard all but one:")
    # Sort by name so page01 comes first (keep that one)
    bg_sorted = sorted(bg, key=lambda f: f.name)
    keep = bg_sorted[0]
    discard = bg_sorted[1:]
    print(f"  Keep:    {keep.name}")
    print(f"  Discard: {len(discard)} files")
    print()
    print("To discard background duplicates, run:")
    for f in discard:
        print(f"  rm '{f}'")

print(f"\nMEDIUM images (likely species illustrations):")
for f in medium:
    print(f"  {f.name}  ({human(f.stat().st_size)})")

print(f"\nLARGE images (likely mission overview photos):")
for f in large:
    print(f"  {f.name}  ({human(f.stat().st_size)})")

print("""
Next steps:
  1. Review medium images above — copy species illustrations to:
       routes/boniches/images/species/
  2. Review large images above — copy mission photos to:
       routes/boniches/images/
  3. Update routes/boniches/pois.json with actual image paths
""")

import zipfile
import os
import glob
import shutil

SEARCH_DIR = "manuals/extracted"
TARGET_FILE = "extracted_manual.md"

zips = glob.glob(os.path.join(SEARCH_DIR, "*.zip"))

if not zips:
    print("Export zip not found!")
    exit(1)

export_zip_path = zips[0]

with zipfile.ZipFile(export_zip_path, 'r') as zip_ref:
    # Find the markdown file
    md_files = [f for f in zip_ref.namelist() if f.endswith(".md")]
    if not md_files:
        print("No markdown file found in zip.")
        exit(1)
    
    target_md = md_files[0]
    zip_ref.extract(target_md, SEARCH_DIR)
    
    # Rename for consistency
    old_path = os.path.join(SEARCH_DIR, target_md)
    new_path = os.path.join(SEARCH_DIR, TARGET_FILE)
    shutil.move(old_path, new_path)
    
    print(f"Extracted to {new_path}")

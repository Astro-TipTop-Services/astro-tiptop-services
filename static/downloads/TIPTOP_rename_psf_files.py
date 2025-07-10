"""
Created on Thu Jul 10 14:15:45 2025
Rename output PSF FITS files sequentially for easier access and keep original copies.

@author: astro-tiptop-services
"""

#%% =============================================================================
# Import necessary libraries
import os
import shutil

#%% =============================================================================
# === Configuration ===
#💡 Adapt these paths to your environment
inputDir = "./"    # Directory containing the generated FITS files 
backupDir = "Original_PSFs"  # Directory to store backups of original files
outputDir = "Renamed_PSFs" # Directory where renamed files will be moved (must exist)

TagBase = "MICADO"     # Base name used in the output FITS filenames

# Create output and backup directories if they do not exist
os.makedirs(outputDir, exist_ok=True)
os.makedirs(backupDir, exist_ok=True)

#%% =============================================================================
# === Gather and sort relevant FITS files ===
output_files = sorted(
    [f for f in os.listdir(inputDir) if f.startswith(TagBase) and f.endswith(".fits")]
)

# Check if any matching files are found
if not output_files:
    print("[INFO] No matching FITS files found for renaming.")
else:
    print(f"[INFO] Found {len(output_files)} FITS files to rename.")

#%% =============================================================================
# === Copy and Rename files sequentially as TagBase_PSF1.fits, MICADO_PSF2.fits, etc. ===
for i, fname in enumerate(output_files):
    src = os.path.join(inputDir, fname)
    dst = os.path.join(outputDir, f"{TagBase}_PSF{i+1}.fits")
    backup = os.path.join(backupDir, fname)

    try:
        # Copy the original file to the backup folder
        shutil.copy2(src, backup)

        # Rename (and move) the file to the new destination
        os.rename(src, dst)
        print(f"[INFO] Renamed: {fname} → {TagBase}_PSF{i+1}.fits (Backup saved)")
    except PermissionError:
        print(f"[⚠️  WARNING] File in use and cannot be renamed: {fname}")
    except Exception as e:
        print(f"[❌ ERROR] Failed to rename {fname} → {e}")

#%% =============================================================================
print(f"\n✅ Process complete. {len(output_files)} files renamed and backed up.")

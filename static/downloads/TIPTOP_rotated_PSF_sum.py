"""
Created on Thu Jul 10 15:01:55 2025
Sum rotated PSFs.
Each PSF is rotated by a specified angle before summation.

@author: astro-tiptop-services
"""

#%% =============================================================================
# Import necessary libraries
import os
import numpy as np
from scipy.ndimage import rotate
from astropy.io import fits

#%% =============================================================================
# === Configuration ===
inputDir = "Renamed_PSFs"           # Folder where the PSF FITS files are stored
TagBase = "MICADO"                  # Base tag for the PSF files
outputFile = "PSF_sum.fits"         # Filename for the combined output

# Rotation angles (degrees) applied to each PSF before summation
rotation_angles = [...] # 💡 To be defined
N = len(rotation_angles)  # Should match the number of PSF files available

#%% =============================================================================
# === Load and combine rotated PSFs ===
first_filename = os.path.join(inputDir, f"{TagBase}_PSF1.fits")
if not os.path.exists(first_filename):
    raise FileNotFoundError(f"Base file {first_filename} is missing. Check input directory.")

first_img = fits.getdata(first_filename)
accumulated = np.zeros_like(first_img, dtype=float)  # Accumulator for summing rotated PSFs
valid_count = 0  # Count how many files were found and used

# Loop over all images and angles
for i in range(N):
    filename = os.path.join(inputDir, f'{TagBase}_PSF{i+1}.fits')

    # Check if file exists
    if not os.path.exists(filename):
        print(f"[WARNING] Missing file: {filename}")
        continue

    print(f"[INFO] Loading file: {filename}")
    img = fits.getdata(filename)

    # Rotate the image by the corresponding angle
    rotated = rotate(img, angle=rotation_angles[i], reshape=False)

    # Accumulate the rotated image
    accumulated += rotated
    valid_count += 1

#%% =============================================================================
# === Normalize and save result ===
if valid_count > 0:
    accumulated /= valid_count

    # Save PSF sum to a FITS file, overwrite if exists
    fits.writeto(outputFile, accumulated, overwrite=True)
    print(f"[INFO] Combined PSF saved to: {outputFile}")
else:
    print("[ERROR] No valid PSF files found. No output generated.")

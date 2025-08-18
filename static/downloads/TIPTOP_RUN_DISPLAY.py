"""
Created on Mon Jun 23 10:58:33 2025
Run a TIPTOP simulation and display PSFs

@author: astro-tiptop-services
"""

#%% Import necessary libraries
from tiptop.tiptop import *
from astropy.io import fits
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm
import numpy as np
import os

#%% 💡Set working directory to TIPTOP root (optional)
# The .ini files may contain relative paths (e.g., "tiptop/data/*.fits")
# => To ensure those paths resolve correctly, set the current working
# directory (CWD) to the TIPTOP repository root.
os.chdir("/my_path_to_TIPTOP/") # Makes relative paths in .ini (tiptop/data/*.fits) valid

# --- Alternative (without chdir) ---
# Keep your CWD anywhere and put absolute paths directly in the .ini
# (e.g., '/my_path_to_TIPTOP/tiptop/data/*.fits').

#%% Define input and output paths and filenames
#💡 Adapt these paths to your setup
# path_in  : Path to the folder containing your .ini parameter file
# path_out : Path where output files will be saved
path_in = "tiptop/perfTest/"  # relative to TIPTOP_ROOT (because of chdir)
path_out = "/my_path_to_SimOutputs/" # Use an absolute path if you want outputs to be saved outside the TIPTOP root

file_in = "ERIS_SCAO_NGS"  # Name of the input parameter file (without extension)
file_out = "ERIS_SCAO_NGS" # Name to use for the output files

#%% Run the TIPTOP simulation
overallSimulation(path_in, file_in, 
                  path_out, file_out)

#%% Open the resulting FITS file and extract data 
hdul = fits.open(path_out + file_out + '.fits')
hdul.info()
psf_ao = hdul[1].data[0,...] # AO-corrected PSF
psf_turb = hdul[2].data      # Seeing-limited PSF
psf_dl = hdul[3].data        # Diffraction-limited PSF
# Load PSF profiles (can be in HDU 4 or 5 depending on save options)
header4 = hdul[4].header
profiles = hdul[4].data if header4.get('CONTENT') == 'Final PSFs profiles' else hdul[5].data
     
psf_header = hdul[1].header  # FITS header for metadata

hdul.close()

# Extract useful parameters
wvl = float(psf_header.get("WL_NM"))       # Wavelength in nm
pix_mas = float(psf_header.get("PIX_MAS")) # Pixel scale in milliarcseconds
sr = psf_header.get(f"{"SR"}{0:04d}")      # Strehl ratio
fwhm = psf_header.get(f"{"FWHM"}{0:04d}")  # FWHM in milliarcsecond

# Print key metrics
print("Pixel scale [mas]:", pix_mas)
print("Strehl Ratio:", sr)
print("FWHMs [mas]:", fwhm)

#%% Normalize the PSFs so total flux = 1
psf_ao /= np.sum(psf_ao)
psf_dl /= np.sum(psf_dl)
psf_turb /= np.sum(psf_turb)

#%% Create axis in arcseconds
nx = psf_ao.shape[0]
axis = np.linspace(-nx//2, nx//2, nx) * pix_mas * 1e-3

#%% Plot the PSFs
# Compute dynamic normalization based on the AO PSF
psf_max = psf_ao.max()
vmax = psf_max
vmin = psf_max * 1e-6  # Adjust dynamic range: show down to 1 millionth of max
norm = LogNorm(vmin=vmin, vmax=vmax) # Set log scale for display

plt.figure(1, figsize=(20,5))
plt.suptitle(r'$\lambda_{\mathrm{science}} = %d$ nm' % int(wvl), y=1) 
plt.subplots_adjust(top=0.85)

def plot_psf(psf, title, position):
    """Plot a PSF in a given subplot position."""
    plt.subplot(1, 3, position)
    plt.imshow(psf, norm=norm, cmap='Spectral_r',
               extent=[axis[0], axis[-1], axis[0], axis[-1]])
    plt.title(title, pad=10)
    plt.xlabel('[arcsec]')
    if position == 1:
        plt.ylabel('[arcsec]', labelpad=10)
    else:
        plt.ylabel('')
    plt.colorbar(fraction=0.046)

plot_psf(psf_ao, f'AO (SR={sr*100:.1f}%, FWHM={fwhm:.1f}mas)', 1)
plot_psf(psf_dl, 'Diffraction', 2)
plot_psf(psf_turb, 'Open loop', 3)

#%% Plot the radial profile
radii = profiles[0,0,:]
p_norm = profiles[1,0,:] / np.max(profiles[1,0,:])

plt.figure(figsize=(8, 6))
plt.plot(radii, p_norm, label='AO profile')
plt.xlabel('Radial distance (mas)')
plt.ylabel('PSF profile norm. to max')
plt.xscale("log")
plt.yscale("log")
plt.title(f'Radial profile - AO corrected PSF - @{int(wvl)} nm')
plt.legend()
plt.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray', alpha=0.7)
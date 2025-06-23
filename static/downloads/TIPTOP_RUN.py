"""
Created on Mon Jun 23 10:58:33 2025
Run a TIPTOP simulation and display PSFs

@author: lmazzolo
"""

#%% Import necessary libraries
from tiptop.tiptop import *
from astropy.io import fits
import matplotlib.pyplot as plt
from matplotlib.colors import LogNorm
import numpy as np

#%% Define input and output paths and filenames
#💡 You should customize these paths and filenames according to your setup
path_in = "./"  # Path to the folder containing your .ini parameter file
path_out = "./" # Path where output files will be saved

file_in = "ERIS_SCAO_NGS"  # Name of the input parameter file (without extension)
file_out = "ERIS_SCAO_NGS" # Name to use for the output files

#%% Define a helper function to extract metrics from the FITS header
def get_metric(header, metric_name, index=0):
    """
    Retrieve a value from the FITS header with a formatted key.

    :param header: FITS header
    :param metric_name: name of the metric (e.g., 'SR')
    :param index: index of the metric (default 0)
    :return: value or None if key not found
    """
    key = f"{metric_name}{index:04d}"
    return header.get(key)

#%% Run the TIPTOP simulation
overallSimulation(path_in, file_in, 
                  path_out, file_out)

#%% Open the resulting FITS file and extract data 
with fits.open(path_out + file_out + '.fits') as hdul:
    hdul.info()
    psf_ao = hdul[1].data[0,...] # AO-corrected PSF
    psf_turb = hdul[2].data      # Seeing-limited PSF
    psf_dl = hdul[3].data        # Diffraction-limited PSF
    profiles = hdul[4].data      # PSF profile
    
    header = hdul[1].header      # FITS header for metadata

    # Extract useful parameters
    wvl = float(header.get("WL_NM"))       # Wavelength in nm
    pix_mas = float(header.get("PIX_MAS")) # Pixel scale in milliarcseconds
    sr = get_metric(header, "SR")          # Strehl ratio
    fwhm = get_metric(header, "FWHM")      # FWHM in milliarcsecond

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
profiles = np.squeeze(profiles)
print(f"Profile shape after squeeze: {profiles.shape}") 

radii = np.arange(profiles.shape[1])

plt.figure(figsize=(8, 6))
plt.plot(radii, profiles[1, :], label='AO profile')
max_radius = radii.max()
plt.xlim(0, 0.75 * max_radius)
plt.xlabel('Radial distance (pixels)')
plt.ylabel('Normalized intensity')
plt.yscale("log")
plt.title(f'Radial profile - AO corrected PSF - @{int(wvl)} nm')
plt.legend()
plt.grid(True)
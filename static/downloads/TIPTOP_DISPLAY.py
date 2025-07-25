"""
Created on Wed Jul 09 10:50:35 2025
Display multiple AO PSFs in a grid

@author: astro-tiptop-services
"""

#%% =============================================================================
# Import necessary libraries
from tiptop.tiptop import *
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors

#%% =============================================================================
# Define input and output paths
#💡 Adapt these paths to your environment
path_in = "./"    # Folder containing the .ini parameter file
path_out = "./"   # Folder containing the output FITS file 

inTag = "MORFEO"  # Name of the input parameter file (without extension)
outTag = "MORFEO" # Name of the output FITS file

inputFile = f"{path_in}{inTag}.ini"
outputFile = f"{path_out}{outTag}.fits"

#%% =============================================================================
# Load AO system and compute key parameters
ao = aoSystem(inputFile)
wvl = ao.src.wvl[0]  # Science wavelength
rad2mas = 3600 * 180 * 1000 / np.pi # Convert radians to milliarcseconds
pixel_scale_mas = ao.cam.psInMas
sampRef = wvl * rad2mas / (pixel_scale_mas*2*ao.tel.R) # Sampling reference

#%% =============================================================================
# Load FITS file and extract PSFs and metadata
hdul = fits.open(path_out + outTag + '.fits')

# Extract header and map dictionary
header = hdul[0].header 
map_dictionary = hdr2map(header)

# Extract SR and FWHM values from header
psf = hdul[1].data
psf_header = hdul[1].header 
n_psf = len(psf)

# Extract SR and FWHM values from the header of the PSF HDU
sr_list = [psf_header[f"SR{str(i).zfill(4)}"] for i in range(n_psf)]
fwhm_list = [psf_header[f"FWHM{str(i).zfill(4)}"] for i in range(n_psf)]

# Load PSF profiles (can be in HDU 4 or 5 depending on save options)
header4 = hdul[4].header
profile = hdul[4].data if header4.get('CONTENT') == 'Final PSFs profiles' else hdul[5].data

#%% =============================================================================
# Compare header SR/FWHM values with computed values
print('Compare SR and FWHM from header with computed values:')
for i in range(n_psf):
    zenith = map_dictionary['sources_science']['Zenith'][i]
    azimuth= map_dictionary['sources_science']['Azimuth'][i]
    print(f'Zenith: {zenith}, Azimuth: {azimuth}')
    sr_comp = FourierUtils.getStrehl(psf[i], ao.tel.pupil, sampRef, method='otf')
    fwhm_comp = FourierUtils.getFWHM(psf[i], ao.cam.psInMas, nargout=1)
    print(f'     SR (computed)   : {sr_comp:.5f}')
    print(f'     SR (from header): {sr_list[i]:.5f}')
    print(f'     FWHM (computed) : {fwhm_comp:.5f}')
    print(f'     FWHM (from hdr) : {fwhm_list[i]:.5f}')

#%% =============================================================================
# Display PSFs in a square grid
# => grid is made by same number of rows and columns
max_display = int(np.floor(np.sqrt(n_psf))) ** 2  
n_rows = int(np.sqrt(max_display))
n_cols = n_rows

crop_size = 4
nx = FourierUtils.cropSupport(psf[0], crop_size).shape[0]
axis = np.linspace(-nx//2, nx//2, nx) * pixel_scale_mas * 1e-3

fig, axs = plt.subplots(n_rows, n_cols, figsize=(12, 12), constrained_layout=True, squeeze=False)
for i in range(max_display):
    ax = axs.flat[i]
    zenith = float(map_dictionary['sources_science']['Zenith'][i])
    azimuth = float(map_dictionary['sources_science']['Azimuth'][i])
    img = ax.imshow(FourierUtils.cropSupport(psf[i], crop_size),
                    cmap='Spectral_r',
                    extent=[axis[0], axis[-1], axis[0], axis[-1]],
                    norm=mcolors.LogNorm(vmin=np.max(psf)*1e-4,
                                        vmax=np.max(psf)))
    ax.text(0.05, 0.05,
        f'Distance:{zenith:.0f}", Angle:{azimuth:.0f}°\nSR:{sr_list[i]*100:.1f}%, FWHM:{fwhm_list[i]:.1f} mas',
        color='white', fontsize=9, transform=ax.transAxes,
        bbox=dict(facecolor='black', alpha=0.5, lw=0))
    if i % n_cols == 0:
        ax.set_ylabel('Arcsec', fontsize=10)
    else:
        ax.set_yticks([])
    if i // n_cols == n_rows - 1:
        ax.set_xlabel('Arcsec', fontsize=10)
    else:
        ax.set_xticks([])
    # Set tick parameters
    ax.tick_params(labelsize=10, color='white')
    # Add a small colorbar to the right of each subplot
    cbar = plt.colorbar(img, ax=ax, fraction=0.046, pad=0.01)
    cbar.ax.tick_params(labelsize=6)

#%% =============================================================================
# Plot normalized PSF profiles in log-log scale
plt.figure(figsize=(10, 8))
colors = plt.cm.tab20(np.linspace(0, 1, n_psf))

for i in range(n_psf):
    zenith = float(map_dictionary['sources_science']['Zenith'][i])
    azimuth = float(map_dictionary['sources_science']['Azimuth'][i])
    y_norm = profile[1,i,:] / np.max(profile[1,i,:])
    x = profile[0,i,:]
    plt.plot(x, y_norm, label=f'Zen: {zenith:.1f}", Azi: {azimuth:.1f}°',
            color=colors[i], linewidth=1.5)
plt.xscale('log')
plt.yscale('log')
plt.xlabel('Distance [mas]', fontsize=12)
plt.ylabel('PSF profile norm. to max', fontsize=12)
plt.title('PSF Profiles', fontsize=14)
plt.grid(True, which='both', linestyle='--', linewidth=0.5, color='gray', alpha=0.7)
plt.legend(loc='lower left',  fontsize=10, ncol=2)
plt.tight_layout()
plt.show()
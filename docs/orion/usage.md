---
id: usage
title: Quickstart
sidebar_label: Quickstart
---

import Link from '@docusaurus/Link';

# TipTop Quickstart Tutorial
<p align="justify">
<hr />
✏️ **Note:** We recommend first testing your **TipTop** installation using the provided example files: `TIPTOP-EXAMPLE.py` or `TIPTOP-EXAMPLE.ipynb` (for Jupyter users).
<hr />

To begin, open a terminal or command prompt and activate the virtual environment you previously created (see the [**TipTop Installation Tutorial**](/docs/general/installation.md)):
```bash
conda activate tiptop
```
or, on Windows PowerShell:
```bash
.\tiptop\Scripts\activate
```
</p>

## Running a Simulation with TipTop

To run a simulation with **TipTop**, you will need:
- ➡️ **A launch script** (see: [**How to set up a launch script for TipTop?**](/docs/orion/howtosetuplaunchfile)) which:
    - Loads the simulation parameters from a `.ini` file (e.g., `minimalPar.ini`)
    - Initializes the necessary modules
    - Starts the simulation 

    An example script, `TIPTOP-EXAMPLE.py`, is available in the `examples/` folder of our [GitHub repository](https://github.com/astro-tiptop/TIPTOP). You can use it as a template to create your own simulations:
    <details>
    <summary><strong> `TIPTOP-EXAMPLE.py`</strong></summary>
    <pre><code>
    ```python
    from tiptop.tiptop import *
    plt.ion()

    overallSimulation("./", "minimalPar", './', 'test')
    ```
          </code></pre>
    </details> 

    ✏️ **Note:** 
    - The first and second arguments of the `overallSimulation` function specify the path to the folder containing the `.ini` input file and the name of that `.ini` file, respectively. 
    - The third and fourth arguments determine where the output results are saved and what name the resulting `.fits` file receive.

    A detailed documentation on the overallSimulation function can be found [**here**](/docs/orion/howtosetuplaunchfile).

- ➡️ **a parameter file in `.ini` format**, for example:
    <details>
  <summary><strong> `minimalPar.ini`</strong></summary>
   <pre><code>
    ```python
    [telescope]
    TelescopeDiameter=8.
    Resolution = 128

    [atmosphere]
    Seeing = 0.6

    [sources_science]
    Wavelength = [1.6e-6]
    Zenith = [0.]
    Azimuth = [0.]

    [sources_HO]
    Wavelength = 750e-9

    [sensor_science]
    PixelScale = 40
    FieldOfView = 256

    [sensor_HO]
    PixelScale = 832
    FieldOfView = 6
    NumberPhotons = [200.]
    SigmaRON = 0.

    [DM]
    NumberActuators = [20]
    DmPitchs = [0.25]
    ```
      </code></pre>
    </details> 

   A user-friendly interface is available to help you generate custom `.ini` files by selecting an instrument from the available options (see: [**Available AO Instruments**](/docs/orion/aoinstruments)) and specifying parameter values. Access it by clicking the button below:
    <div
        style={{ display: 'flex', justifyContent: 'center', alignItems:'center' }}
        >
        <Link to="/docs/orion/interactivetools" style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '1.0rem 2.0rem',
            height: '3.5rem',
            verticalAlign: 'middle',
            backgroundColor: '#3578e5',
            color: '#fff',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            textAlign: 'center',
            lineHeight: 'normal',
        }}>
        Open ini. Parameter File Generator
    </Link>
    </div>


    ✏️ **Note:** For a detailed explanation of the `.ini` parameter file structure and syntax, please refer to the [**Parameter Files**](/docs/orion/parameterfiles.md) page. 
    Guidance on configuring **TipTop** for your chosen adaptive optics system is available in [**How to set up TipTop according to the AO mode?**](/docs/orion/howtosetup.md).

## Simulation Output

The output of a TipTop simulation consists of Point Spread Functions (PSFs) computed using the parameters specified in your `.ini`file. 

<!-- Outputs also includes seeing limited PSF, diffraction limited PSF and some useful metrics (SR, EE, FWHM, …) -->

If the `doPlot` parameter of the overallSimulation function is set to `True`, the following PSFs will be displayed after the simulation runs:
- The AO-corrected PSF(s)
- The seeing-limited PSF
- The diffraction limited PSF

These PSFs are also saved in a `.fits` file for further analysis and post-processing.
<details>
  <summary><strong>FITS File Structure & Contents</strong></summary>

The FITS file contains multiple HDUs (Header/Data Units), each storing different types of data related to the PSFs generated during the simulation. The content is organized as follows:
- **HDU 0 - PRIMARY** <br/>
    Contains metadata about the simulation, the instrument, and observational parameters. It does not contain image data but provides essential contextual information.
- **HDU 1 – AO-Corrected PSF**<br/>
    Stores the cube of AO-corrected PSFs as a multi-dimensional image array with dimensions (`FieldOfView`, `FieldOfView`, `Nsrc`, `Nwvl`), where `FieldOfView` corresponds to the camera’s field of view in pixels as defined in the `[sensor_science]` section of your `.ini` file, `Nsrc` is the number of science sources, and `Nwvl` is the number of wavelengths specified in the `Wavelength` parameter of the `[sources_science]` section.
- **HDU 2 – Seeing-Limited PSF** <br/>
    Contains the seeing-limited (open-loop) PSF in a 2D image array of size (`FieldOfView`, `FieldOfView`).
- **HDU 3 - Diffraction-Limited PSF**<br/>
    Contains the diffraction-limited PSF, also stored as a 2D image array of size  (`FieldOfView`, `FieldOfView`). 
    <!-- It represents the theoretical best-case optical response limited only by the telescope’s aperture and diffraction. -->
- **HDU 4 - PSDs (if `savePSDs=True`)**<br/>
    Contains the Power Spectral Density (PSD), stored as a 3D array.
    <!-- (`FieldOfView`, `FieldOfView`, `Nsrc`). -->
- **HDU 4 or 5 - Final PSFs Radial Profiles**<br/>
    Contains the 1D radial profiles of the PSFs, stored as an 3D array.<br/> ✏️Note: The HDU number depends on whether the PSDs are saved.

Here is an example FITS structure produced with the minimalPar.ini configuration:
```python
No.    Name      Ver    Type      Cards   Dimensions   Format
  0  PRIMARY       1 PrimaryHDU      84   ()      
  1                1 ImageHDU        21   (256, 256, 1)   float64 #AO-corrected PSFs
  2                1 ImageHDU        10   (256, 256)      float64 #Open-loop PSF   
  3                1 ImageHDU        10   (256, 256)      float64 #Diffraction limited PSF
  4                1 ImageHDU        11   (256, 256, 1)   float64 #High Order PSD (if saved)  
  5                1 ImageHDU        11   (128, 1, 2)     float64 #PSFs profiles

```

</details>
By default, the FITS file header includes the Strehl Ratio (SR) and Full Width at Half Maximum (FWHM) values for each PSF (addSrAndFwhm is set to `True` by default). To retrieve and display the SR, FWHM and Encircled energy metrics, you need to set the `returnMetrics` option to `True` (see [**the documentation on the overallSimulation function**](/docs/orion/howtosetuplaunchfile)).<br/>
⚠️ **Note:** if `returnMetrics` is set to `True`, the FITS file is not saved.
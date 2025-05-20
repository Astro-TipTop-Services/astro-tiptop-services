---
id: usage
title: Quickstart
sidebar_label: Quickstart
---

# TipTop Quickstart Tutorial
<p align="justify">
**Note:** We recommend that you first test your **TipTop** installation using the provided example: `TIPTOP-EXAMPLE.py` or `TIPTOP-EXAMPLE.ipynb` (if you're using Jupyter).

First, open a terminal or command prompt and activate the virtual environment you previously created: (see the [TipTop Installation Tutorial](/docs/general/installation.md)):
```bash
conda activate tiptop
```
or
```bash
# Windows PowerShell
.\tiptop\Scripts\activate
```
</p>

## Running a Simulation with TipTop

To run a simulation with **TipTop**, you need:
- a launch script (e.g., `TIPTOP-EXAMPLE.py`). This script:
    - Loads the simulation parameters from a `.ini` file (e.g., `minimalPar.ini`)
    - Initializes the necessary modules
    - Starts the simulation 

    An example script is available in the `examples/` folder of our [GitHub repository](https://github.com/astro-tiptop/TIPTOP). It can be used as a template to create your own simulation cases. \
    Example usage, `TIPTOP-EXAMPLE.py`:
    ```python
    from tiptop.tiptop import *
    plt.ion()

    overallSimulation("./", "minimalPar", './', 'test')
    ```
    **Note:** 
    - The first and second arguments of the `overallSimulation` function correspond respectively to the path of the folder containing the `.ini` input file, and the name of that `.ini` file.
    - The third and fourth arguments specify where to save the output results (in .fits format) and what name to give to the resulting `.fits` file. 

    A detailed documentation on the overallSimulation function is provided [here](/docs/orion/api_reference.md).

- a parameter file in `.ini` format (e.g., `minimalPar.ini`) \
    Example, `minimalPar.ini`:
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
    **Note:**  For a detailed explanation of the structure and syntax of `.ini` parameter files, refer to the [Parameter Files page](/docs/orion/parameterfields.md). <br /> Guidance on how to configure **TipTop** based on your chosen adaptive optics system is provided [here](/docs/orion/howtosetup.md).

## Simulation Output (This section is under construction...)

The output of a TipTop simulation consists of PSFs (Point Spread Functions) computed at the required wavelength, sampling, FoV position. 
<!-- Outputs also includes seeing limited PSF, diffraction limited PSF and some useful metrics (SR, EE, FWHM, …) -->

After launching the simulation, the following PSFs are displayed:
- The AO-corrected PSF(s)
- The seeing-limited PSF
- The diffraction limited PSF

These PSFs are also saved in a .fits file for further analysis. \
The structure of the output .fits file is as follows:

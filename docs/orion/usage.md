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

   A user-friendly interface is available to help you generate custom `.ini` files by selecting an instrument from the available options (see: [**Available AO Instruments**](/docs/orion/AO_instruments)) and specifying parameter values. Access it by clicking the button below:
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

## Simulation Output (This section is under construction...)

The output of a TipTop simulation consists of Point Spread Functions (PSFs) computed using the parameters specified in your `.ini`file. 

<!-- Outputs also includes seeing limited PSF, diffraction limited PSF and some useful metrics (SR, EE, FWHM, …) -->

If the `doPlot` parameter of the overallSimulation function is set to `True`, the following PSFs will be displayed after the simulation runs:
- The AO-corrected PSF(s)
- The seeing-limited PSF
- The diffraction limited PSF

These PSFs are also saved in a `.fits` file for further analysis and post-processing.
<!-- The structure of the output .fits file is as follows: -->

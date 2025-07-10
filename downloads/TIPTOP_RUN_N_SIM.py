"""
Created on Wed Jul 10 10:00:34 2025
Run N TIPTOP simulations by sweeping over different parameter values.

@author: astro-tiptop-services
"""

#%% =============================================================================
# Import necessary libraries
from tiptop.tiptop import overallSimulation
import numpy as np
import configparser
from itertools import product
import os

#%% =============================================================================
# === File Paths ===
#💡 Adapt these paths to your environment
inputDir = "../MICADO/"   # Folder containing the .ini parameter file
inTag = "MICADO_SCAO"     # Name of the input parameter file (without extension)
outputDir = "./"          # Folder where the output FITS files will be saved 
tempDir = inputDir        # Temporary folder for modified .ini files
tempName = 'file_temp'    # Name of the temporary file

# Construct the full path to the input and temporary config files
inputFile = os.path.join(inputDir, f"{inTag}.ini")
tempFile = os.path.join(tempDir, f"{tempName}.ini")

# Base name for output files
outTagBase = "MICADO"

#%% =============================================================================
# === Define parameters to sweep ===
# Format: (section_name, key_name, list_of_values : min, max, number of values)

param_sweep = [
    ("atmosphere", "Seeing", np.linspace(0.8, 2.0, 3)),
    ("telescope", "ZenithAngle", np.linspace(0.0, 60.0, 3)),
    # Add more parameters as needed
]

#%% =============================================================================
# === Read base configuration file ===
parser = configparser.ConfigParser()
parser.optionxform = str # Keep the original case of parameter keys
parser.read(inputFile)

#%% =============================================================================
# === Build and run combinations ===

# Extract parameter names and values
param_names = [f"{sec}.{key}" for sec, key, _ in param_sweep]
param_values = [vals for _, _, vals in param_sweep]

# Generate all combinations
for combo in product(*param_values):
    # Update .ini with current parameter values
    for (section, key, _), value in zip(param_sweep, combo):
        parser.set(section, key, str(value))
              
        # Write updated config to temporary .ini file
        with open(tempFile, "w") as configfile:
            parser.write(configfile)
        
        # Build output file tag
        tag_parts = [f"{name.split('.')[-1]}{val:.2f}" for name, val in zip(param_names, combo)]
        tag = f"{outTagBase}_{'_'.join(tag_parts)}"
        
        print(f"🔄 Running simulation with: {dict(zip(param_names, combo))}")
        
        # Run TipTop simulation
        overallSimulation(
            path2param=tempDir,
            parametersFile=tempName,
            outputDir=outputDir,
            outputFile=tag,
            addSrAndFwhm=True
        )
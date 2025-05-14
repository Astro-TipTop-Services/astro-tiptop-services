---
id: api_reference
title: API Reference
sidebar_label: API Reference
---

tiptop.**overallSimulation**: function to run the entire tiptop simulation based on the input file.

```python
tiptop.overallSimulation(path2param, parametersFile, outputDir, outputFile, doConvolve=True, doPlot=False, returnRes=False, returnMetrics=False, addSrAndFwhm=True, verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, savePSDs=False, saveJson=False, gpuIndex=0)
```


**Parameters:**

    - **path2param** (_str_) – required, path to the parameter file.

    - **paramFileName** (_str_) – required, name of the parameter file to be used without the extention.

    - **outpuDir** – required, path to the folder in which to write the output.

    - **doConvolve** (_bool_) – optional default: False, if you want to use the natural convolution operation set to True.

    - **doPlot** (_bool_) – optional default: False, if you want to see the result in python set this to True.

    - **verbose** (_bool_) – optional default: False, If you want all messages set this to True

    - **returnRes** (_bool_) – optional default: False, The function will return the result in the environment if set to True, else it saves the result only in a .fits file.

    - **returnMetrics** (_bool_) – optional default: False, The function will return Strehl Ratio, fwhm and encircled energy within eeRadiusInMas if set to True

    - **addSrAndFwhm** (_bool_) – optional default: False, The function will add in the header of the fits file SR anf FWHM for each PSF.

    - **verbose** – optional default: False, If you want all messages set this to True.

    - **getHoErrorBreakDown** (_bool_) – optional default: False, If you want HO error breakdown set this to True.

    - **ensquaredEnergy** (_bool_) – optional default: False, If you want ensquared energy instead of encircled energy set this to True.

    - **eeRadiusInMas** (_float_) – optional default: 50, used together with returnMetrics, radius used for the computation of the encirlced energy (if ensquaredEnergy is selected, this is half the side of the square)

    - **savePSDs** (_bool_) – optional default: False, If you want to save PSD in the output fits file set this to True.

    - **saveJson** (_bool_) – optional default: False, If you want to save the PSF profile in a json file

    - **gpuIndex** (_int_) – optional default: 0, Target GPU index where the simulation will be run

**Returns:**       TBD \
**Return type:**   TBD


tiptop.tiptopUtils.**plot_directions**: Polar plot with science and GS (sources_HO and sources_LO) directions
```python
tiptop.tiptopUtils.plot_directions(parser, ticks_interval=5, labels=None, LO_labels=None, science=True, max_pos=None, add_legend=True)
```


**Parameters:**

    - **parser** (_configparser object_) – required, parameters object

    - **ticks_interval** (_int_) – optional default=5, size of interval for ticks in the figure

    - **labels** (_list_) – optional default=None, list of strings to be plotted next to the science sources

    - **LO_labels** (_list_) – optional default=None, list of strings to be plotted next to the LO sources

    - **science** (_bool_) – optional default=True, activate plot of science sources

    - **max_pos** (_float_) – optional default=None, maximum distance from axis

    - **add_legend** (_bool_) – optional default=True, activate legend

**Returns:** fig, ax \
**Return type:** objects

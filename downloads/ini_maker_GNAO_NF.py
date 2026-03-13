# -*- coding: utf-8 -*-
"""
Generate a TIPTOP-style .ini configuration file for GNAO narrow-field mode.

How to use
----------
1. Edit the values in the "RUN CONFIGURATION (edit here)" section
   at the end of the file.
2. Run the script.
3. The corresponding .ini file will be written.

Main user options
-----------------
profile : int
    Atmospheric profile index:
        0 = poorer seeing
        1 = median seeing
        2 = better seeing

mcao : bool
    Enables the internal multi-DM / multi-conjugate simulation branch.

ait : bool
    If True, use the simplified AIT atmospheric profile.
    If False, use the nominal atmospheric profile.

ngs_mode : int
    Natural guide star mode:
        1 = bright on-axis NGS
        2 = sky-coverage mode

opt_mode : int
    DM optimization mode:
        1 = field optimization
        2 = on-axis optimization

only_on_axis : bool
    If True, only the on-axis science target is used.
    If False, the full science field grid is used.

nyquist_sci_mode : int
    Science pixel scale mode:
        0 = fixed 25 mas
        1 = Nyquist-based sampling

output_file : str
    Name of the generated .ini file.

cn2_perturb_percent : float | None
    Optional Gaussian perturbation amplitude applied to the Cn2 weights,
    expressed in percent.

cn2_seed : int | None
    Optional random seed for reproducible Cn2 perturbations.

Typical example
---------------
Default GNAO narrow-field / LTAO-like case:
    profile=1
    mcao=False
    ait=False
    ngs_mode=1
    opt_mode=2
    only_on_axis=True

Output
------
The script writes a TIPTOP-style configuration file with the sections:
    [telescope]
    [atmosphere]
    [sources_science]
    [sources_HO]
    [sources_LO]
    [sensor_science]
    [sensor_HO]
    [sensor_LO]
    [DM]
    [RTC]

@authors: pjouve & astro-tiptop-services
"""

from __future__ import annotations

import configparser
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np


# ----------------------------------------------------------------------
# Utilities
# ----------------------------------------------------------------------

def cart2pol(x: np.ndarray | float, y: np.ndarray | float):
    """Convert Cartesian coordinates to polar coordinates."""
    rho = np.sqrt(x**2 + y**2)
    phi = np.arctan2(y, x)
    return rho, phi


def perturb_cn2_gaussian(weights, percent_sigma, seed=None):
    """
    Apply multiplicative Gaussian perturbation to Cn2 weights.

    Parameters
    ----------
    weights : list[float]
        Initial Cn2 weights.
    percent_sigma : float
        Standard deviation in percent, e.g. 10 means 10%.
    seed : int | None
        Optional random seed.

    Returns
    -------
    list[float]
        Perturbed and renormalized weights.
    """
    rng = np.random.default_rng(seed)
    weights = np.array(weights, dtype=float)
    sigma = percent_sigma / 100.0
    noise = rng.normal(0.0, sigma, size=len(weights))
    w_new = weights * (1.0 + noise)
    w_new[w_new < 0] = 1e-12
    w_new /= np.sum(w_new)
    return w_new.tolist()


def make_square_field(radius_arcsec: float, n_points: int):
    """
    Build a square grid in Cartesian coordinates and return polar lists.

    Returns
    -------
    zenith : list[float]
    azimuth : list[float]
    """
    mesh = np.mgrid[
        -radius_arcsec:radius_arcsec:complex(0, n_points),
        -radius_arcsec:radius_arcsec:complex(0, n_points),
    ]
    x_mesh = mesh[0, :, :]
    y_mesh = mesh[1, :, :]
    r, t = cart2pol(x_mesh, y_mesh)
    az_deg = t * 180.0 / np.pi
    return r.flatten().tolist(), az_deg.flatten().tolist()


def stringify_listlike(value: Any) -> str:
    """Convert a Python object to the string format expected in the ini file."""
    return str(value)


# ----------------------------------------------------------------------
# Configuration model
# ----------------------------------------------------------------------

@dataclass
class SimulationOptions:
    profile: int = 1               # atmospheric case: 0, 1, 2
    mcao: bool = False
    ait: bool = False
    ngs_mode: int = 1              # 1: on-axis bright, 2: faint off-axis NGS
    opt_mode: int = 2              # 1: field optimization, 2: on-axis optimization
    only_on_axis: bool = True
    nyquist_sci_mode: int = 1      # 0: fixed 25 mas, 1: Nyquist-based
    output_file: str = "GNAO.ini"
    cn2_perturb_percent: float | None = None
    cn2_seed: int | None = None


# ----------------------------------------------------------------------
# Builders
# ----------------------------------------------------------------------

def build_atmosphere(opts: SimulationOptions):
    """Build atmosphere-related parameters."""
    wavelength_at = 500e-9
    r0_list = [0.135, 0.186, 0.247]

    if opts.profile not in (0, 1, 2):
        raise ValueError("profile must be 0, 1, or 2")

    r0 = r0_list[opts.profile]
    seeing = 500e-9 / r0 * 206265
    l0 = 30.0

    if not opts.ait:
        cn2_profiles = {
            0: [0.3952, 0.1665, 0.0703, 0.0773, 0.0995, 0.1069, 0.0843],
            1: [0.4550, 0.1295, 0.0442, 0.0506, 0.1167, 0.0926, 0.1107],
            2: [0.5152, 0.0951, 0.0322, 0.0262, 0.1160, 0.0737, 0.1416],
        }
        cn2_weights = cn2_profiles[opts.profile]
        cn2_heights = [0, 500, 1000, 2000, 4000, 8000, 16000]
        wind_speed = [5.6, 5.77, 6.25, 7.57, 13.31, 19.06, 12.14]
        wind_direction = [190, 255, 270, 350, 17, 29, 66]
    else:
        if opts.profile == 0:
            cn2_weights = [0.3952, 0.1665, 0.0703, 0.0773, 0.0995, 0.1069, 0.0843]
        elif opts.profile == 1:
            cn2_weights = [0.5794, 0.2948, 0.1258]
        else:
            cn2_weights = [0.6166, 0.2632, 0.1202]

        cn2_heights = [0, 4000, 12000]
        wind_speed = [7 * 0.7, 13 * 0.7, 30 * 0.7]
        wind_direction = [45, 255, 270]

    cn2_weights_mod = cn2_weights.copy()
    if opts.cn2_perturb_percent is not None:
        cn2_weights_mod = perturb_cn2_gaussian(
            cn2_weights_mod,
            percent_sigma=opts.cn2_perturb_percent,
            seed=opts.cn2_seed,
        )

    return {
        "Wavelength": wavelength_at,
        "Seeing": seeing,
        "L0": l0,
        "Cn2Weights": cn2_weights,
        "Cn2Heights": cn2_heights,
        "WindSpeed": wind_speed,
        "WindDirection": wind_direction,
        "Cn2Weights_mod1": cn2_weights_mod,
    }


def build_telescope(opts: SimulationOptions):
    """Build telescope section."""
    jitter_fwhm = 0.0 if opts.ngs_mode == 1 else 17 * 2.17

    return {
        "TelescopeDiameter": 7.9,
        "ZenithAngle": 30,
        "ObscurationRatio": 0.1646,
        "Resolution": 128,
        "PathPupil": '"ELT_pup.fits"',
        "PathStaticOn": "'CombinedError_Wavefront_nm.fits'",
        "PathApodizer": "''",
        "PathStatModes": "''",
        "PupilAngle": 0.0,
        "TechnicalFoV": 120,
        "jitter_FWHM": jitter_fwhm,
        "extraErrorNm": 0,
        "extraErrorExp": -2,
        "extraErrorMin": 0,
    }


def build_sources_science(opts: SimulationOptions):
    """Build science source positions."""
    wavelength_sci = [2179e-9]
    zenith_sci, azimuth_sci = make_square_field(radius_arcsec=10, n_points=9)

    if opts.only_on_axis:
        zenith_sci = [0]
        azimuth_sci = [0]

    return {
        "Wavelength": wavelength_sci,
        "Zenith": zenith_sci,
        "Azimuth": azimuth_sci,
    }


def build_sources_ho(opts: SimulationOptions):
    """Build high-order guide star constellation."""
    lgs_sz = 30 if opts.mcao else 10
    return {
        "Wavelength": 589e-9,
        "Zenith": [lgs_sz, lgs_sz, lgs_sz, lgs_sz],
        "Azimuth": [45, 135, 225, 315],
        "Height": 90e3,
    }


def build_sources_lo(opts: SimulationOptions):
    """Build low-order guide star."""
    x_lo_list = [0]
    y_lo_list = [0] if opts.ngs_mode == 1 else [50]

    r = np.sqrt(np.array(x_lo_list) ** 2 + np.array(y_lo_list) ** 2)
    t = np.arctan2(np.array(y_lo_list), np.array(x_lo_list)) * 180 / np.pi

    return {
        "Wavelength": 700e-9,
        "Zenith": [float(v) for v in r],
        "Azimuth": [float(v) for v in t],
    }


def build_sensor_science(opts: SimulationOptions, telescope: dict, sources_science: dict):
    """Build science detector section."""
    wavelength_sci = sources_science["Wavelength"][0]
    telescope_diameter = telescope["TelescopeDiameter"]
    nyquist_sci = 2
    pix = wavelength_sci / telescope_diameter * 206265000 / 2 / nyquist_sci
    pixel_scale_sci = pix if opts.nyquist_sci_mode == 1 else 25

    return {
        "PixelScale": pixel_scale_sci,
        "FieldOfView": 240,
        "Binning": 1,
        "NumberPhotons": [1500],
        "SpotFWHM": [[0.0, 0.0, 0.0]],
        "SpectralBandwidth": 0.0,
        "Transmittance": [1.0],
        "Dispersion": [[0.0], [0.0]],
        "SigmaRON": [1.0],
        "Dark": 0.0,
        "SkyBackground": 1.0,
        "Gain": 1.0,
        "ExcessNoiseFactor": 1.0,
    }


def build_sensor_ho(opts: SimulationOptions):
    """Build HO WFS section."""
    add_mcao_wfs_sens_cone_error = bool(opts.mcao)

    nphoton = 384
    n_lenslet = 25

    return {
        "WfsType": "'Shack-Hartmann'",
        "Modulation": None,
        "PixelScale": 830,
        "FieldOfView": 240,
        "Binning": 1,
        "NumberPhotons": [nphoton, nphoton, nphoton, nphoton],
        "SpectralBandwidth": 0.0,
        "Transmittance": [1.0],
        "Dispersion": [[0.0], [0.0]],
        "SigmaRON": 0.5,
        "Dark": 0.0,
        "SkyBackground": 0.0,
        "Gain": 1.0,
        "ExcessNoiseFactor": 1.31,
        "NumberLenslets": [n_lenslet, n_lenslet, n_lenslet, n_lenslet],
        "NoiseVariance": [None],
        "Algorithm": "'wcog'",
        "WindowRadiusWCoG": 6,
        "ThresholdWCoG": 0.0,
        "NewValueThrPix": 0.0,
        "addMcaoWFsensConeError": add_mcao_wfs_sens_cone_error,
    }


def build_sensor_lo(opts: SimulationOptions):
    """Build LO WFS section."""
    if opts.ngs_mode == 1:
        mag_list = [5]
        freq_tt = 1000
    else:
        mag_list = [19.76]
        freq_tt = 100

    f0 = 4.34e10
    throughput = 0.42
    nph0 = 10 ** (-np.array(mag_list) / 2.5) * 47 * f0 * throughput / freq_tt

    return {
        "PixelScale": 250.0,
        "FieldOfView": 4,
        "Binning": 1,
        "NumberPhotons": [float(v) for v in nph0],
        "SpotFWHM": [[0.0, 0.0, 0.0]],
        "SigmaRON": 0.5,
        "Dark": 0.0,
        "SkyBackground": 0.0,
        "Gain": 1.0,
        "ExcessNoiseFactor": 1.3,
        "NumberLenslets": [1],
        "Algorithm": "'wcog'",
        "WindowRadiusWCoG": 4,
        "ThresholdWCoG": 0.0,
        "NewValueThrPix": 0.0,
        "noNoise": False,
        "filtZernikeCov": bool(opts.mcao),
    }


def build_dm(opts: SimulationOptions):
    """Build deformable mirror section."""
    if not opts.mcao:
        number_actuators_dm = [26]
        dm_pitchs_dm = [0.24]
        inf_coupling_dm = [0.3]
        dm_heights_dm = [0.0]
    else:
        number_actuators_dm = [32, 20]
        dm_pitch_alt = (0.5 * 10 + 7.9) / (20 - 1)
        dm_pitchs_dm = [0.24, dm_pitch_alt]
        inf_coupling_dm = [0.3, 0.3]
        dm_heights_dm = [0.0, 10000]

    number_of_point_opt = 3
    zenith_sci_opt, azimuth_sci_opt = make_square_field(radius_arcsec=10, n_points=number_of_point_opt)
    sz = len(zenith_sci_opt)

    if opts.opt_mode == 1:
        optimization_zenith_dm = zenith_sci_opt
        optimization_azimuth_dm = azimuth_sci_opt
        optimization_weight_dm = list(np.ones(sz) / sz)
    else:
        optimization_zenith_dm = [0]
        optimization_azimuth_dm = [0]
        optimization_weight_dm = [1]

    return {
        "NumberActuators": number_actuators_dm,
        "DmPitchs": dm_pitchs_dm,
        "InfModel": "'gaussian'",
        "InfCoupling": inf_coupling_dm,
        "DmHeights": dm_heights_dm,
        "OptimizationZenith": optimization_zenith_dm,
        "OptimizationAzimuth": optimization_azimuth_dm,
        "OptimizationWeight": optimization_weight_dm,
        "OptimizationConditioning": 1.0e2,
        "NumberReconstructedLayers": 7,
        "AoArea": "'circle'",
    }


def build_rtc(opts: SimulationOptions):
    """Build RTC section."""
    sensor_frame_rate_lo = 1000 if opts.ngs_mode == 1 else 100

    return {
        "LoopGain_LO": "'optimize'",
        "LoopGain_HO": 0.5,
        "SensorFrameRate_HO": 500.0,
        "LoopDelaySteps_HO": 2,
        "SensorFrameRate_LO": sensor_frame_rate_lo,
        "LoopDelaySteps_LO": 2,
    }


# ----------------------------------------------------------------------
# INI writer
# ----------------------------------------------------------------------

def dict_to_ini_sections(config: configparser.ConfigParser, section_name: str, values: dict):
    """Write a dict into a configparser section."""
    config[section_name] = {}
    for key, value in values.items():
        config[section_name][key] = stringify_listlike(value)


def generate_config(opts: SimulationOptions) -> configparser.ConfigParser:
    """Generate the full configparser object."""
    config = configparser.ConfigParser()
    config.optionxform = str  # keep case

    telescope = build_telescope(opts)
    atmosphere = build_atmosphere(opts)
    sources_science = build_sources_science(opts)
    sources_ho = build_sources_ho(opts)
    sources_lo = build_sources_lo(opts)
    sensor_science = build_sensor_science(opts, telescope, sources_science)
    sensor_ho = build_sensor_ho(opts)
    sensor_lo = build_sensor_lo(opts)
    dm = build_dm(opts)
    rtc = build_rtc(opts)

    dict_to_ini_sections(config, "telescope", telescope)
    dict_to_ini_sections(config, "atmosphere", atmosphere)
    dict_to_ini_sections(config, "sources_science", sources_science)
    dict_to_ini_sections(config, "sources_HO", sources_ho)
    dict_to_ini_sections(config, "sources_LO", sources_lo)
    dict_to_ini_sections(config, "sensor_science", sensor_science)
    dict_to_ini_sections(config, "sensor_HO", sensor_ho)
    dict_to_ini_sections(config, "sensor_LO", sensor_lo)
    dict_to_ini_sections(config, "DM", dm)
    dict_to_ini_sections(config, "RTC", rtc)

    return config


def write_ini(config: configparser.ConfigParser, output_file: str):
    """Write config to disk."""
    output_path = Path(output_file)
    with output_path.open("w", encoding="utf-8") as f:
        config.write(f)
    return output_path


# ----------------------------------------------------------------------
# RUN CONFIGURATION (edit here)
# ----------------------------------------------------------------------

if __name__ == "__main__":

    opts = SimulationOptions(
        profile=1,            # 0, 1, 2
        mcao=False,           # True / False
        ait=False,            # True / False
        ngs_mode=1,           # 1 or 2
        opt_mode=2,           # 1 or 2
        only_on_axis=True,    # True / False
        nyquist_sci_mode=1,   # 0 or 1
        output_file="example.ini",
        cn2_perturb_percent=None,
        cn2_seed=None
    )

    config = generate_config(opts)
    output_path = write_ini(config, opts.output_file)

    print("Configuration generated successfully.")
    print(f"File written to: {output_path}")
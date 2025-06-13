import React, { useState, useEffect } from 'react';

const configPresets = {
  'ERIS_SCAO_NGS':{
    telescope: {
      TelescopeDiameter: 8,
      ZenithAngle: 30.0,
      ObscurationRatio: 0.16,
      Resolution: 128,
      TechnicalFoV: 120,
    },
    atmosphere: {
      Wavelength: 500e-9,
      Seeing: 0.8,
      L0: 22.0,
      Cn2Weights: '[0.59, 0.02, 0.04, 0.06, 0.01, 0.05, 0.09, 0.04, 0.05, 0.05]',
      Cn2Heights: '[30, 140, 281, 562, 1125, 2250, 4500, 7750, 11000, 14000]',
      WindSpeed: '[6.6, 5.9, 5.1, 4.5, 5.1, 8.3, 16.3, 10.2, 14.3, 17.5]',
      WindDirection: '[0., 0., 0., 0., 90., -90., -90., 90., 0., 0.]',
      r0_Value: 0,
      testWindspeed: 0,
    },
    sources_sciences: {
      Wavelength: '[1.650e-06]',
      Zenith: '[0.0]',
      Azimuth: '[0.0]',
    },
    sources_HO: {
      Wavelength: '[750e-9]',
      Zenith: '[0.0]',
      Azimuth: '[0.0]',
      Height: 0,
    },
    sensor_science: {
      PixelScale: 14,
      FieldOfView: 256,
    },
    sensor_HO:{
      WfsType: 'Shack-Hartmann',
      Modulation: 'None',
      PixelScale: 832,
      FieldOfView: 6,
      Binning: 1,
      NumberPhotons: '[100.0]',
      SigmaRON: 0.2,
      ExcessNoiseFactor: 2.0,
      Algorithm: 'wcog',
      NumberLenslets: '[40]',
      NoiseVariance: '[None]',
    },
    DM:{
      NumberActuators: '[40]',
      DmPitchs: '[0.2]',
      DmHeights: '[0.0]',
      AoArea: 'circle',
    },
    RTC:{
      LoopGain_HO: 0.3,
      SensorFrameRate_HO: 1000.0,
      LoopDelaySteps_HO: 3,
    },
  },
  'ERIS_SCAO_LGS':{
    telescope: {
      TelescopeDiameter: 8,
      ZenithAngle: 30.0,
      ObscurationRatio: 0.16,
      Resolution: 128,
      TechnicalFoV: 120,
    },
    atmosphere: {
      Wavelength: 500e-9,
      Seeing: 0.8,
      L0: 22.0,
      Cn2Weights: '[0.59, 0.02, 0.04, 0.06, 0.01, 0.05, 0.09, 0.04, 0.05, 0.05]',
      Cn2Heights: '[30, 140, 281, 562, 1125, 2250, 4500, 7750, 11000, 14000]',
      WindSpeed: '[6.6, 5.9, 5.1, 4.5, 5.1, 8.3, 16.3, 10.2, 14.3, 17.5]',
      WindDirection: '[0., 0., 0., 0., 90., -90., -90., 90., 0., 0.]',
      r0_Value: 0,
      testWindspeed: 0,
    },
    sources_sciences: {
      Wavelength: '[1.650e-06]',
      Zenith: '[0.0]',
      Azimuth: '[0.0]',
    },
    sources_HO: {
      Wavelength: '[589e-9]',
      Zenith: '[0.0]',
      Azimuth: '[0.0]',
      Height: 90000,
    },
    sources_LO: {
      Wavelength: '[750e-09]',
      Zenith: '[0.0]',
      Azimuth: '[0.0]',
    },
    sensor_science: {
      PixelScale: 14,
      FieldOfView: 256,
    },
    sensor_HO:{
      WfsType: 'Shack-Hartmann',
      Modulation: 'None',
      PixelScale: 832,
      FieldOfView: 6,
      Binning: 1,
      NumberPhotons: '[100.0]',
      SigmaRON: 0.2,
      ExcessNoiseFactor: 2.0,
      Algorithm: 'cog',
      NumberLenslets: '[40]',
      NoiseVariance: '[None]',
    },
    sensor_LO:{
      WfsType: 'Shack-Hartmann',
      Modulation: 'None',
      PixelScale: 417,
      FieldOfView: 48,
      Binning: 1,
      NumberPhotons: '[100.0]',
      SigmaRON: 0.2,
      Dark: 0.0,
      SkyBackground: 0.0,
      ExcessNoiseFactor: 2.0,
      NumberLenslets: '[4]',
      NoiseVariance: '[None]',
      WindowRadiusWCoG: 6,
      ThresholdWCoG: 0.0,
      NewValueThrPix: 0.0,
    },
    DM:{
      NumberActuators: '[40]',
      DmPitchs: '[0.2]',
      DmHeights: '[0.0]',
      AoArea: 'circle',
    },
    RTC:{
      LoopGain_HO: 0.3,
      LoopGain_LO: 'optimize',
      SensorFrameRate_HO: 1000.0,
      LoopDelaySteps_HO: 3,
      SensorFrameRate_LO: 500.0,
      LoopDelaySteps_LO: 2,
    },
  },
}

const editableFields = {
  atmosphere: {
    Seeing: 'number',
  },
  sensor_HO: {
    NumberPhotons: 'text',
  },
    sensor_LO: {
    NumberPhotons: 'text',
  },  
};

const presetToKey = {
  ERIS_SCAO_NGS: 'SCAO_NGS',
  ERIS_SCAO_LGS: 'SCAO_LGS',
};

const getF0FromWavelength = (lambda) => {
  const µm = lambda * 1e6; // µm

  if (µm >= 0.332 && µm < 0.398) return 4.34e10; // U
  if (µm >= 0.398 && µm < 0.492) return 6.4e10;  // B
  if (µm >= 0.507 && µm < 0.595) return 3.75e10; // V
  if (µm >= 0.589 && µm < 0.727) return 2.2e10; // R
  if (µm >= 0.731 && µm < 0.881) return 1.2e10; // I
  if (µm >= 1.17 && µm < 1.33) return 3.1e10; // J
  if (µm >= 1.505 && µm < 1.795) return 8.17e11; // H
  if (µm >= 2.03 && µm <2.37) return 4.66e11; // K
  if (µm >= 3.165 && µm < 3.735) return 9.35e10; // L
  if (µm >= 4.63 && µm < 4.87) return 2.29e10; // M

  return null; 
};

const getBandFromWavelength = (lambda) => {
  const µm = lambda * 1e6;
  if (µm >= 0.332 && µm < 0.398) return 'U';
  if (µm >= 0.398 && µm < 0.492) return 'B';
  if (µm >= 0.507 && µm < 0.595) return 'V';
  if (µm >= 0.589 && µm < 0.727) return 'R';
  if (µm >= 0.731 && µm < 0.881) return 'I';
  if (µm >= 1.17 && µm < 1.33) return 'J';
  if (µm >= 1.505 && µm < 1.795) return 'H';
  if (µm >= 2.03 && µm < 2.37) return 'K';
  if (µm >= 3.165 && µm < 3.735) return 'L';
  if (µm >= 4.63 && µm < 4.87) return 'M';
  return 'Unknown';
};

export default function IniGenerator() {
  const [selectedOption, setSelectedOption] = useState('ERIS_SCAO_NGS');
  const [params, setParams] = useState({ ...configPresets['ERIS_SCAO_NGS'] });
  const [generatedIni, setGeneratedIni] = useState('');
  const [Seeing, setSeeing] = useState("");
  const [magnitude, setMagnitude] = useState('');
  const [loPart, setLoPart] = useState(false); // for SCAO LGS only

  const systemKey = presetToKey[selectedOption];

  const handleChange = (section, field, value) => {
    setParams((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleOptionChange = (e) => {
    const opt = e.target.value;
    setSelectedOption(opt);
    setParams({ ...configPresets[opt] });
    setLoPart(false);
    setMagnitude('');
  };

  const magnitudeToPhotons = (mag) => {
    try {
      if (!mag || isNaN(mag)) return '[0]';

      let sensorKey = 'sensor_HO';
      let wavelengthKey = 'sources_HO';
      let rtcFrameRateKey = 'SensorFrameRate_HO';

      if (systemKey === 'SCAO_LGS' && loPart) {
        sensorKey = 'sensor_LO';
        wavelengthKey = 'sources_LO';
        rtcFrameRateKey = 'SensorFrameRate_LO';
      }

      const D = Number(params.telescope.TelescopeDiameter);
      let N_lenslet_raw = params[sensorKey]?.NumberLenslets;
      let N_lenslet = 20;

      if (typeof N_lenslet_raw === 'string' && N_lenslet_raw.trim() !== '') {
        const parsed = N_lenslet_raw.replace(/[\[\]]/g, '').split(',')[0];
        const num = Number(parsed);
        if (!isNaN(num) && num > 0) {
          N_lenslet = num;
        }
      } else if (typeof N_lenslet_raw === 'number' && N_lenslet_raw > 0) {
        N_lenslet = N_lenslet_raw;
      }

      const sensorFrameRate = Number(params.RTC?.[rtcFrameRateKey]) || 1000;

    let lambda_raw = params[wavelengthKey]?.Wavelength;
    let lambda = 0;
    if (typeof lambda_raw === 'string') {
      lambda = Number(lambda_raw.replace(/[\[\]]/g, ''));
    } else {
      lambda = Number(lambda_raw);
    }

      if (!D || !N_lenslet || !sensorFrameRate || !lambda) return '[0]';

      const F0 = getF0FromWavelength(lambda);

      const photons =
        F0 * Math.pow(D / N_lenslet, 2) * (1 / sensorFrameRate) * Math.pow(10, -0.4 * mag);

      return `[${photons.toFixed(1)}]`;
    } catch {
      return '[0]';
    }
  };

  const onMagnitudeChange = (magValue) => {
    setMagnitude(magValue);

    if (!magValue || isNaN(magValue)) {
      // Valeur nulle => reset à 0
      handleChange(systemKey === 'SCAO_LGS' && loPart ? 'sensor_LO' : 'sensor_HO', 'NumberPhotons', '[0]');
      return;
    }

    const photons = magnitudeToPhotons(Number(magValue));

    if (systemKey === 'SCAO_LGS' && loPart) {
      handleChange('sensor_LO', 'NumberPhotons', photons);
    } else {
      handleChange('sensor_HO', 'NumberPhotons', photons);
    }
  };

  const generateIni = () => {
  const iniSections = { ...params };
  let iniString = '';

  for (const section in iniSections) {
    if (systemKey === 'SCAO_LGS' && loPart && section === 'sensor_HO') continue;
    if (systemKey === 'SCAO_LGS' && !loPart && section === 'sensor_LO') continue;

    iniString += `[${section}]\n`;

      if (section === 'sources_HO' || section === 'sources_LO') {
        let lambda_raw = iniSections[section]?.Wavelength;
        let lambda = 0;
        if (typeof lambda_raw === 'string') {
          lambda = Number(lambda_raw.replace(/[\[\]]/g, ''));
        } else {
          lambda = Number(lambda_raw);
        }
        const band = getBandFromWavelength(lambda);
        iniString += `# Band: ${band}\n`;
      }

      const fields = iniSections[section];
      for (const key in fields) {
        let value = fields[key];
        const expectedType = editableFields[section]?.[key];

        if (expectedType === 'number') {
          value = Number(value);
          iniString += `${key} = ${value}\n`;
        } else if (value === 'None') {
          iniString += `${key} = None\n`;
        } else if (
          typeof value === 'string' &&
          value.trim().startsWith('[') &&
          value.trim().endsWith(']')
        ) {
          iniString += `${key} = ${value.trim()}\n`;
        } else if (typeof value === 'string') {
          iniString += `${key} = '${value}'\n`;
        } else {
          iniString += `${key} = ${value}\n`;
        }
      }
      iniString += `\n`;
    }
    setGeneratedIni(iniString.trim());
  };

  // const getCurrentBand = () => {
  //   let wavelengthRaw = null;
  //   if ((systemKey === 'SCAO_NGS') || (systemKey === 'SCAO_LGS' && !loPart)) {
  //     wavelengthRaw = params.sources_HO?.Wavelength;
  //   } else if (systemKey === 'SCAO_LGS' && loPart) {
  //     wavelengthRaw = params.sources_LO?.Wavelength;
  //   }

  //   if (!wavelengthRaw) return '';

  //   let lambda = 0;
  //   if (typeof wavelengthRaw === 'string') {
  //     lambda = Number(wavelengthRaw.replace(/[\[\]]/g, ''));
  //   } else {
  //     lambda = Number(wavelengthRaw);
  //   }
  //   return getBandFromWavelength(lambda);
  // };


  useEffect(() => {
    if (!magnitude || isNaN(magnitude)) return;

    const photons = magnitudeToPhotons(Number(magnitude));

    if (systemKey === 'SCAO_LGS' && loPart) {
      handleChange('sensor_LO', 'NumberPhotons', photons);
    } else {
      handleChange('sensor_HO', 'NumberPhotons', photons);
    }
  }, [params.sources_HO?.Wavelength, params.sources_LO?.Wavelength, magnitude, systemKey, loPart]);

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, margin: '20px 0' }}>
      <h3>Generate your config.ini - Work in progress - Not fully operational yet.</h3>

      <label>
        Select instrument:&nbsp;
        <select value={selectedOption} onChange={handleOptionChange} style={{ marginLeft: 10 }}>
          {Object.keys(configPresets).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

       <hr />

      <div style={{ marginBottom: 16 }}>
        <label>
          Seeing (arcsec):&nbsp;
          <input
            type="number"
            value={params.atmosphere.Seeing}
            step="0.01"
            onChange={(e) => handleChange('atmosphere', 'Seeing', parseFloat(e.target.value))}
            style={{ marginLeft: 10 }}
          />
        </label>
      </div>

      {/* onChange={(e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0 && val < 5) {
          handleChange('atmosphere', 'Seeing', val);
        }
      }} */}

      {/* Affichage conditionnel selon système */}
      {systemKey === 'SCAO_NGS' && (
        <div style={{ marginBottom: 16, fontWeight: 'bold' }}>
          NGS only system
        </div>
      )}

      {systemKey === 'SCAO_LGS' && (
        <div style={{ marginBottom: 16 }}>
          <label>
            LO part?&nbsp;
            <input
              type="checkbox"
              checked={loPart}
              onChange={(e) => {
                setLoPart(e.target.checked);
                setMagnitude('');
                // reset photons
                handleChange('sensor_HO', 'NumberPhotons', '[0]');
                handleChange('sensor_LO', 'NumberPhotons', '[0]');
              }}
            />
          </label>
        </div>
      )}


      {(systemKey === 'SCAO_NGS' || (systemKey === 'SCAO_LGS' && !loPart)) && params.sources_HO && (
      <div style={{ marginBottom: '1em' }}>
        <strong>[sources_HO]</strong>
        <div style={{ marginTop: '0.5em' }}>
          <label>
            Wavelength (m):
            <input
              type="text"
              value={
                typeof params.sources_HO.Wavelength === 'string'
                  ? params.sources_HO.Wavelength.replace(/[\[\]]/g, '')
                  : params.sources_HO.Wavelength
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9.eE+\-]+$/.test(val)) {
                    handleChange('sources_HO', 'Wavelength', `[${val}]`);
                }
              }}
              style={{ marginLeft: 10, marginRight: 10 }}
              />
            </label>
          <span>
            Band: {getBandFromWavelength(
              Number(
                typeof params.sources_HO.Wavelength === 'string'
                  ? params.sources_HO.Wavelength.replace(/[\[\]]/g, '')
                  : params.sources_HO.Wavelength
                )
            )}
          </span>
        </div>
      </div>
      )}
      
      {systemKey === 'SCAO_LGS' && loPart && params.sources_LO && (
      <div style={{ marginBottom: '1em' }}>
        <strong>[sources_LO]</strong>
        <div style={{ marginTop: '0.5em' }}>
          <label>
            Wavelength (m):
            <input
              type="text"
              value={
                typeof params.sources_LO.Wavelength === 'string'
                  ? params.sources_LO.Wavelength.replace(/[\[\]]/g, '')
                  : params.sources_LO.Wavelength
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9.eE+\-]+$/.test(val)) {
                    handleChange('sources_LO', 'Wavelength', `[${val}]`);
                }
              }}
              style={{ marginLeft: 10, marginRight: 10 }}
              />
            </label>
        <span>
          Band: {getBandFromWavelength(
            Number(
              typeof params.sources_LO.Wavelength === 'string'
                ? params.sources_LO.Wavelength.replace(/[\[\]]/g, '')
                : params.sources_LO.Wavelength
            )
          )}
        </span>
        </div>
      </div>
      )}

      {((systemKey === 'SCAO_NGS') || (systemKey === 'SCAO_LGS' && !loPart)) && params.sensor_HO && (
        <div style={{ marginBottom: '1em' }}>
          <strong>[sensor_HO]</strong>
          <div style={{ marginTop: '0.5em' }}>
            <label>
              Magnitude:
              <input
                type="number"
                value={magnitude}
                onChange={(e) => onMagnitudeChange(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </label>
          </div>
          {Object.entries(editableFields.sensor_HO).map(([field, type]) => (
            <div key={`sensor_HO-${field}`} style={{ marginTop: '0.5em' }}>
              <label>
                {field}:
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  value={params.sensor_HO[field]}
                  onChange={(e) => handleChange('sensor_HO', field, e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </label>
            </div>
          ))}
        </div>
      )}

            {/* Affichage des champs editables selon LO part */}
      {systemKey === 'SCAO_LGS' && loPart && params.sensor_LO && (
        <div style={{ marginBottom: '1em' }}>
          <strong>[sensor_LO]</strong>
          <div style={{ marginTop: '0.5em' }}>
            <label>
              Magnitude:
              <input
                type="number"
                value={magnitude}
                onChange={(e) => onMagnitudeChange(e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </label>
          </div>
          {Object.entries(editableFields.sensor_LO).map(([field, type]) => (
            <div key={`sensor_LO-${field}`} style={{ marginTop: '0.5em' }}>
              <label>
                {field}:
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  value={params.sensor_LO[field]}
                  onChange={(e) => handleChange('sensor_LO', field, e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      <button onClick={generateIni} style={{ marginTop: 10 }}>Generate INI </button>

      {generatedIni && (
        <div style={{ marginTop: '20px' }}>
          <h4>Generated .ini configuration file:</h4>
          <pre style={{ background: '#f0f0f0', padding: 10 }}>
            <code>{generatedIni}</code>
          </pre>
        </div>
      )}
    </div>
  );
}


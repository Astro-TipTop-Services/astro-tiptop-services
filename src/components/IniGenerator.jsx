import { useState, useEffect } from 'react';

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
    sources_science: {
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
    sources_science: {
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

// const getF0FromWavelength = (lambda) => {
//   const µm = lambda * 1e6; // µm

//   if (µm >= 0.332 && µm < 0.398) return 4.34e10; // U
//   if (µm >= 0.398 && µm < 0.492) return 6.4e10;  // B
//   if (µm >= 0.507 && µm < 0.595) return 3.75e10; // V
//   if (µm >= 0.589 && µm < 0.727) return 2.2e10; // R
//   if (µm >= 0.731 && µm < 0.881) return 1.2e10; // I
//   if (µm >= 1.17 && µm < 1.33) return 3.1e10; // J
//   if (µm >= 1.505 && µm < 1.795) return 8.17e11; // H
//   if (µm >= 2.03 && µm <2.37) return 4.66e11; // K
//   if (µm >= 3.165 && µm < 3.735) return 9.35e10; // L
//   if (µm >= 4.63 && µm < 4.87) return 2.29e10; // M

//   return null; 
// };

const getF0FromWavelength = (lambda) => {
  const µm = lambda * 1e6; // µm

  if (µm >= 0.398 && µm < 0.492) return 1.24e10;  // B
  if (µm >= 0.507 && µm < 0.595) return 8.37e9; // V
  if (µm >= 0.589 && µm < 0.727) return 1.36e10; // R
  if (µm >= 0.731 && µm < 0.881) return 8.93e9; // I
  if (µm >= 1.17 && µm < 1.33) return 4.11e9; // J
  if (µm >= 1.505 && µm < 1.795) return 2.87e9; // H
  if (µm >= 2.03 && µm <2.37) return 1.70e9; // K

  return null; 
};

const getTotThroughput = (lambda) => {
  const µm = lambda * 1e6;

  if (µm >= 0.398 && µm < 0.492) return 0.07;  // B
  if (µm >= 0.507 && µm < 0.595) return 0.16; // V
  if (µm >= 0.589 && µm < 0.727) return 0.19; // R
  if (µm >= 0.731 && µm < 0.881) return 0.20; // I
  if (µm >= 1.17 && µm < 1.33) return 0.24; // J
  if (µm >= 1.505 && µm < 1.795) return 0.264; // H
  if (µm >= 2.03 && µm <2.37) return 0.26; // K

  return null; 
};

const getBandFromWavelength = (lambda) => {
  const µm = lambda * 1e6;
  // if (µm >= 0.332 && µm < 0.398) return 'U';
  if (µm >= 0.398 && µm < 0.492) return 'B';
  if (µm >= 0.507 && µm < 0.595) return 'V';
  if (µm >= 0.589 && µm < 0.727) return 'R';
  if (µm >= 0.731 && µm < 0.881) return 'I';
  if (µm >= 1.17 && µm < 1.33) return 'J';
  if (µm >= 1.505 && µm < 1.795) return 'H';
  if (µm >= 2.03 && µm < 2.37) return 'K';
  // if (µm >= 3.165 && µm < 3.735) return 'L';
  // if (µm >= 4.63 && µm < 4.87) return 'M';
  return 'Unknown';
};

const wavelengthByBand = {
  J: 1.28e-6, // m
  H: 1.66e-6,
  K: 2.18e-6,
  L: 3.32e-6,
  // M: 4.8e-6,
  // N: 10e-6,
  // Q: 20e-6,
};


export default function IniGenerator() {
  const [selectedOption, setSelectedOption] = useState('ERIS_SCAO_NGS');
  const [params, setParams] = useState({ ...configPresets['ERIS_SCAO_NGS'] });
  const [generatedIni, setGeneratedIni] = useState('');
  const [magnitude, setMagnitude] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  // const [loPart, setLoPart] = useState(false); // for SCAO LGS only

  const filename = `config_${presetToKey[selectedOption] || selectedOption}.ini`;

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
    // setLoPart(true);
    setMagnitude('');
  };

  const magnitudeToPhotons = (mag) => {
    try {
      if (!mag || isNaN(mag)) return '[0]';

      let sensorKey = 'sensor_HO';
      let wavelengthKey = 'sources_HO';
      let rtcFrameRateKey = 'SensorFrameRate_HO';

      if (systemKey === 'SCAO_LGS') {
        sensorKey = 'sensor_LO';
        wavelengthKey = 'sources_LO';
        rtcFrameRateKey = 'SensorFrameRate_LO';
      }

      const D = Number(params.telescope.TelescopeDiameter);
      const OR = Number(params.telescope.ObscurationRatio);
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
      const Tot_throughput = getTotThroughput(lambda);

      if (!F0 || !Tot_throughput) {
        console.warn("missing values: ", { F0, Tot_throughput });
        return '[0]';
      }

      const band = getBandFromWavelength(lambda);
      const bandCorrection = { //M0V
        B: 1.37,
        V: 0,
        R: -1.26,
        I: -2.15,
        J: -2.49,
        H: -3.03,
        K: -3.29,
      }

      const magCorr =  Math.round((mag + (bandCorrection[band] ?? 0)) * 100) / 100;

      const photons =  F0 * (Tot_throughput / sensorFrameRate) * (Math.pow(D, 2) - Math.pow(D*OR, 2)) 
      * Math.pow(1/N_lenslet, 2) * Math.pow(10, -0.4 * magCorr);
      // F0 * (Tot_throughput / sensorFrameRate) * 
      // Math.PI/4 * (Math.pow(D, 2) - Math.pow(D*OR, 2)) * Math.pow(10, -0.4 * magCorr);
        // F0 * Math.pow(D / N_lenslet, 2) * (1 / sensorFrameRate) * Math.pow(10, -0.4 * mag);    

      return `[${photons.toFixed(2)}]`;
    } catch {
      return '[0]';
    }
  };

  const onMagnitudeChange = (magValue) => {
    setMagnitude(magValue);

    if (!magValue || isNaN(magValue)) {
      // Valeur nulle => reset à 0
      const section = systemKey === 'SCAO_LGS' ? 'sensor_LO' : 'sensor_HO';
      handleChange(section, 'NumberPhotons', '[0]');
      return;
      // handleChange('sensor_HO', 'NumberPhotons', params.sensor_HO.NumberPhotons);
      // handleChange('sensor_LO', 'NumberPhotons', params.sensor_LO.NumberPhotons);
      // return;
    }

    const photons = magnitudeToPhotons(Number(magValue));

    if (systemKey === 'SCAO_LGS') {
      handleChange('sensor_LO', 'NumberPhotons', photons);
    } else {
      handleChange('sensor_HO', 'NumberPhotons', photons);
    }
  };

  const [selectedBand, setSelectedBand] = useState('');

  useEffect(() => {
    if (!generatedIni) return;

    const blob = new Blob([generatedIni], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    return () => {
      URL.revokeObjectURL(url); // Cleans up old URL
    };
  }, [generatedIni]);



  //*********generateIni**********
  const generateIni = () => {
  const iniSections = { ...params };
  let iniString = '';

  for (const section in iniSections) {
    // if (systemKey === 'SCAO_LGS' && section === 'sensor_HO') continue;
    // if (loPart && section === 'sensor_HO') continue;
    // if (!loPart && (section === 'sensor_LO' || section === 'sources_LO')) continue;

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

        // if (!loPart) {
        //   // if (section === 'sources_HO' && key === 'Wavelength') continue;
        //   if (section === 'RTC' && key.includes('_LO')) continue;
        // }

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

  useEffect(() => {
    if (!magnitude || isNaN(magnitude)) return;

    const photons = magnitudeToPhotons(Number(magnitude));

    if (systemKey === 'SCAO_LGS') {
      handleChange('sensor_LO', 'NumberPhotons', photons);
    } else {
      handleChange('sensor_HO', 'NumberPhotons', photons);
    }
  }, [params.sources_HO?.Wavelength, params.sources_LO?.Wavelength, magnitude, systemKey]);

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, margin: '20px 0' }}>
      <h3> .ini Parameter File Generator - <a href="/docs/orion/AO_instruments">For Available AO Instruments</a></h3>

      <label>
        Select instrument:&nbsp;
        <select value={selectedOption} onChange={handleOptionChange} style={{ marginLeft: 10 }}>
          {Object.keys(configPresets).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      {/* Conditional display according to system */}
      {systemKey === 'SCAO_NGS' && (
        <div style={{ marginTop: 16, marginBottom: 16, fontWeight: 'bold' }}>
          NGS only system ✴️ <br/> HO part: Science - NGS 
        </div>
      )}

       {systemKey === 'SCAO_LGS' && (
        <div style={{ marginTop: 16, marginBottom: 10, fontWeight: 'bold' }}>
          HO part: Science - LGS ✳️ <br/> LO part: NGS ✴️
        </div>
      )}

       <hr />

      {/* Always show ZenithAngle */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>[telescope]</strong> </div>
        <label>
          Zenith Angle (degree):&nbsp;
          <input
            type="number"
            value={params.telescope.ZenithAngle}
            step="0.1"
            onChange={(e) => {const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0 && val < 90) {
              handleChange('telescope', 'ZenithAngle', val);
            }
            }}
            style={{ marginLeft: 10 }}
          />
          <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: '#555' }}>
            ℹ️ the angle between the telescope's pointing direction and the zenith
          </span>
        </label>
      </div>

      {/* Always show seeing */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>[sources_science]</strong> </div>
        <label>
          Seeing (arcsec):&nbsp;
          <input
            type="number"
            value={params.atmosphere.Seeing}
            step="0.01"
            onChange={(e) => {const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0.19 && val < 5.01) {
              handleChange('atmosphere', 'Seeing', val);
            }
            }}
            style={{ marginLeft: 10 }}
          />
          <span style={{ marginLeft: '12px', fontSize: '0.9rem', color: '#555' }}>
            ℹ️ defined at Zenith (<code>[Telescope] ZenithAngle = 0</code>)
          </span>
        </label>
      </div>



      {params.sources_science && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>[sources_science]</strong>
          <div style={{ marginTop: '0.5em' }}>
          <label>
            Band:&nbsp;
            <select
              value={selectedBand}
              onChange={(e) => {
              const band = e.target.value;
              setSelectedBand(band);
              const raw = wavelengthByBand[band];
              const wavelength = raw ? raw.toExponential() : '0';
              handleChange('sources_science', 'Wavelength', `[${wavelength}]`);
            }}
            >
            <option value="">-- Select Band --</option>
            {Object.entries(wavelengthByBand).map(([band, lambda]) => {
            const lambdaNum = parseFloat(lambda);
            return (
            <option key={band} value={band}>
              {band} ({(lambdaNum * 1e6).toFixed(2)} µm)
            </option>
            );  
          })}
          </select>
          {selectedBand && (
          <span style={{ marginLeft: '10px', color: '#555' }}>
            λ = {wavelengthByBand[selectedBand] * 1e9} nm
          </span>
          )}
          </label>
        </div>
        <div style={{ marginTop: '0.5em' }}>
        <label>
          Distance* (arcsec):
          <input
            type="number"
            value={
              typeof params.sources_science.Zenith === 'string'
                ? params.sources_science.Zenith.replace(/[\[\]]/g, '')
                : params.sources_science.Zenith
            }
            step="0.01"
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^[0-9.eE+\-]+$/.test(val)) {
                handleChange('sources_science', 'Zenith', `[${val}]`);
              }
            }}
            style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      </div>
      )}

        {systemKey === 'SCAO_NGS' && params.sources_HO && (
        <div style={{ marginBottom: '1em' }}>
          <strong>[sources_HO]</strong>
          {/* <div style={{ marginTop: '0.5em' }}>
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
          </div> */}
          <div style={{marginTop: '0.5em'}}>
              NGS Wavelength set at {' '}
              <span> 
                {Number(
                      typeof params.sources_HO.Wavelength === 'string'
                      ? params.sources_HO.Wavelength.replace(/[\[\]]/g, '')
                      : params.sources_HO.Wavelength
                )*1e9}{' '}
                nm | 
              </span> {' '}
              Band:{' '}
              <span>
               {getBandFromWavelength(
                Number(
                  typeof params.sources_HO.Wavelength === 'string'
                    ? params.sources_HO.Wavelength.replace(/[\[\]]/g, '')
                    : params.sources_HO.Wavelength
                  )
              )}
           </span>
          </div>
          <div style={{marginTop: '0.5em'}}>
            <label>
              Distance* (arcsec):
              <input
                type="number"
                value={
                typeof params.sources_HO.Zenith === 'string'
                  ? params.sources_HO.Zenith.replace(/[\[\]]/g, '')
                  : params.sources_HO.Zenith
                }
                step="0.01"
                onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[0-9.eE+\-]+$/.test(val)) {
                  handleChange('sources_HO', 'Zenith', `[${val}]`);
                }
                }}
                style={{ marginLeft: 10 }}
              />
            </label>
        </div>
        </div>
        )}
      
        {systemKey === 'SCAO_LGS' && params.sources_LO && (
        <div style={{ marginBottom: '1em' }}>
          <strong>[sources_LO]</strong>
          {/* <div style={{ marginTop: '0.5em' }}>
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
            </div> */}
            <div style={{marginTop: '0.5em'}}>
              NGS Wavelength set at {' '}
              <span> 
                {Number(
                      typeof params.sources_LO.Wavelength === 'string'
                      ? params.sources_LO.Wavelength.replace(/[\[\]]/g, '')
                      : params.sources_LO.Wavelength
                )*1e9}{' '}
                nm | 
              </span> {' '}
              Band:{' '}
              <span>
               {getBandFromWavelength(
                Number(
                  typeof params.sources_LO.Wavelength === 'string'
                    ? params.sources_LO.Wavelength.replace(/[\[\]]/g, '')
                    : params.sources_LO.Wavelength
                  )
              )}
             </span>
            </div>
            <div style={{ marginTop: '0.5em' }}>
              <label>
                Distance* (arcsec):
                <input
                type="number"
                value={
                  typeof params.sources_LO.Zenith === 'string'
                  ? params.sources_LO.Zenith.replace(/[\[\]]/g, '')
                  : params.sources_LO.Zenith
                }
                step="0.01"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[0-9.eE+\-]+$/.test(val)) {
                    handleChange('sources_LO', 'Zenith', `[${val}]`);
                  }
                }}
                style={{ marginLeft: 10 }}
                />
              </label>
            </div>
          </div>
        )}

        {(systemKey === 'SCAO_NGS') && params.sensor_HO && (
          <div style={{ marginBottom: '1em' }}>
            <strong>[sensor_HO]</strong>
            <div style={{ marginTop: '0.5em' }}>
              <label>
                V-Magnitude:
                <input
                  type="number"
                  value={magnitude}
                  onChange={(e) => onMagnitudeChange(e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </label>
              {(() => {
        const lambdaRaw = params.sources_HO?.Wavelength;
        let lambda = 0;
        if (typeof lambdaRaw === 'string') {
          lambda = Number(lambdaRaw.replace(/[\[\]]/g, ''));
        } else {
          lambda = Number(lambdaRaw);
        }

        const bandCorrection = {
          B: 1.37,
          V: 0,
          R: -1.26,
          I: -2.15,
          J: -2.49,
          H: -3.03,
          K: -3.29,
        };

        const band = getBandFromWavelength(lambda);
        const magNum = Number(magnitude);
         if (!isNaN(magNum) && magnitude.trim() !== '' && band in bandCorrection) {
          const magCorr = (magNum + bandCorrection[band]).toFixed(2);
          return <span style={{ marginLeft: 10}}>{band}-Magnitude: {magCorr} (spectral class: M0V)</span>;
        }
        return null;
      })()}
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

        {/* Display of editable fields according to LO part */}
        {systemKey === 'SCAO_LGS' && params.sensor_LO && (
          <div style={{ marginBottom: '1em' }}>
            <strong>[sensor_LO]</strong>
            <div style={{ marginTop: '0.5em' }}>
              <label>
                V-Magnitude:
                <input
                  type="number"
                  value={magnitude}
                  onChange={(e) => onMagnitudeChange(e.target.value)}
                  style={{ marginLeft: 10 }}
                />
              </label>
                            {(() => {
        const lambdaRaw = params.sources_LO?.Wavelength;
        let lambda = 0;
        if (typeof lambdaRaw === 'string') {
          lambda = Number(lambdaRaw.replace(/[\[\]]/g, ''));
        } else {
          lambda = Number(lambdaRaw);
        }

        const bandCorrection = {
          B: 1.37,
          V: 0,
          R: -1.26,
          I: -2.15,
          J: -2.49,
          H: -3.03,
          K: -3.29,
        };

        const band = getBandFromWavelength(lambda);
        const magNum = Number(magnitude);
         if (!isNaN(magNum) && magnitude.trim() !== '' && band in bandCorrection) {
          const magCorr = (magNum + bandCorrection[band]).toFixed(2);
          return <span style={{ marginLeft: 10}}>{band}-Magnitude: {magCorr} (spectral class: M0V)</span>;
        }
        return null;
      })()}
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


      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={generateIni}>
          Generate INI
        </button>

        {downloadUrl && (
        <a
          href={downloadUrl}
          download={filename}
          style={{
          padding: '6px 12px',
          background: '#007bff',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: 4,
          display: 'inline-block',
          }}
        >
          Download .ini file
        </a>
        )}
      </div>

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


import { useState, useEffect, useMemo} from 'react';
import Link from '@docusaurus/Link';
import Presets from '../configPresets.json';

const renameMap = {
  "ERIS": "ERIS_SCAO_NGS",
  "ERIS_LGS": "ERIS_SCAO_LGS",
  "HARMONI_SCAO": "HARMONI_SCAO_NGS",
  "MICADO_SCAO": "MICADO_SCAO_NGS",
  "SOUL": "SOUL_SCAO_NGS",
  "SPHERE": "SPHERE_SCAO_NGS",
};

const presetsToKeep = ["ERIS_SCAO_NGS", 
                      "ERIS_SCAO_LGS",
                      "HARMONI_SCAO_NGS",
                      "MICADO_SCAO_NGS",
                      "SOUL_SCAO_NGS",
                      "SPHERE_SCAO_NGS"];

function processPresets(presets, renameMap, keepList) {
  const renamedPresets = Object.entries(presets).reduce((acc, [key, value]) => {
    const newKey = renameMap[key] || key;  
    acc[newKey] = value;
    return acc;
  }, {});

  if (keepList && keepList.length > 0) {
    return Object.fromEntries(
      Object.entries(renamedPresets).filter(([key]) => keepList.includes(key))
    );
  }

  return renamedPresets;
}

const configPresets = processPresets(Presets, renameMap, presetsToKeep);

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
  HARMONI_SCAO_NGS: 'SCAO_NGS',
  MICADO_SCAO_NGS: 'SCAO_NGS',
  SOUL_SCAO_NGS: 'SCAO_NGS',
  SPHERE_SCAO_NGS: 'SCAO_NGS',
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

  if (µm >= 0.390 && µm < 0.455) return 1.24e10;  // B
  if (µm >= 0.455 && µm < 0.595) return 8.37e9; // V
  if (µm >= 0.595 && µm < 0.715) return 1.36e10; // R
  if (µm >= 0.715 && µm < 1.050) return 8.93e9; // I
  if (µm >= 1.050 && µm < 1.345) return 4.11e9; // J
  if (µm >= 1.505 && µm < 1.815) return 2.87e9; // H
  if (µm >= 1.815 && µm <2.384) return 1.70e9; // K

  return null; 
};

const getTotThroughput = (lambda) => {
  const µm = lambda * 1e6;

  if (µm >= 0.390 && µm < 0.455) return 0.07;  // B
  if (µm >= 0.455 && µm < 0.595) return 0.16; // V
  if (µm >= 0.595 && µm < 0.715) return 0.19; // R
  if (µm >= 0.715 && µm < 1.050) return 0.20; // I
  if (µm >= 1.050 && µm < 1.345) return 0.24; // J
  if (µm >= 1.505 && µm < 1.815) return 0.264; // H
  if (µm >= 1.815 && µm <2.384) return 0.26; // K

  return null; 
};

const getBandFromWavelength = (lambda) => {
  const µm = lambda * 1e6;
  // if (µm >= 0.332 && µm < 0.398) return 'U';
  if (µm >= 0.390 && µm < 0.455) return 'B';
  if (µm >= 0.455 && µm < 0.595) return 'V';
  if (µm >= 0.595 && µm < 0.715) return 'R';
  if (µm >= 0.715 && µm < 0.865) return 'I';
  if (µm >= 0.865 && µm < 1.050) return 'Iz';
  if (µm >= 1.050 && µm < 1.345) return 'J';
  if (µm >= 1.345 && µm < 1.815) return 'H';
  if (µm >= 1.815 && µm < 2.317) return 'Ks';
  if (µm >= 2.317 && µm < 2.384) return 'K';
  // if (µm >= 3.165 && µm < 3.735) return 'L';
  // if (µm >= 4.63 && µm < 4.87) return 'M';
  return 'Unknown';
};

const wavelengthByBand = {
  B: 0.422e-6,
  V: 0.55e-6,
  R: 0.66e-6,
  I: 0.80e-6,
  Iz: 0.95e-6,
  J: 1.20e-6, 
  H: 1.66e-6,
  K: 2.10e-6,
  L: 3.32e-6,
  M: 4.78e-6,
  // N: 10e-6,
  // Q: 20e-6,
};

const availableBandsByInstrument = {
  ERIS_SCAO_NGS: ['J', 'H', 'K', 'L','M'],
  ERIS_SCAO_LGS: ['J', 'H', 'K', 'L','M'],
  HARMONI_SCAO_NGS: ['I','J','H','K'],
  MICADO_SCAO_NGS: ['I','J','H','K'],
  SPHERE_SCAO_NGS: ['V','R','I','J','H','K'],
  SOUL_SCAO_NGS: ['V','R','I','J','H','K'],
};

export default function IniGenerator() {
  const [selectedOption, setSelectedOption] = useState('ERIS_SCAO_NGS');
  const [params, setParams] = useState({ ...configPresets['ERIS_SCAO_NGS'] });
  const [generatedIni, setGeneratedIni] = useState('');
  const [magnitude, setMagnitude] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  // const [loPart, setLoPart] = useState(false); // for SCAO LGS only

  const filename = `${selectedOption || selectedOption}.ini`;

  const systemKey = presetToKey[selectedOption];
  // const systemKey = useMemo(() => {
  //   if (params.sensor_HO && params.sources_HO) return 'SCAO_NGS';
  //   if (params.sensor_LO && params.sources_LO) return 'SCAO_LGS';
  //   return 'UNKNOWN';
  // }, [params]);

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
        Iz: -2.15,
        J: -2.49,
        H: -3.03,
        Ks: -3.29,
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

  const photonsToMagnitude = (photonsVal) => {
    try {
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
    const sensorFrameRate = Number(params.RTC?.[rtcFrameRateKey]) || 1000;

    let lambda_raw = params[wavelengthKey]?.Wavelength;
    let lambda = typeof lambda_raw === 'string'
      ? Number(lambda_raw.replace(/[\[\]]/g, ''))
      : Number(lambda_raw);

    let N_lenslet_raw = params[sensorKey]?.NumberLenslets;
    let N_lenslet = typeof N_lenslet_raw === 'string'
      ? Number(N_lenslet_raw.replace(/[\[\]]/g, '').split(',')[0])
      : Number(N_lenslet_raw);

    const F0 = getF0FromWavelength(lambda);
    const Tot_throughput = getTotThroughput(lambda);
    const band = getBandFromWavelength(lambda);
    const bandCorrection = {
      B: 1.37, V: 0, R: -1.26, I: -2.15, Iz: -2.15,
      J: -2.49, H: -3.03, Ks: -3.29, K: -3.29
    };

    if (!F0 || !Tot_throughput || !D || !N_lenslet || !sensorFrameRate || !lambda) return '';

    const photons = Number(photonsVal);
    if (isNaN(photons) || photons <= 0) return '';

    const preFactor = F0 * (Tot_throughput / sensorFrameRate) * (Math.pow(D, 2) - Math.pow(D * OR, 2)) * Math.pow(1 / N_lenslet, 2);
    const magCorr = -2.5 * Math.log10(photons / preFactor);
    const mag = magCorr - (bandCorrection[band] ?? 0);

    return mag.toFixed(2);
  } catch {
    return '';
  }
};

  const onMagnitudeChange = (magValue) => {
    setMagnitude(magValue);

    if (!magValue || isNaN(magValue)) {
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
  const availableBands = availableBandsByInstrument[selectedOption] || Object.keys(wavelengthByBand);

  useEffect(() => {
    if (!generatedIni) return;

    const blob = new Blob([generatedIni], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);

    return () => {
      URL.revokeObjectURL(url); // Cleans up old URL
    };
  }, [generatedIni]);


  ///////////////////////////////////////////////////
  //******************generateIni********************
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
        // if (systemKey === 'SCAO_NGS') {
        //   const band = getBandFromWavelength(lambda);
        //   iniString += `# Band: ${band}\n`;
        // }
      }

      const fields = iniSections[section];
      for (const key in fields) {
        let value = fields[key];
        const expectedType = editableFields[section]?.[key];

        // if (!loPart) {
        //   // if (section === 'sources_HO' && key === 'Wavelength') continue;
        //   if (section === 'RTC' && key.includes('_LO')) continue;
        // }

      if (section === 'sensor_HO' || section === 'sensor_LO') {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          // Cas : valeur est déjà une liste => on la garde telle quelle
            iniString += `${key} = ${trimmed}\n`;
          } else if (trimmed === 'None') {
          // Cas : None (mot-clé Python)
            iniString += `${key} = None\n`;
          } else if (!isNaN(Number(trimmed))) {
          // Cas : nombre (ex: "6", "0.2")
          iniString += `${key} = ${Number(trimmed)}\n`;
          } else {
          // Cas : chaîne (ex: 'Shack-Hartmann')
          iniString += `${key} = '${trimmed}'\n`;
          }
          } else {
          // Cas de valeur non-string 
          iniString += `${key} = ${value}\n`;
          }
        }
        else if (expectedType === 'number') {
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
          }
          else if (typeof value === 'string') {
            const numericValue = Number(value);
            if (!isNaN(numericValue) && value.trim() !== '') {
            iniString += `${key} = ${numericValue}\n`;
            } else {
              iniString += `${key} = '${value}'\n`;
            }
          }
          else {
            iniString += `${key} = ${value}\n`;
        }
      }
      iniString += `\n`;
    }
    setGeneratedIni(iniString.trim());
  };

  // useEffect(() => {
  //   if (!magnitude || isNaN(magnitude)) return;

  //   const photons = magnitudeToPhotons(Number(magnitude));

  //   if (systemKey === 'SCAO_LGS') {
  //     handleChange('sensor_LO', 'NumberPhotons', photons);
  //   } else {
  //     handleChange('sensor_HO', 'NumberPhotons', photons);
  //   }
  // }, [params.sources_HO?.Wavelength, params.sources_LO?.Wavelength, magnitude, systemKey]);

  ///////////////////////////////////////////////////
  //*********************DISPLAY********************/
  return (
    <div style={{ border: '1px solid #9dd6e8', padding: 16, margin: '20px 0', backgroundColor: '#eef9fd' }}>
      <h3> 💻 .ini Parameter File Generator - <Link to="/docs/orion/aoinstruments">For Available AO Instruments</Link> <br/> 🔵SCAO mode</h3>

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
          <strong>[atmosphere]</strong> </div>
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
            {Object.entries(wavelengthByBand)
            .filter(([band]) => availableBands.includes(band))
            .map(([band, lambda]) => (
            <option key={band} value={band}>
              {band} ({(lambda * 1e6).toFixed(2)} µm)
            </option>
             ))}
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
          Distance<sup>(1)</sup> (arcsec):
          <input
            type="number"
            value={
              typeof params.sources_science.Zenith === 'string'
                ? params.sources_science.Zenith.replace(/[\[\]]/g, '')
                : params.sources_science.Zenith
            }
            step="0.1"
            min="0"
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
              Distance<sup>(1)</sup> (arcsec):
              <input
                type="number"
                value={
                typeof params.sources_HO.Zenith === 'string'
                  ? params.sources_HO.Zenith.replace(/[\[\]]/g, '')
                  : params.sources_HO.Zenith
                }
                step="0.1"
                min="0"
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
                Distance<sup>(1)</sup> (arcsec):
                <input
                type="number"
                value={
                  typeof params.sources_LO.Zenith === 'string'
                  ? params.sources_LO.Zenith.replace(/[\[\]]/g, '')
                  : params.sources_LO.Zenith
                }
                step="0.01"
                min="0"
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
                V-Magnitude<sup>(2)</sup>:
                <input
                  type="number"
                  step="0.1"
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
        Iz: -2.15,
        J: -2.49,
        H: -3.03,
        Ks: -3.29,
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
                  {field}  <i>(nph/subaperture/frame)</i>:
                  <input
                  type="number"
                  value={
                  Number(
                    String(params.sensor_HO[field]).replace(/[\[\]]/g, '')
                  )
                  }
                    onChange={(e) => {
                      const value = e.target.value;
                      const wrappedValue = `[${value}]`;
                      handleChange('sensor_HO', field, wrappedValue);

                      const mag = photonsToMagnitude(value);
                      if (mag !== '') setMagnitude(mag);
                    }}
                    style={{ marginLeft: 10 }}
                    min="0"
                    step="1"
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
                V-Magnitude<sup>(2)</sup>:
                <input
                  type="number"
                  step="0.1"
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
        Iz: -2.15,
        J: -2.49,
        H: -3.03,
        Ks: -3.29,
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
                  {field} <i>(nph/subaperture/frame)</i>:
                  <input
                  type="number"
                  value={
                  Number(
                    String(params.sensor_LO[field]).replace(/[\[\]]/g, '')
                  )
                  }
                  onChange={(e) => {
                      const value = e.target.value;
                      const wrappedValue = `[${value}]`;
                      handleChange('sensor_LO', field, wrappedValue);
                  
                      const mag = photonsToMagnitude(value);
                      if (mag !== '') setMagnitude(mag);
                    }}
                    style={{ marginLeft: 10 }}
                    min="0"
                    step="1"
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

      <hr />
      <div style={{marginTop:'-0.5rem', fontSize: 'small' }}>
        <i>
        <sup>(1)</sup> Distance corresponds to the <code>Zenith</code> parameter in the 
        <code>[sources_science]</code> section, and either the <code>[sources_HO]</code> or 
        <code>[sources_LO]</code> section, depending on the system. 
        {" "}
        {!expanded ? (
          <>
          ⚠️ It should not be confused with the <code>ZenithAngle</code> parameter in 
          the <code>[telescope]</code> section, which...{" "}
          <span 
            onClick={() => setExpanded(true)} 
            style={{ color: "blue", cursor: "pointer", userSelect: "none" }}
            aria-label="Show more"
          >
            ▶ Show more
          </span>
        </>
        ) : (
        <>
          ⚠️ It should not be confused with the <code>ZenithAngle</code> parameter in 
          the <code>[telescope]</code> section, which refers to the angle between the 
          telescope’s pointing direction and the zenith. <br/>
          The <code>Zenith</code> (Distance<sup>(1)</sup>) value represents the distance (in arcseconds) between 
          the guide star (or science source) and the telescope’s pointing axis.<br />
          For instance, if both <code>Zenith</code> and <code>Azimuth</code> parameters, 
          in the <code>[sources_science]</code> section are set to [0.0], the science source is 
          located at the telescope’s pointing position.{" "}
          {/* The <code>Zenith</code> value represents the radial component (in arcseconds) 
            of the position of science sources or guide stars in polar coordinates, relative to the telescope’s pointing direction<br/> */}
          <span 
            onClick={() => setExpanded(false)} 
            style={{ color: "blue", cursor: "pointer", userSelect: "none" }}
            aria-label="Show less"
          >
            ▲ Show less
          </span>
          </>
          )}
        </i>
        </div>

        <div style={{marginTop:'0.5rem', fontSize: 'small' }}>
        <i>
        <sup>(2)</sup> The calculation of the <code>NumberPhotons</code> parameter, 
        along with a dedicated interface, is detailed&nbsp;
        <Link to="/docs/orion/interactivetools#mag-to-photons"><strong>here</strong></Link>.
        </i>
        </div>


      {generatedIni && (
      <div style={{ marginTop: '20px' }}>
        <hr />
        <h4>Generated .ini configuration file:</h4>
          <div
            style={{
              background: '#f0f0f0',
              padding: 10,
              maxHeight: '800px',
              maxWidth: '700px',
              overflowY: 'auto',
              overflowX: 'scroll',
              whiteSpace: 'pre-wrap',
              // wordBreak: 'break-word',
              fontFamily: 'monospace',
              borderRadius: '4px',
            }}
          >
          {generatedIni}
      </div>
      </div>
    )}

    </div>
  );
}
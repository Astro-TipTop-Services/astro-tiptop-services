import { useState, useEffect } from 'react';
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

export default function MagtoPhotons() {
  const [selectedOption, setSelectedOption] = useState('ERIS_SCAO_NGS');
  const [params, setParams] = useState({ ...configPresets['ERIS_SCAO_NGS'] });
  const [magnitude, setMagnitude] = useState('');

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
      if (mag == null || isNaN(mag)) return '[0]';

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

    if (magValue == null || isNaN(magValue)) {
      const section = systemKey === 'SCAO_LGS' ? 'sensor_LO' : 'sensor_HO';
      handleChange(section, 'NumberPhotons', '[0]');
      return;
    }

    const photons = magnitudeToPhotons(Number(magValue));

    if (systemKey === 'SCAO_LGS') {
      handleChange('sensor_LO', 'NumberPhotons', photons);
    } else {
      handleChange('sensor_HO', 'NumberPhotons', photons);
    }
  };

  useEffect(() => {
    if (!MagtoPhotons) return;

  }, [MagtoPhotons]);


  ///////////////////////////////////////////////////
  //*********************DISPLAY********************/
  return (
    <div style={{ border: '1px solid #9dd6e8', padding: 16, margin: '20px 0', backgroundColor: '#eef9fd' }}>
      <h3> Conversion from Magnitude to Number of Photons</h3>
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
          NGS only system ✴️ <br/>
          Number of lenslets: {' '}
          <span> 
            {Number(
                typeof params.sensor_HO.NumberLenslets === 'string'
                ? params.sensor_HO.NumberLenslets.replace(/[\[\]]/g, '')
                : params.sensor_HO.NumberLenslets
                )}
            </span> <br/> 
          Sensor frame rate: {' '}
          <span> 
            {Number(
                typeof params.RTC.SensorFrameRate_HO === 'string'
                ? params.RTC.SensorFrameRate_HO.replace(/[\[\]]/g, '')
                : params.RTC.SensorFrameRate_HO
                )} Hz
            </span> 
        </div>
      )}

       {systemKey === 'SCAO_LGS' && (
        <div style={{ marginTop: 16, marginBottom: 10, fontWeight: 'bold' }}>
          LGS ✳️ NGS ✴️<br/>
          Number of lenslets: {' '}
          <span> 
            {Number(
                typeof params.sensor_LO.NumberLenslets === 'string'
                ? params.sensor_LO.NumberLenslets.replace(/[\[\]]/g, '')
                : params.sensor_LO.NumberLenslets
                )}
            </span> <br/> 
          Sensor frame rate: {' '}
          <span> 
            {Number(
                typeof params.RTC.SensorFrameRate_LO === 'string'
                ? params.RTC.SensorFrameRate_LO.replace(/[\[\]]/g, '')
                : params.RTC.SensorFrameRate_LO
                )} Hz
            </span> 
        </div>
      )}

       <hr />

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
                    type="text"
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
                V-Magnitude:
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

    </div>
  );
}


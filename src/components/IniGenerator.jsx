import React, { useState } from 'react';

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
};

export default function IniGenerator() {
  const [selectedOption, setSelectedOption] = useState('ERIS_SCAO_NGS');
  const [params, setParams] = useState({ ...configPresets['ERIS_SCAO_NGS'] });
  const [generatedIni, setGeneratedIni] = useState('');

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
  };

  const generateIni = () => {
  const iniSections = { ...params };
  let iniString = '';

  for (const section in iniSections) {
    iniString += `[${section}]\n`;
    const fields = iniSections[section];

    for (const key in fields) {
      let value = fields[key];
      const expectedType = editableFields[section]?.[key];

      // Conversion basée sur le type attendu
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

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, margin: '20px 0' }}>
      <h3>Generate your config.ini</h3>

      <label>
        Select instrument:&nbsp;
        <select value={selectedOption} onChange={handleOptionChange} style={{ marginLeft: 10 }}>
          {Object.keys(configPresets).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

       <hr />


      {/* {Object.entries(params).map(([section, fields]) => (
        <div key={section}>
          <h4>[{section}]</h4>
          {Object.entries(fields).map(([field, value]) => {
            const isEditable = editableFields[section]?.includes(field);
            return (
              <div key={field} style={{ marginBottom: '0.5em' }}>
                <label>
                  {field}:
                  {isEditable ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(section, field, e.target.value)}
                      style={{ marginLeft: 10 }}
                    />
                  ) : (
                    <span style={{ marginLeft: 10 }}>{value}</span>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      ))} */}

      
  {Object.entries(editableFields).map(([section, fields]) => (
    <div key={section} style={{ marginBottom: '1em' }}>
      <strong>[{section}]</strong>
      {Object.entries(fields).map(([field, type]) => (
        <div key={`${section}-${field}`} style={{ marginTop: '0.5em' }}>
          <label>
            {field}:
            <input
              type={type === 'number' ? 'number' : 'text'}
              value={params[section][field]}
              onChange={(e) => handleChange(section, field, e.target.value)}
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
      ))}
    </div>
  ))}

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
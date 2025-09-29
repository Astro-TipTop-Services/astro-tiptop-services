import React, { useState, useEffect, useMemo, useCallback} from 'react';
import Link from '@docusaurus/Link';
import Presets from '../configPresets.json';
// import Plot from 'react-plotly.js';

const renameMap = {
  "MAVIS": "MAVIS_MCAO",
  "MORFEO": "MORFEO_MCAO",
};

const presetsToKeep = [
                      "MAVIS_MCAO",
                      "MORFEO_MCAO"];

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
  MAVIS_MCAO: ['B','V','R','I'],
  MORFEO_MCAO: ['I','J','H','K'],
};

export default function IniGenerator() {
  const [selectedOption, setSelectedOption] = useState('MAVIS_MCAO');
  const [params, setParams] = useState({ ...configPresets['MAVIS_MCAO'] });
  const [generatedIni, setGeneratedIni] = useState('');
  const [magnitude, setMagnitude] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [magnitudes, setMagnitudes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [Plot, setPlot] = useState(null);
  const [isScienceOpen, setIsScienceOpen] = useState(false);
  const [zenithWarnings, setZenithWarnings] = useState([]);

  useEffect(() => {
      setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      import('react-plotly.js').then((mod) => {
        setPlot(() => mod.default);
      });
    }
  }, [isClient]);

  const ScienceSourcesPlot = useCallback(
    ({Fov, Key_instrument, zenithArray, azimuthArray, 
  zenithLOArray, azimuthLOArray, numberPhotonsLO, 
  zenithHOArray, azimuthHOArray, numberPhotonsHO }) => {
    if (!Plot) return null;

  // Convert azimuth degrees to radians for polar plot
  const theta = azimuthArray.map((deg) => deg); // plotly polar supports degrees directly
  const photonToSize = (photons) => {
    if (photons <= 0) return 3; // min size if 0 or <0
    const logValue = Math.log10(photons);
    const minLog = 0;   // log10(10)
    const maxLog = 9;   // log10(1,000,000,000)
    const clampedLog = Math.min(Math.max(logValue, minLog), maxLog);
    const size = 3 + ((clampedLog - minLog) / (maxLog - minLog)) * (30 - 3);
    return size;
  };

  const sizeLO = numberPhotonsLO.map(photonToSize);
  const sizeHO = numberPhotonsHO.map(photonToSize);

  //Technical FoV
  const fovRadius = Fov / 2;
  const circlePointsCount = 100;
  const thetaCircle = Array.from({ length: circlePointsCount + 1 }, (_, i) => (360 / circlePointsCount) * i);
  const maxZenith = Math.max(...zenithArray, ...zenithLOArray, ...zenithHOArray);

  let imagerSize;
  let imager_name;
  let LGS_ast_radius;
  let Science_FoV_radius;
  let IFUfine_width;
  let IFUfine_height;
  let IFUcoarse_width;
  let IFUcoarse_height;
  let x0;
  let y0;
  let IFUname;
    if (Key_instrument === 'MAVIS_MCAO') {
      imagerSize = 30;
      imager_name = "Imager"
      LGS_ast_radius = 17.5;
      Science_FoV_radius = 42.4 / 2;
      IFUfine_width = 2.5;
      IFUfine_height = 3.6;
      IFUcoarse_width = 5.0;
      IFUcoarse_height = 7.2;
      x0 = -10;
      y0 = 0;
      IFUname = "IFU"
    } else {
      imagerSize = 50.5;
      imager_name = "Imager (MICADO)";
      LGS_ast_radius = 45;
      Science_FoV_radius = 76 / 2;
      IFUfine_width = 0.95;
      IFUfine_height = 1.28;
      IFUcoarse_width = 3.80;
      IFUcoarse_height = 5.10;
      x0 = 0;
      y0 = 0;
      IFUname = "IFU (HARMONI)"
    }

  const imagerRadius = (Math.sqrt(2) * imagerSize) / 2;
  // IFU
  // fine
  const IFUfine_rectPoints = [
    [x0 - IFUfine_width/2, y0 - IFUfine_height/2],
    [x0 - IFUfine_width/2, y0 + IFUfine_height/2],
    [x0 + IFUfine_width/2, y0 + IFUfine_height/2],
    [x0 + IFUfine_width/2, y0 - IFUfine_height/2],
    [x0 - IFUfine_width/2, y0 - IFUfine_height/2], 
  ];
  const IFUfine_rRect = IFUfine_rectPoints.map(([x, y]) => Math.sqrt(x*x + y*y));
  const IFUfine_thetaRect = IFUfine_rectPoints.map(([x, y]) => {
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  });
  // coarse
  const IFUcoarse_rectPoints = [
    [x0 - IFUcoarse_width/2, y0 - IFUcoarse_height/2],
    [x0 - IFUcoarse_width/2, y0 + IFUcoarse_height/2],
    [x0 + IFUcoarse_width/2, y0 + IFUcoarse_height/2],
    [x0 + IFUcoarse_width/2, y0 - IFUcoarse_height/2],
    [x0 - IFUcoarse_width/2, y0 - IFUcoarse_height/2], 
  ];
  const IFUcoarse_rRect = IFUcoarse_rectPoints.map(([x, y]) => Math.sqrt(x*x + y*y));
  const IFUcoarse_thetaRect = IFUcoarse_rectPoints.map(([x, y]) => {
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  });

  return (
    //*********PLOT************/
    <Plot
      data={[
        {
          type: 'scatterpolar',
          r: zenithLOArray,
          theta: azimuthLOArray,
          mode: 'markers',
          marker: { color: 'orange', size: sizeLO, symbol: 'star' },
          name: 'LO Sources - NGS ✴️',
        },
        {
          type: 'scatterpolar',
          r: zenithArray,
          theta: theta,
          mode: 'markers',
          marker: { color: 'blue', size: 10, symbol: 'star' },
          name: 'Science Sources 💫',
        },
         {
          type: 'scatterpolar',
          r: zenithHOArray,
          theta: azimuthHOArray,
          mode: 'markers',
          marker: { color: 'green', size: sizeHO, symbol: 'star' },
          name: 'HO Sources - LGS ✳️',
        },
        // {
        //   type: 'scatterpolar',
        //   r: Array(circlePointsCount + 1).fill(fovRadius),
        //   theta: thetaCircle,
        //   mode: 'lines',
        //   line: {
        //     color: 'orange',
        //     dash: 'line',
        //     width: 1.5,
        //   },
        //   name: `NGS Field of view ${Fov}″Ø`,
        //   showlegend: true,
        // },
        // {
        //   type: 'scatterpolar',
        //   r: Array(circlePointsCount + 1).fill(Science_FoV_radius),
        //   theta: thetaCircle,
        //   mode: 'lines',
        //   line: {
        //     color: 'blue',
        //     dash: 'line',
        //     width: 1.1,
        //   },
        //   // fill: 'toself',
        //   // fillcolor: 'rgba(16, 102, 182, 0.15)',
        //   name: `Scientific Field of View ${Science_FoV_radius*2}"Ø`,
        //   showlegend: true,
        // },
        {
          type: 'scatterpolar',
          r: Array(circlePointsCount + 1).fill(LGS_ast_radius),
          theta: thetaCircle,
          mode: 'lines',
          line: {
            color: 'green',
            dash: 'line',
            width: 1.1,
          },
          // fill: 'toself',
          // fillcolor: 'rgba(16, 182, 44, 0.14)',
          name: `LGS asterism ${LGS_ast_radius*2}"Ø`,
          showlegend: true,
        },
        {
          type: 'scatterpolar',
          r: [imagerRadius, imagerRadius, imagerRadius, imagerRadius, imagerRadius],
          theta: [225, 135, 45, 315, 225], 
          mode: 'lines',
          line: {
            color: 'black',
            dash: 'dot',
            width: 1.5,
          },
          fill: 'toself',
          fillcolor: 'rgba(16, 102, 182, 0.15)',
          name: `${imager_name}<br>${imagerSize}″×${imagerSize}″`,
          showlegend: true,
        },
        {
          type: 'scatterpolar',
          r: IFUcoarse_rRect,
          theta: IFUcoarse_thetaRect,
          mode: 'lines',
          line: {
            color: 'purple',
            dash: 'dot',
            width: 1.5,
          },
          fill: 'toself',
          fillcolor: 'rgba(182, 16, 154, 0.14)',
          name: `${IFUname} Coarse <br>${IFUcoarse_width}″×${IFUcoarse_height}″`,
          showlegend: true,
        },
        {
          type: 'scatterpolar',
          r: IFUfine_rRect,
          theta: IFUfine_thetaRect,
          mode: 'lines',
          line: {
            color: 'red',
            dash: 'dot',
            width: 1.5,
          },
          fill: 'toself',
          fillcolor: 'rgba(235, 19, 19, 0.14)',
          name: `${IFUname} Fine <br> ${IFUfine_width}″×${IFUfine_height}″`,
          showlegend: true,
        },
      ]}
      layout={{
        polar: {
          radialaxis: {
            visible: true,
            range: [0, Math.max(...zenithArray, ...zenithLOArray, ...zenithHOArray) * 1.05 || 10],
            // range: Math.max(fovRadius * 1.05, maxZenith * 1.2 || 10),
          },
          angularaxis: { rotation: 0, direction: 'counterclockwise' },
          bgcolor: '#f0f0f0',
        },
        legend: {
          font: {
            size:16,
          },
          x: 1.2,
          y: 0.9,
          xanchor: 'left',
          yanchor: 'top',
        },
        // annotations: [
        //   {
        //     x: 0.06,
        //     y: 0.83,
        //     text: `Technical Field<br>of view ${Fov}''Ø`,
        //     showarrow: false,
        //     xref: 'paper',
        //     yref: 'paper',
        //     font: { size: 11 },
        //     textangle: -68,
        //   },
        // ],
        paper_bgcolor: '#eef9fd',
        margin: { t: 20, b: 20, l: 40, r: 20 },
        height: 400,
      }}
      config={{ displayModeBar: false }}
        />
      );
    },
    [Plot]
  );

  const filename = `${selectedOption || selectedOption}.ini`;

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
    setMagnitude('');
  };

  // Aire collectrice de la pupille circulaire avec obstruction centrale
  const collectingArea = (D, OR) => {
    if (!D || D <= 0) return 0;
    const eps2 = (OR ?? 0) * (OR ?? 0);
    return (Math.PI / 4) * (D * D) * (1 - eps2);
  };

  // Nombre effectif de sous-pupilles éclairées
  const effectiveSubapertures = (N, OR) => {
    if (!N || N <= 0) return 0;
    if (N <= 2) return N * N;
    const eps2 = (OR ?? 0) * (OR ?? 0);
    const diskFactor = Math.PI / 4 * (1 - eps2);
    return Math.max(1, Math.floor(N * N * diskFactor));
  };

  const magnitudeToPhotons = (mag) => {
    try {
      if (mag == null || isNaN(mag)) return 0;

      // LO (MCAO) : NGS utilisés par la boucle basse fréquence
      const sensorKey = 'sensor_LO';
      const wavelengthKey = 'sources_LO';
      const rtcFrameRateKey = 'SensorFrameRate_LO';

      const D = Number(params.telescope.TelescopeDiameter);
      const OR = Number(params.telescope.ObscurationRatio);

      // Nombre de lenslets (on prend la 1re valeur si tableau)
      let N_lenslet_raw = params[sensorKey]?.NumberLenslets;
      let N_lenslet = 20;
      if (typeof N_lenslet_raw === 'string' && N_lenslet_raw.trim() !== '') {
        const parsed = N_lenslet_raw.replace(/[\[\]]/g, '').split(',')[0];
        const num = Number(parsed);
        if (!isNaN(num) && num > 0) N_lenslet = num;
      } else if (typeof N_lenslet_raw === 'number' && N_lenslet_raw > 0) {
        N_lenslet = N_lenslet_raw;
      } else if (Array.isArray(N_lenslet_raw) && N_lenslet_raw.length > 0) {
        const num = Number(N_lenslet_raw[0]);
        if (!isNaN(num) && num > 0) N_lenslet = num;
      }

      const sensorFrameRate = Number(params.RTC?.[rtcFrameRateKey]) || 1000;

      let lambda_raw = params[wavelengthKey]?.Wavelength;
      let lambda = 0;
      if (typeof lambda_raw === 'string') {
        lambda = Number(lambda_raw.replace(/[\[\]]/g, ''));
      } else {
        lambda = Number(lambda_raw);
      }

      if (!D || !N_lenslet || !sensorFrameRate || !lambda) return 0;

      const F0 = getF0FromWavelength(lambda);
      const Tot_throughput = getTotThroughput(lambda);
      if (!F0 || !Tot_throughput) return 0;

      // Correction (M0V)
      const band = getBandFromWavelength(lambda);
      const bandCorrection = { B: 1.37, V: 0, R: -1.26, I: -2.15, Iz: -2.15, J: -2.49, H: -3.03, Ks: -3.29, K: -3.29 };
      const magCorr = Math.round((Number(mag) + (bandCorrection[band] ?? 0)) * 100) / 100;

      // F0 * (T / fps) * (A_pupil / N_sa_tot) * 10^{-0.4 Mag_corr}
      const A = collectingArea(D, OR);
      const Nsa = effectiveSubapertures(N_lenslet, OR);
      if (!A || !Nsa) return 0;

      const photons = F0 * (Tot_throughput / sensorFrameRate) * (A / Nsa) * Math.pow(10, -0.4 * magCorr);
      return Number(photons.toFixed(2));
    } catch {
      return 0;
    }
  };

  const photonsToMagnitude = (photonsVal) => {
    try {
      const sensorKey = 'sensor_LO';
      const wavelengthKey = 'sources_LO';
      const rtcFrameRateKey = 'SensorFrameRate_LO';

      const D = Number(params.telescope.TelescopeDiameter);
      const OR = Number(params.telescope.ObscurationRatio);
      const sensorFrameRate = Number(params.RTC?.[rtcFrameRateKey]) || 1000;

      let lambda_raw = params[wavelengthKey]?.Wavelength;
      let lambda = typeof lambda_raw === 'string'
        ? Number(lambda_raw.replace(/[\[\]]/g, ''))
        : Number(lambda_raw);

      let N_lenslet_raw = params[sensorKey]?.NumberLenslets;
      let N_lenslet = 20;
      if (typeof N_lenslet_raw === 'string' && N_lenslet_raw.trim() !== '') {
        const parsed = N_lenslet_raw.replace(/[\[\]]/g, '').split(',')[0];
        const num = Number(parsed);
        if (!isNaN(num) && num > 0) N_lenslet = num;
      } else if (typeof N_lenslet_raw === 'number' && N_lenslet_raw > 0) {
        N_lenslet = N_lenslet_raw;
      } else if (Array.isArray(N_lenslet_raw) && N_lenslet_raw.length > 0) {
        const num = Number(N_lenslet_raw[0]);
        if (!isNaN(num) && num > 0) N_lenslet = num;
      }

      const F0 = getF0FromWavelength(lambda);
      const Tot_throughput = getTotThroughput(lambda);
      const band = getBandFromWavelength(lambda);
      const bandCorrection = { B: 1.37, V: 0, R: -1.26, I: -2.15, Iz: -2.15, J: -2.49, H: -3.03, Ks: -3.29, K: -3.29 };

      if (!F0 || !Tot_throughput || !D || !N_lenslet || !sensorFrameRate || !lambda) return '';

      const photons = Number(photonsVal);
      if (isNaN(photons) || photons <= 0) return '';

      const A = collectingArea(D, OR);
      const Nsa = effectiveSubapertures(N_lenslet, OR);
      if (!A || !Nsa) return '';

      // Inversion de la formule : Mag_corr = -2.5 log10( photons / [F0*(T/fps)*(A/Nsa)] )
      const preFactor = F0 * (Tot_throughput / sensorFrameRate) * (A / Nsa);
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
      const section = 'sensor_LO' ;
      handleChange(section, 'NumberPhotons', '[0]');
      return;
    }

    const photons = magnitudeToPhotons(Number(magValue));

    handleChange('sensor_LO', 'NumberPhotons', photons);

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

  useEffect(() => {
  if (!params.sensor_LO?.NumberPhotons) {
    setMagnitudes([]);  
    return;}
  try {
    const photonsArray = JSON.parse(params.sensor_LO.NumberPhotons);
    const updatedMagnitudes = photonsArray.map((ph) => {
      const val = Number(ph);
      return !isNaN(val) ? photonsToMagnitude(val) : '';
    });
    setMagnitudes(updatedMagnitudes);
  } catch (e) {
    setMagnitudes([]);
  }
}, [params.sensor_LO?.NumberPhotons]);


  ///////////////////////////////////////////////////
  //******************generateIni********************
  const generateIni = () => {
  const iniSections = { ...params };
  let iniString = '';

  for (const section in iniSections) {
   
    iniString += `[${section}]\n`;

      if (section === 'sources_HO' || section === 'sources_LO') {
        let lambda_raw = iniSections[section]?.Wavelength;
        let lambda = 0;
        if (typeof lambda_raw === 'string') {
          lambda = Number(lambda_raw.replace(/[\[\]]/g, ''));
        } else {
          lambda = Number(lambda_raw);
        }
      }

      const fields = iniSections[section];
      for (const key in fields) {
        let value = fields[key];
        const expectedType = editableFields[section]?.[key];

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

  // const zenithScienceArray = params.sources_science?.Zenith
  // ? JSON.parse(params.sources_science.Zenith)
  // : [];

  // const azimuthScienceArray = params.sources_science?.Azimuth
  // ? JSON.parse(params.sources_science.Azimuth)
  // : [];
  

  ///////////////////////////////////////////////////
  //*********************DISPLAY********************/
  return (
    <div style={{ border: '1px solid #9dd6e8', padding: 16, margin: '20px 0', 
    backgroundColor: '#eef9fd' }}>
      {/* <div style={{ 
        padding: '10px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeeba', 
        borderRadius: '5px', 
        color: '#856404', 
        marginBottom: '1rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🚧</span> MCAO Parameter File Generator - Work in progress
      </div> */}
      <h3> 💻 .ini Parameter File Generator - <Link to="/docs/orion/aoinstruments">For Available AO Instruments</Link> <br/> 🟣 MCAO mode</h3>

      <label>
        Select instrument:&nbsp;
        <select value={selectedOption} onChange={handleOptionChange} style={{ marginLeft: 10 }}>
          {Object.keys(configPresets).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 16, marginBottom: 10, fontWeight: 'bold' }}>
          HO part: Science 💫 - LGS ✳️ <br/> LO part: NGS ✴️
      </div>

       <hr />

      {/* Always show ZenithAngle */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>[telescope] 🔭</strong> </div>
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
          <strong>[atmosphere] 🌫️</strong> </div>
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

      {/* SCIENCE */}
      {params.sources_science && (
        <div style={{ marginBottom: '1rem', 
                      backgroundColor: 'rgba(16, 102, 182, 0.15)', 
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
        }}>
        {/* En-tête repliable */}
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>[sources_science] 💫</strong>
        </div>

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
          <label >
            Number of science sources:&nbsp;
            <input
              type="number"
              min={1}
              max={30}
              value={params.sources_science?.Zenith ? JSON.parse(params.sources_science.Zenith).length : 0}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                if (!isNaN(count) && count > 0) {
                  const currentZenith = params.sources_science?.Zenith ? JSON.parse(params.sources_science.Zenith) : [];
                  const currentAzimuth = params.sources_science?.Azimuth ? JSON.parse(params.sources_science.Azimuth) : [];
                  const newZenith = Array.from({ length: count }, (_, i) => currentZenith[i] ?? 0);
                  const newAzimuth = Array.from({ length: count }, (_, i) => currentAzimuth[i] ?? 0);
                  setParams(prev => ({
                    ...prev,
                    sources_science: {
                      ...prev.sources_science,
                      Zenith: JSON.stringify(newZenith),
                      Azimuth: JSON.stringify(newAzimuth),
                    },
                  }));
                }
              }}
            />
          </label>
          <div style={{ marginTop: '0.5em' }}>
          <button
            onClick={() => setIsScienceOpen(prev => !prev)}
            style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.95em',
              padding: 0,
            }}
          >
            {isScienceOpen ? '▼ Hide details' : '▶ Show details'}
          </button>
          </div>
        </div>

        {isScienceOpen && (
          <>
        {(params.sources_science?.Zenith ? JSON.parse(params.sources_science.Zenith) : []).map((val, index) => {
          const azVal = params.sources_science?.Azimuth ? JSON.parse(params.sources_science.Azimuth)[index] ?? 0 : 0;
          return (
            <div key={index} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: '1em', marginTop: '0.5rem' }}>
            {/* Colonne Source #n */}
            <div style={{ minWidth: '80px', textAlign: 'right', paddingRight: '0.5em', userSelect: 'none', marginRight:'2rem', marginTop: '1.8rem'}}>
              Source #{index + 1}
            </div>
            {/* Colonne Inputs */}
            <div style={{ display: 'flex', gap: '1em' }}>
            {/* Distance */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'2rem' }}>
              <label htmlFor={`zenith-input-${index}`} style={{ flexShrink: 0 }}>
                 Distance<sup>(1)</sup> <i>(arcsec)</i>:
              </label>
              <input
                id={`zenith-input-${index}`}
                type="number"
                step="0.1"
                min="0"
                value={val}
                onChange={(e) => {
                  const currentZenith = params.sources_science?.Zenith ? JSON.parse(params.sources_science.Zenith) : [];
                  const newZenith = [...currentZenith];
                  newZenith[index] = parseFloat(e.target.value);
                  setParams(prev => ({
                    ...prev,
                    sources_science: {
                      ...prev.sources_science,
                      Zenith: JSON.stringify(newZenith),
                      Azimuth: prev.sources_science?.Azimuth || '[]',
                    },
                  }));
                }}
                style={{ width: '5em' }}
              />
            </div>

                {/* Angle  */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'2rem' }}>
              <label htmlFor={`azimuth-input-${index}`} style={{ flexShrink: 0, marginLeft: '1em' }}>
                Angle<sup>(2)</sup> <i>(degree)</i>:
              </label>
                <input
                id={`azimuth-input-${index}`}
                type="number"
                step="0.1"
                value={azVal}
                onChange={(e) => {
                  const currentAzimuth = params.sources_science?.Azimuth ? JSON.parse(params.sources_science.Azimuth) : [];
                  const newAzimuth = [...currentAzimuth];
                  newAzimuth[index] = parseFloat(e.target.value);
                  setParams(prev => ({
                    ...prev,
                    sources_science: {
                      ...prev.sources_science,
                      Azimuth: JSON.stringify(newAzimuth),
                      Zenith: prev.sources_science?.Zenith || '[]',
                    },
                  }));
                }}
                style={{ width: '5em' }}
              />
            </div>
           </div>
          </div>
          );
        })}
      </>
      )}
      </div>
      )}
      

        {/* LO PART */}
        {params.sources_LO && params.sensor_LO && (
        <div style={{ marginBottom: '1em' }}>
          <strong>[sources_LO] & [sensor_LO] - NGS(s) ✴️ </strong>
            <div style={{marginTop: '0.5em'}}>
              NGS(s) Wavelength set at {' '}
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
                Number of NGS:&nbsp;
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={params.sources_LO?.Zenith ? JSON.parse(params.sources_LO.Zenith).length : 0}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10);
                    if (!isNaN(count) && count > 0) {
                      const currentZenith = params.sources_LO?.Zenith ? JSON.parse(params.sources_LO.Zenith) : [];
                      const currentAzimuth = params.sources_LO?.Azimuth ? JSON.parse(params.sources_LO.Azimuth) : [];
                      const currentPhotons = params.sensor_LO?.NumberPhotons ? JSON.parse(params.sensor_LO.NumberPhotons) : [];
                      
                      const currentLenslets = params.sensor_LO?.NumberLenslets ? JSON.parse(params.sensor_LO.NumberLenslets) : [];
                      const defaultLensletValue = currentLenslets.length > 0 ? currentLenslets[0] : 1;
                      const currentSpotFWHM = params.sensor_LO?.SpotFWHM ? JSON.parse(params.sensor_LO.SpotFWHM) : [[0.0,0.0,0.0]];
                      const innerListSpotFWHM = currentSpotFWHM.length > 0 ? currentSpotFWHM[0] : [0.0,0.0,0.0];
                      const defaultSpotFWHM = innerListSpotFWHM.length > 0 ? innerListSpotFWHM[0] : 0.0;
                      const newInnerList = Array.from({ length: count }, () => defaultSpotFWHM);
                      
                      const newZenith = Array.from({ length: count }, (_, i) => currentZenith[i] ?? 0);
                      const newAzimuth = Array.from({ length: count }, (_, i) => currentAzimuth[i] ?? 0);
                      const newPhotons = Array.from({ length: count }, (_, i) => currentPhotons[i] ?? 0);
                      const newLenslets = Array.from({ length: count }, (_, i) => currentLenslets[i] ?? defaultLensletValue);
                      const newSpotFWHM = [newInnerList];

                      setParams(prev => ({
                        ...prev,
                        sources_LO: {
                          ...prev.sources_LO,
                          Zenith: JSON.stringify(newZenith),
                          Azimuth: JSON.stringify(newAzimuth),
                        },            
                        sensor_LO: {
                          ...prev.sensor_LO,
                          NumberPhotons: JSON.stringify(newPhotons),
                          NumberLenslets: JSON.stringify(newLenslets),
                          SpotFWHM: JSON.stringify(newSpotFWHM),
                        },
                      }));

                      setMagnitudes(prev => {
                        const newMags = Array.from({ length: count }, (_, i) => prev[i] ?? '');
                        return newMags;
                      });
                    }
                  }}
                />
              </label>
            </div>

            {(params.sources_LO?.Zenith ? JSON.parse(params.sources_LO.Zenith) : []).map((val, index) => {
              const azVal = params.sources_LO?.Azimuth ? JSON.parse(params.sources_LO.Azimuth)[index] ?? 0 : 0;
              const phoVal = params.sensor_LO?.NumberPhotons ? JSON.parse(params.sensor_LO.NumberPhotons)[index] ?? 0 : 0;
              const magVal = magnitudes[index] ?? '';

              return (
                <div key={index} style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: '1em', alignItems: 'center', marginTop: '0.5em' }}>
                {/* Colonne Source #n */}
                <div style={{ minWidth: '80px', textAlign: 'right', paddingRight: '0.5em', userSelect: 'none', marginRight:'2rem', marginTop: '-0.5rem' }}>
                  NGS #{index + 1}
                </div>

                {/* Colonne Inputs */}
                <div style={{ display: 'flex', gap: '1em' }}>
                  {/* Distance */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'2rem' }}>
                    <label htmlFor={`zenith-input-${index}`}>
                      Distance<sup>(1)</sup>:
                    </label>
                  <input
                    id={`zenith-input-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={val}
                    onChange={(e) => {
                      const currentZenith = params.sources_LO?.Zenith ? JSON.parse(params.sources_LO.Zenith) : [];
                      const newZenith = [...currentZenith];
                      newZenith[index] = parseFloat(e.target.value);
                      setParams(prev => ({
                        ...prev,
                        sources_LO: {
                          ...prev.sources_LO,
                          Zenith: JSON.stringify(newZenith),
                          Azimuth: prev.sources_LO?.Azimuth || '[]',
                        },
                      }));
                    }}
                    style={{ width: '5em' }}
                  />
                  <label style={{ fontSize: "12px" }}><i>(arcsec)</i></label>
                </div>

                {/* Angle  */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'2rem' }}>
                  <label htmlFor={`azimuth-input-${index}`}>
                    Angle<sup>(2)</sup>:
                  </label>
                  <input
                    id={`azimuth-input-${index}`}
                    type="number"
                    step="0.1"
                    value={azVal}
                    onChange={(e) => {
                      const currentAzimuth = params.sources_LO?.Azimuth ? JSON.parse(params.sources_LO.Azimuth) : [];
                      const newAzimuth = [...currentAzimuth];
                      newAzimuth[index] = parseFloat(e.target.value);
                      setParams(prev => ({
                        ...prev,
                        sources_LO: {
                          ...prev.sources_LO,
                          Azimuth: JSON.stringify(newAzimuth),
                          Zenith: prev.sources_LO?.Zenith || '[]',
                        },
                      }));
                    }}
                    style={{ width: '5em' }}
                  />
                  <label style={{ fontSize: "12px" }}><i>(degree)</i></label>
                  </div>
  

                  {/* Magnitude */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'1.8rem' }}>
                    <label htmlFor={`photons-input-${index}`}>
                     V-Magnitude<sup>(3)</sup>:
                    </label>

                    <input
                      id={`mag-input-${index}`}
                      type="number"
                      step="0.1"
                      max="21.55"
                      value={magVal}
                      onChange={(e) => {
                        const newMag = e.target.value;
                        setMagnitudes((prev) => {
                          const newMags = [...prev];
                          newMags[index] = newMag;
                          return newMags;
                        });

                        const parsedMag = parseFloat(newMag);
                        let newPhotonValue = 0;
                        if (!isNaN(parsedMag)) {
                          newPhotonValue = magnitudeToPhotons(parsedMag);
                        }

                        setParams((prev) => {
                          const currentPhotons = prev.sensor_LO?.NumberPhotons ? JSON.parse(prev.sensor_LO.NumberPhotons) : [];
                          const newPhotons = [...currentPhotons];
                          newPhotons[index] = newPhotonValue;

                          return {
                            ...prev,
                            sensor_LO: {
                              ...prev.sensor_LO,
                              NumberPhotons: JSON.stringify(newPhotons),
                            },
                          };
                        });
                      }}
                      style={{ width: '5em' }}
                    />

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
                      const magNum = Number(magVal);
                      if (!isNaN(magNum) && magVal.trim() !== '' && band in bandCorrection) {
                        const magCorr = (magNum + bandCorrection[band]).toFixed(2);
                        return <span style={{fontSize: "12px", alignItems: 'center'}}>{band}-Magnitude: {magCorr} 
                        <br/>(spectral class: M0V)</span>;
                      }
                      // return <span style={{ marginLeft: 10, visibility: 'hidden' }}>{band ? `${band}-Magnitude: 0.00 (spectral class: M0V)` : ''}</span>;
                      return null
                    })()}

                  </div>

                  {/* NumberPhotons */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'2rem'}}>
                    <label htmlFor={`photons-input-${index}`}>
                      NumberPhotons:
                    </label>
                    <input
                      id={`photons-input-${index}`}
                      type="text"
                      step="1"
                      min="0"
                      value={phoVal}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val)) return;

                      setParams((prev) => {
                        const currentPhotons = prev.sensor_LO?.NumberPhotons
                          ? JSON.parse(prev.sensor_LO.NumberPhotons)
                          : [];
                        const newPhotons = [...currentPhotons];
                        newPhotons[index] = val;

                        return {
                          ...prev,
                          sensor_LO: {
                            ...prev.sensor_LO,
                            NumberPhotons: JSON.stringify(newPhotons),
                          },
                        };
                      });
                    }}
                    style={{ width: '5rem' }}
  
                    />
                    <label style={{ fontSize: "12px" }}> <i>(nph/subap/frame)</i></label>
                  </div>

                  </div>
                </div>
                );
              })}

              {selectedOption === 'MORFEO_MCAO' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1.5em', fontSize: '0.9em' }}>
                  {/* <h4>NGS Field Check:</h4> */}
                  <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 400 }}>
                    <thead style={{ fontWeight: 'normal' }}>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: '6px' }}></th>
                        <th style={{ border: '1px solid #ccc', padding: '6px' }}>NGS Field MICADO</th>
                        <th style={{ border: '1px solid #ccc', padding: '6px' }}>NGS Field HARMONI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(params.sources_LO?.Zenith ? JSON.parse(params.sources_LO.Zenith) : []).map((val, index) => {
                        const micadoOk = val >= 40 && val <= 80;
                        const harmoniOk = val >= 10 && val <= 60;

                        return (
                          <tr key={index}>
                            <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold' }}>NGS #{index + 1}</td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>
                              {micadoOk ? '✅' : '❌'}
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '6px', textAlign: 'center' }}>
                              {harmoniOk ? '✅' : '❌'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ fontSize: '0.9em' }}>
                  <p>
                    <span style={{ backgroundColor: '#e6ffe6', padding: '0 0.5em' }}>✅ Within range</span> &nbsp;<br />
                    <span style={{ backgroundColor: '#ffe6e6', padding: '0 0.5em' }}>❌ Out of range</span>
                  </p>
                  <p>
                    <b>MICADO:</b> 40″ ≤ NGS ≤ 80″<br />
                    <b>HARMONI:</b> 10″ ≤ NGS ≤ 60″
                  </p>
                </div>
                </div>
              )}
<hr />
<div>
  <ScienceSourcesPlot
      Fov={params.telescope.TechnicalFoV}
      Key_instrument={selectedOption}
      zenithArray={JSON.parse(params.sources_science.Zenith || '[]')}
      azimuthArray={JSON.parse(params.sources_science.Azimuth || '[]')}
      zenithLOArray={JSON.parse(params.sources_LO.Zenith || '[]')}
      azimuthLOArray={JSON.parse(params.sources_LO.Azimuth || '[]')}
      numberPhotonsLO={JSON.parse(params.sensor_LO.NumberPhotons || '[]')}
      zenithHOArray={JSON.parse(params.sources_HO.Zenith || '[]')}
      azimuthHOArray={JSON.parse(params.sources_HO.Azimuth || '[]')}
      numberPhotonsHO={JSON.parse(params.sensor_HO.NumberPhotons || '[]')}
    />
</div>

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
      
      <hr />
      <div style={{marginTop:'-0.5rem', fontSize: 'small' }}>
        <i>
        The Distance<sup>(1)</sup> and Angle<sup>(2)</sup> fields specify the position of a source 
        (guide star or science target) in polar coordinates relative to the telescope’s pointing axis.<br/>
        <sup>(1)</sup> Distance corresponds to the <code>Zenith</code> parameter in the 
        <code>[sources_science]</code> section, and either the <code>[sources_HO]</code> or 
        <code>[sources_LO]</code> section, depending on the system. 
        {" "}
        {!expanded ? (
          <>
          ⚠️ Do not confuse this with the <code>ZenithAngle</code> parameter in 
        <code> [telescope]</code> section, which...{" "}
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
          ⚠️ Do not confuse this with the <code>ZenithAngle</code> parameter in 
        <code> [telescope]</code> section, which refers to the angle between the 
          telescope’s pointing direction and the zenith. <br/>
          {/* The <code>Zenith</code> (Distance<sup>(1)</sup>) value represents the distance (in arcseconds) between 
          the guide star (or science source) and the telescope’s pointing axis.<br /> */}
          <sup>(2)</sup> Angle corresponds to the <code>Azimuth</code> parameter in the 
          <code>[sources_science]</code> section, and either the <code>[sources_HO]</code> or 
          <code>[sources_LO]</code> section, depending on the system. <br/>
          {/* For instance, if both <code>Zenith</code> and <code>Azimuth</code> parameters, 
          in the <code>[sources_science]</code> section are set to [0.0], the science target is 
          located at the telescope’s pointing position.{" "} */}
          
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

        {/* <div style={{marginTop:'0.5rem', fontSize: 'small' }}>
        <i>
        <sup>(2)</sup> Angle corresponds to the <code>Azimuth</code> parameter in the 
        <code>[sources_science]</code> section, and either the <code>[sources_HO]</code> or 
        <code>[sources_LO]</code> section, depending on the system. <br/>
        It represents the angular coordinate (in degrees) in the polar coordinate system.
        </i>
        </div> */}
        <div style={{marginTop:'0.5rem', fontSize: 'small' }}>
        <i>
        <sup>(3)</sup> The calculation of the <code>NumberPhotons</code> parameter, 
        along with a dedicated interface, is detailed&nbsp;
        <Link to="/docs/orion/interactivetools#mag-to-photons"><strong>here</strong></Link>.
        </i>
        </div>

    </div>
  );
}
import React, { useState } from 'react';
import IniGenerator from '@site/src/components/IniGenerator';
import IniGenerator_MCAO from '@site/src/components/IniGenerator_MCAO';

export default function InteractiveToolsSelector() {
  const [activeComponent, setActiveComponent] = useState(null);

  const buttonStyle = {
    padding: '0.7rem 1.2rem',
    minHeight: '4rem',
    minWidth: '18rem',
    maxWidth: '24rem',
    flex: '1 1 20rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    whiteSpace: 'normal',
    textAlign: 'center',
    lineHeight: '1.25',
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '1.5rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          style={{
            ...buttonStyle,
            backgroundColor: '#4987d6',
          }}
          onClick={() => setActiveComponent('scao')}
        >
          SCAO Parameter File Generator
        </button>

        <button
          style={{
            ...buttonStyle,
            backgroundColor: '#8a6ec5',
          }}
          onClick={() => setActiveComponent('mcao')}
        >
          MCAO Parameter File Generator
        </button>
      </div>

      {activeComponent && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px',
            width: '100%',
          }}
        >
          {activeComponent === 'scao' && <IniGenerator />}
          {activeComponent === 'mcao' && <IniGenerator_MCAO />}
        </div>
      )}
    </>
  );
}
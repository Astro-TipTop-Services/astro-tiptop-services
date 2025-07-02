import React, { useState } from 'react';
import IniGenerator from '@site/src/components/IniGenerator';
import IniGenerator_MCAO from '@site/src/components/IniGenerator_MCAO';

export default function InteractiveToolsSelector() {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          style={{
            padding: '1rem 2rem',
            height: '4.9rem',
            backgroundColor: '#4987d6',
            color: '#fff',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setActiveComponent('scao')}
        >
          Open .ini SCAO Parameter File Generator
        </button>

        <button
          style={{
            padding: '1rem 2rem',
            height: '4.9rem',
            backgroundColor: '#8a6ec5',
            color: '#fff',
            borderRadius: '0.5rem',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={() => setActiveComponent('mcao')}
        >
          Open .ini MCAO Parameter File Generator
        </button>
      </div>

     {activeComponent && (
  <div style={{ display: 'flex', justifyContent: 'center', minHeight: '300px', alignItems: 'center' }}>
    {activeComponent === 'scao' && <IniGenerator />}
    {activeComponent === 'mcao' && (
      <div style={{ fontSize: '1.5rem', color: '#888' }}>
        🚧 MCAO Parameter File Generator — Coming Soon!
      </div>
    )}
  </div>
    )}
    </>
  );
}

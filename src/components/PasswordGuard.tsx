import React, {useState} from 'react';

const PASSWORD = 'TiptOptimo'; 

export default function PasswordGuard({children}) {
  const [input, setInput] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setOk(true);
    } else {
      alert('⛔ Incorrect password');
    }
  };

  if (ok) {
    return <>{children}</>;
  }

  return (
    <div style={{maxWidth: 400, margin: '2rem auto', textAlign: 'center'}}>
      <h3>🚧 This section is under construction.</h3>
      <p>Please enter the password to access it.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{padding: '0.4rem', width: '100%', marginBottom: '0.5rem'}}
        />
        <button type="submit" style={{padding: '0.4rem 1rem'}}>
          Unlock
        </button>
      </form>
    </div>
  );
}

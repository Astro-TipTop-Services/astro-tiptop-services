import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Contact_us() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
      };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Message sent!");
        console.log(formData);
      };

      return (
        <Layout title="Contact" description="Get in touch with the Astro-TipTop team.">
          <div className="container margin-vert--lg">
            <div className="row">
              {/* Sidebar */}
              <div className="col col--3">
                <nav style={{ position: 'sticky', top: '4rem' }}>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li>
                      <Link to="/resources/about_us">ℹ️ About us</Link>
                    </li>
                    <li style={{ marginBottom: '1rem' }}>
                      <Link to="/resources/contact">📬 Contact Support </Link>
                    </li>
                  </ul>
                </nav>
              </div>
    
              {/* Main Content */}
              <div className="col col--7">
                <h1 style={{ textAlign: 'center', marginTop: '0.rem' }}>Contact Support</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                Need help with Astro-TipTop? Our support team is ready to assist you. Whether you're facing installation issues, 
                running simulations, or have any general questions about the software, we are here to help.
                </p>
                <form  action="https://formspree.io/f/xgvkqplw"
                method="POST"
                >
                  {['name', 'email', 'subject'].map((field) => (
                    <div key={field} style={{ marginBottom: '1rem' }}>
                      <label htmlFor={field} style={{ display: 'block', marginBottom: '.5rem' }}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          fontSize: '1rem',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </div>
                  ))}
    
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="message" style={{ display: 'block', marginBottom: '.5rem' }}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                  </div>
    
                  <button
                    type="submit"
                    style={{
                      padding: '0.7rem 1.5rem',
                      fontSize: '1rem',
                      backgroundColor: '#0078e7',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Layout>
      );
}

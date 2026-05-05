import React from "react";
import Layout from "@theme/Layout";

export default function GUI() {
  return (
    <Layout title="Sky Coverage GUI">
      <div style={{ padding: 16 }}>
        <p>
          Interactive Sky Coverage tool.  
          If loading takes time, open in a new tab:
          <a
            href="https://lmazzolo-skycov-app.hf.space"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 8 }}
          >
            Open full app ↗
          </a>
        </p>
        <p>⚠️ The app may take a few seconds to update 
          after changing parameters. Thanks for your patience.
        </p>

        <iframe
          src="https://lmazzolo-skycov-app.hf.space"
          style={{
            width: "100%",
            height: "1000px",   
            border: 0,
            borderRadius: 12,
          }}
          loading="lazy"
          allow="clipboard-read; clipboard-write"
        />
        </div>
    </Layout>
  );
}
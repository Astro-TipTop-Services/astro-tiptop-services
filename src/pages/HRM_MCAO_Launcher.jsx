import React from "react";
import Layout from "@theme/Layout";

export default function GUI() {
  return (
    <Layout title="Sky Coverage GUI">
      <div style={{ padding: 16 }}>
        <p>
          If loading takes time, open in a new tab:
          <a
            href="https://lmazzolo-tiptop-hrm-mcao-launcher.hf.space"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 8 }}
          >
            Open full app ↗
          </a>
        </p>

        <iframe
          src="https://lmazzolo-tiptop-hrm-mcao-launcher.hf.space"
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
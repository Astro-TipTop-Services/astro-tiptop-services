import React from "react";
import Layout from "@theme/Layout";

export default function GUI() {
  return (
    <Layout title="Sky Coverage GUI">
      <div style={{ height: "calc(100vh - 120px)", padding: 16 }}>
        <iframe
          src="https://skycov-app.onrender.com"
          style={{ width: "100%", height: "100%", border: 0, borderRadius: 12 }}
          loading="lazy"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </Layout>
  );
}

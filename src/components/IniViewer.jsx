import React, { useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function IniViewer({ filePath }) {
  const [content, setContent] = useState('Loading...');
  const fullPath = useBaseUrl(filePath);

  useEffect(() => {
    fetch(fullPath)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch file');
        return res.text();
      })
      .then((text) => setContent(text))
      .catch(() => setContent('Error loading file'));
  }, [fullPath]);

  return (
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        <code>
        {content}
        </code>
      </pre>
  );
}

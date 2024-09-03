import React, { useState, useEffect } from 'react';
import { csrfFetch } from '../../store/csrf';
import DOMPurify from 'dompurify';

const WebView = () => {
  const [url, setUrl] = useState('https://example.com');
  const [content, setContent] = useState('');
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    fetchContent(url);
  }, [url]);

  const fetchContent = async (url) => {
    try {
      const response = await csrfFetch(url);
      const text = await response.text();
      const sanitizedContent = DOMPurify.sanitize(text);
      setContent(sanitizedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent('<p>Error loading content. Please try again.</p>');
    }
  };

  const loadUrl = (newUrl) => {
    setUrl(newUrl);
    setHistory([...history.slice(0, currentIndex + 1), newUrl]);
    setCurrentIndex(currentIndex + 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUrl(history[currentIndex - 1]);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUrl(history[currentIndex + 1]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadUrl(e.target.url.value);
  };

  return (
    <div className="webview">
      <div className="webview-controls">
        <button onClick={goBack} disabled={currentIndex <= 0}>Back</button>
        <button onClick={goForward} disabled={currentIndex >= history.length - 1}>Forward</button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="url"
            placeholder="Enter URL"
            defaultValue={url}
          />
          <button type="submit">Go</button>
        </form>
      </div>
      <div
        className="webview-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{width: '100%', height: '500px', overflow: 'auto', border: '1px solid #ccc'}}
      />
    </div>
  );
};

export default WebView;

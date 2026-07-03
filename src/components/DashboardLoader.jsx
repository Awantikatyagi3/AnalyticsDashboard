import { useState, useMemo } from 'react';

const DashboardLoader = ({ src, title }) => {
  const [loaded, setLoaded] = useState(false);

  // Memoize test id to avoid recalculation on re-render
  const testId = useMemo(() => {
    return `${title.toLowerCase().replace(/\s+/g, '-')}-dashboard`;
  }, [title]);

  return (
    <div
      className="dashboard-container"
      data-testid={testId}
      style={{ position: 'relative', minHeight: '500px' }} // Prevent layout shift
    >
      {/* Loading Overlay */}
      {!loaded && src !== "about:blank" && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Dashboard...</div>
        </div>
      )}

      {/* Power BI Iframe */}
      <iframe
        className="dashboard-iframe"
        src={src}
        title={title}
        allowFullScreen
        loading="eager"             // Start loading immediately
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          visibility: loaded ? 'visible' : 'hidden' // better than display:none
        }}
      />

      {/* Placeholder Mode */}
      {src === "about:blank" && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            background: '#f8fafc',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Power BI Dashboard Placeholder - Replace iframe src with your Power BI embed URL
        </div>
      )}
    </div>
  );
};

export default DashboardLoader;

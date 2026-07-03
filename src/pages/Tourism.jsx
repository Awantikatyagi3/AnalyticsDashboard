import DashboardLoader from '../components/DashboardLoader';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const Tourism = () => {
  return (
    <div className="dashboard-page" data-testid="tourism-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="page-title">Tourism</h1>
            <p className="page-description">
              Discover comprehensive tourism statistics including visitor arrivals, seasonal trends, economic impact, and regional tourism patterns. 
              Explore data on domestic and international tourism, hotel occupancy rates, and revenue generation across popular destinations.
            </p>
          </div>

          {/* Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, marginRight: '40px' }}>
            <img
              src={nitiAayogLogo}
              alt="NITI Aayog"
              style={{ height: '110px', objectFit: 'contain', background: 'white', borderRadius: '8px', padding: '6px' }}
            />
            <img
              src={iitrLogo}
              alt="IIT Roorkee"
              style={{ height: '110px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      <DashboardLoader 
        src="https://app.powerbi.com/view?r=eyJrIjoiYzA0NWJkMGEtY2E4ZS00ZTlmLWE1YWUtMDQyMjc1ZTQ3ZjU4IiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9" 
        title="Tourism Dashboard" 
      />
    </div>
  );
};

export default Tourism;
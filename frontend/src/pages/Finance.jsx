import DashboardLoader from '../components/DashboardLoader';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const Finance = () => {
  return (
    <div className="dashboard-page" data-testid="finance-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="page-title">Finance</h1>
            <p className="page-description">
              Access key financial indicators, government expenditure data, and economic metrics across sectors. 
              Monitor fiscal performance, budget allocations, revenue trends, and financial inclusion statistics to understand India's economic landscape.
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
        src="https://app.powerbi.com/view?r=eyJrIjoiNzE5YmRmZDQtNGI1OC00OTkzLTkxM2UtNjQyZGI0NjE4ZWE3IiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9&pageName=d4f6a39387072c578339" 
        title="Finance Dashboard" 
      />
    </div>
  );
};

export default Finance;
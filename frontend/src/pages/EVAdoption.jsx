import DashboardLoader from '../components/DashboardLoader';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const EVAdoption = () => {
  return (
    <div className="dashboard-page" data-testid="ev-adoption-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="page-title">EV Adoption</h1>
            <p className="page-description">
              Track the growth and adoption of electric vehicles across different regions and segments. 
              Analyze registration trends, market penetration rates, vehicle categories, and adoption patterns to understand the transition to sustainable transportation.
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
        src="https://app.powerbi.com/view?r=eyJrIjoiMTNmNzY0NjItODZlZi00MTI0LWExMWQtZDM2ZGE1NTkxZjA2IiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9" 
        title="EV Adoption Dashboard" 
      />
    </div>
  );
};

export default EVAdoption;
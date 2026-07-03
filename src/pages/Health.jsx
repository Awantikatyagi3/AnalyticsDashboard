import DashboardLoader from '../components/DashboardLoader';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const Health = () => {
  return (
    <div className="dashboard-page" data-testid="health-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="page-title">Health</h1>
            <p className="page-description">
              Access vital health indicators, medical infrastructure data, and public health statistics. 
              Monitor healthcare facility distribution, disease surveillance data, immunization coverage, maternal and child health metrics, and health program outcomes.
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
        src="https://app.powerbi.com/view?r=eyJrIjoiYTBlM2JkZjgtNWY0Mi00MzEwLTg2YWItZWY3NDEwM2UxZjdiIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9" 
        title="Health Dashboard" 
      />
    </div>
  );
};

export default Health;
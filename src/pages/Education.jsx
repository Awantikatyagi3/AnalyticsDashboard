import DashboardLoader from '../components/DashboardLoader';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const Education = () => {
  return (
    <div className="dashboard-page" data-testid="education-page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="page-title">Education</h1>
            <p className="page-description">
              Explore education statistics including enrollment rates, literacy trends, institutional infrastructure, and academic outcomes. 
              Analyze data across primary, secondary, and higher education to understand progress and gaps in India's education landscape.
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
        src="https://app.powerbi.com/view?r=eyJrIjoiMTE2NTBhMWEtOTQwMy00MzY5LWFjYWYtMTNlMDI0MmE5ZjBiIiwidCI6IjM4ZjYyOTI2LTc1NTktNGFlZi04NGFlLWNiNWUxNzI0MDZmYiJ9&pageName=83ac7a412c1e27a72d52" 
        title="Education Dashboard" 
      />
    </div>
  );
};

export default Education;
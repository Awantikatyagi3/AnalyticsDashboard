import { Link } from 'react-router-dom';
import nitiAayogLogo from '../assets/images__3_.png';
import iitrLogo from '../assets/IITRLOGO_no_background.png';

const Home = ({ onDashboardSelect }) => {
  const dashboards = [
    {
      path: '/census-surveys',
      title: 'Census & Surveys',
      description: 'Explore comprehensive demographic data, population statistics, and survey insights across regions.',
      icon: 'users'
    },
    {
      path: '/ev-adoption',
      title: 'EV Adoption',
      description: 'Track electric vehicle adoption trends, registration data, and market penetration across different segments.',
      icon: 'zap'
    },
    {
      path: '/ev-energy-impact',
      title: 'EV Energy Impact',
      description: 'Analyze the energy consumption patterns, grid impact, and sustainability metrics of electric vehicles.',
      icon: 'battery-charging'
    },
    {
      path: '/tourism',
      title: 'Tourism',
      description: 'Discover tourism statistics, visitor trends, economic impact, and regional tourism patterns.',
      icon: 'map-pin'
    },
    {
      path: '/health',
      title: 'Health',
      description: 'Access health indicators, medical infrastructure data, and public health statistics.',
      icon: 'heart'
    },
    {
      path: '/education',
      title: 'Education',
      description: 'Explore enrollment rates, literacy trends, institutional infrastructure, and academic outcomes across India.',
      icon: 'book'
    },
    {
      path: '/finance',
      title: 'Finance',
      description: 'Monitor fiscal performance, budget allocations, revenue trends, and financial inclusion statistics.',
      icon: 'trending-up'
    }
  ];

  const getIcon = (iconName) => {
    const icons = {
      'users': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      'zap': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      'battery-charging': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/></svg>,
      'map-pin': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      'heart': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
      'book': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      'trending-up': <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    };
    return icons[iconName];
  };

  return (
    <div className="home-page" data-testid="home-page">
      <section className="welcome-section">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Text Content */}
          <div style={{ flex: 1 }}>
            <h1 className="welcome-title">Decision Support System</h1>
            <p className="welcome-description">
              Welcome to the comprehensive policy analytics platform. Access real-time data visualizations, 
              insights, and analytics across key sectors including demographics, electric vehicles, tourism, and public health. 
              All data is sourced from official government repositories to ensure accuracy and reliability.
            </p>
          </div>

          {/* Logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <img
              src={nitiAayogLogo}
              alt="NITI Aayog"
              style={{ height: '90px', objectFit: 'contain', background: 'white', borderRadius: '8px', padding: '6px' }}
            />
            <img
              src={iitrLogo}
              alt="IIT Roorkee"
              style={{ height: '90px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      <div className="home-grid">
        {dashboards.map((dashboard, index) => (
          <Link
            key={dashboard.path}
            to={dashboard.path}
            className="dashboard-card"
            onClick={onDashboardSelect}
            data-testid={`dashboard-card-${dashboard.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="card-icon">
              {getIcon(dashboard.icon)}
            </div>
            <h2 className="card-title">{dashboard.title}</h2>
            <p className="card-description">{dashboard.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
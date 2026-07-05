import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed, onDashboardSelect }) => {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/census-surveys', label: 'Census & Surveys', icon: 'users' },
    { path: '/ev-adoption', label: 'EV Adoption', icon: 'zap' },
    { path: '/ev-energy-impact', label: 'EV Energy Impact', icon: 'battery-charging' },
    { path: '/tourism', label: 'Tourism', icon: 'map-pin' },
    { path: '/health', label: 'Health', icon: 'heart' },
    { path: '/education', label: 'Education', icon: 'book' },
    { path: '/finance', label: 'Finance', icon: 'trending-up' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      'home': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      'users': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      'zap': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      'battery-charging': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/></svg>,
      'map-pin': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      'heart': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
      'book': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      'trending-up': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
      'external-link': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>,
    };
    return icons[iconName];
  };

  const handleNavClick = (e, path) => {
    if (path !== '/') {
      onDashboardSelect();
    }
  };

  const isExpanded = !collapsed || isHovering;

  return (
    <aside 
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${isHovering ? 'hovering' : ''}`}
      onMouseEnter={() => collapsed && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon" data-testid="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
          </div>
          {isExpanded && (
            <div className="logo-text" data-testid="logo-text">
              <h1 style={{ whiteSpace: 'normal', lineHeight: '1.3', fontSize: '0.95rem' }}>
                Decision Support System
              </h1>
            </div>
          )}
        </div>
        {!collapsed && (
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            data-testid="collapse-sidebar-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, item.path)}
            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="nav-icon">{getIcon(item.icon)}</span>
            {isExpanded && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}

        {/* External Link Button */}
        <a
          href="http://10.53.1.32:8080/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
          data-testid="nav-external-portal"
        >
          <span className="nav-icon">{getIcon('external-link')}</span>
          {isExpanded && <span className="nav-label">Decision Support System</span>}
        </a>
      </nav>

      {collapsed && (
        <button 
          className="expand-btn"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          data-testid="expand-sidebar-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
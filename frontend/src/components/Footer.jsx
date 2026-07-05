import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="page-footer" data-testid="page-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Data Sources</h3>
          <p>All data and analytics presented in these dashboards are sourced from official government repositories:</p>
          <div className="data-sources">
            <a 
              href="https://ndap.niti.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="source-link"
              data-testid="source-link-ndap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              ndap.niti.gov.in
            </a>
            <a 
              href="https://data.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="source-link"
              data-testid="source-link-datagov"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              data.gov.in
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Policy Analytics Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



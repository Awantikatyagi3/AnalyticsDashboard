import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CensusSurveys from "./pages/CensusSurveys.jsx";
import EVAdoption from "./pages/EVAdoption.jsx";
import EVEnergyImpact from "./pages/EVEnergyImpact.jsx";
import Tourism from "./pages/Tourism.jsx";
import Health from "./pages/Health.jsx";
import Education from "./pages/Education.jsx";
import Finance from "./pages/Finance.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";

//scp -i C:/Users/Aashish\ Tyagi/.ssh/SETU-Instance-keypair.pem -r dist/* ubuntu@65.0.205.90:/var/www/html/

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDashboardSelect = () => {
    setSidebarCollapsed(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-container">
          <Sidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed}
            onDashboardSelect={handleDashboardSelect}
          />
          <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <div className="content-wrapper">
              <Routes>
                <Route 
                  path="/" 
                  element={<Home onDashboardSelect={handleDashboardSelect} />} 
                />
                <Route path="/census-surveys" element={<CensusSurveys />} />
                <Route path="/ev-adoption" element={<EVAdoption />} />
                <Route path="/ev-energy-impact" element={<EVEnergyImpact />} />
                <Route path="/tourism" element={<Tourism />} />
                <Route path="/health" element={<Health />} />
                <Route path="/education" element={<Education />} />
                <Route path="/finance" element={<Finance />} />
              </Routes>
              <Footer />
            </div>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
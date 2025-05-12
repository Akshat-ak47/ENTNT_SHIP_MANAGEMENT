// src/pages/inspector-dashboard/InspectorDashboard.jsx
import React, { useState, useEffect } from 'react';
import './InspectorDashboard.css';
import { useJobContext } from '../../contexts/JobContext';

import InspectionManager from '../../components/ships/InspectionManager';
import ComponentInspection from '../../components/ComponentManagers/ComponentInspection';
import JobManager from '../../components/Jobs/JobManager';
import NotificationCenter from '../../components/Notifications/NotificationCenter';
import KPICharts from '../../components/KPICharts/KPICharts';

import JobCalendar from '../../components/Calendar/JobCalendar';
import ShipCalendarView from '../../components/Calendar/ShipCalendarView';
import ComponentCalendarView from '../../components/Calendar/ComponentCalendarView';

const InspectorDashboard = () => {
  const { jobs, setJobs } = useJobContext();
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('kpi');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = () => {
      try {
        setShips(JSON.parse(localStorage.getItem('ships')) || []);
        setComponents(JSON.parse(localStorage.getItem('components')) || []);
        setNotifications(JSON.parse(localStorage.getItem('notifications')) || []);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        setShips([]);
        setComponents([]);
        setNotifications([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ships', JSON.stringify(ships));
      localStorage.setItem('components', JSON.stringify(components));
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [ships, components, notifications]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  const sectionComponents = {
    kpi: <KPICharts ships={ships} components={components} jobs={jobs} />,
    inspectionManagement: (
      <div className="management-sections">
        <div className="management-card ship-card">
          <InspectionManager ships={ships} setShips={setShips} />
        </div>
        <div className="management-card component-card">
          <ComponentInspection
            ships={ships}
            components={components}
            setComponents={setComponents}
          />
        </div>
        <div className="management-card job-card">
          <JobManager
            jobs={jobs}
            setJobs={setJobs}
            ships={ships}
            components={components}
          />
        </div>
      </div>
    ),
    viewJobs: <JobCalendar />,
    viewShips: <ShipCalendarView ships={ships} />,
    viewComponents: <ComponentCalendarView components={components} />,
    notifications: (
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
      />
    ),
  };

  const renderSection = () => {
    return sectionComponents[activeSection] || <div>Invalid section</div>;
  };

  return (
    <div className="inspector-dashboard">
      <div className="top-bar">
        <div className="dashboard-title">Inspector Dashboard</div>
        <div className="nav-buttons">
          <button onClick={() => setActiveSection('kpi')}>KPI Charts</button>
          <button onClick={() => setActiveSection('inspectionManagement')}>Inspection Management</button>
          <button onClick={() => setActiveSection('viewJobs')}>Jobs</button>
          <button onClick={() => setActiveSection('viewShips')}>Ships</button>
          <button onClick={() => setActiveSection('viewComponents')}>Components</button>
          <button onClick={() => setActiveSection('notifications')}>Notifications</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
        <div className="profile-section">
          <div
            className="profile-circle"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </div>
          {showProfile && (
            <div className="profile-dropdown">
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Role:</strong> {role}</p>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-body">
        <div className="content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;

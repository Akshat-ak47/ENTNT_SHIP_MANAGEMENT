// src/pages/admin-dashboard/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';
import { useJobContext } from '../../contexts/JobContext';

import ShipManager from '../../components/ships/ShipManager';
import ComponentManager from '../../components/ComponentManagers/ComponentManager';
import JobManager from '../../components/Jobs/JobManager';
import NotificationCenter from '../../components/Notifications/NotificationCenter';
import KPICharts from '../../components/KPICharts/KPICharts';

import JobCalendar from '../../components/Calendar/JobCalendar';
import ShipCalendarView from '../../components/Calendar/ShipCalendarView';
import ComponentCalendarView from '../../components/Calendar/ComponentCalendarView';

const AdminDashboard = () => {
  const { jobs, setJobs } = useJobContext();
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('kpi');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null); // 👈 add ref

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = () => {
      setShips(JSON.parse(localStorage.getItem('ships')) || []);
      setComponents(JSON.parse(localStorage.getItem('components')) || []);
      setNotifications(JSON.parse(localStorage.getItem('notifications')) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('ships', JSON.stringify(ships));
    localStorage.setItem('components', JSON.stringify(components));
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [ships, components, notifications]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // 👇 Handle outside click to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <div className="loading-screen">Loading...</div>;

  const renderSection = () => {
    switch (activeSection) {
      case 'kpi':
        return <KPICharts ships={ships} components={components} jobs={jobs} />;
      case 'management':
        return (
          <div className="management-sections">
            <div className="management-card ship-card">
              <ShipManager ships={ships} setShips={setShips} />
            </div>
            <div className="management-card component-card">
              <ComponentManager
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
        );
      case 'viewJobs':
        return <JobCalendar />;
      case 'viewShips':
        return <ShipCalendarView ships={ships} />;
      case 'viewComponents':
        return <ComponentCalendarView components={components} />;
      case 'notifications':
        return (
          <NotificationCenter
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      default:
        return <div>Invalid section</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="topbar">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="sidebar-buttons">
          <button onClick={() => setActiveSection('kpi')}>KPI Charts</button>
          <button onClick={() => setActiveSection('management')}>Management</button>
          <button onClick={() => setActiveSection('viewJobs')}>Jobs</button>
          <button onClick={() => setActiveSection('viewShips')}>Ships</button>
          <button onClick={() => setActiveSection('viewComponents')}>Components</button>
          <button onClick={() => setActiveSection('notifications')}>Notifications</button>
        </div>

        <div className="profile-section" ref={profileRef}>
          <div className="profile-circle" onClick={() => setShowProfile(!showProfile)}>
            👤
          </div>
          {showProfile && (
            <div className="profile-dropdown">
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Role:</strong> {role}</p>
              <button className="logout" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;

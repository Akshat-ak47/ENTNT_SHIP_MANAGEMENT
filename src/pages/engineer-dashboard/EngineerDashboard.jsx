// src/pages/engineer-dashboard/EngineerDashboard.jsx
import React, { useState, useEffect } from 'react';
import './EngineerDashboard.css';
import { useJobContext } from '../../contexts/JobContext';

import AssignedJobList from '../../components/Engineer/AssignedJobList';
import EngineerJobCalendar from '../../components/Engineer/EngineerJobCalendar';
import ComponentViewer from '../../components/Engineer/ComponentViewer';
import NotificationCenter from '../../components/Notifications/NotificationCenter';
import PersonalKPICharts from '../../components/Engineer/PersonalKPICharts';
import UserManagement from '../../components/Engineer/UserManagement';

const EngineerDashboard = () => {
  const { jobs } = useJobContext();
  const [notifications, setNotifications] = useState([]);
  const [activeSection, setActiveSection] = useState('kpi');
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const engineerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = () => {
      setNotifications(JSON.parse(localStorage.getItem('notifications')) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  const renderSection = () => {
    switch (activeSection) {
      case 'kpi':
        return <PersonalKPICharts engineerId={engineerId} jobs={jobs} />;
      case 'assignedJobs':
        return <AssignedJobList engineerId={engineerId} />;
      case 'calendar':
        return <EngineerJobCalendar engineerId={engineerId} />;
      case 'componentViewer':
        return <ComponentViewer engineerId={engineerId} />;
      case 'notifications':
        return (
          <NotificationCenter
            notifications={notifications}
            setNotifications={setNotifications}
            filterByEngineerId={engineerId}
          />
        );
      case 'userManagement':
        return <UserManagement />;
      default:
        return <div>Invalid section</div>;
    }
  };

  return (
    <div className="engineer-dashboard">
      <div className="top-layer">
        <h1>Engineer Dashboard</h1>
        <div className="profile-section">
          <div className="profile-circle" onClick={() => setShowProfile(!showProfile)}>
            👷
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
        <div className="sidebar">
          <div className="sidebar-buttons">
            <button onClick={() => setActiveSection('kpi')}>KPI Charts</button>
            <button onClick={() => setActiveSection('assignedJobs')}>Assigned Jobs</button>
            <button onClick={() => setActiveSection('calendar')}>Job Calendar</button>
            <button onClick={() => setActiveSection('componentViewer')}>Component Viewer</button>
            <button onClick={() => setActiveSection('notifications')}>Notifications</button>
            <button onClick={() => setActiveSection('userManagement')}>User Access</button>
            <button className="logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
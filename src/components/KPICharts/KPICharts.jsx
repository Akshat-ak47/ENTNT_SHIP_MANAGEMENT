import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const KPICharts = ({ jobs, ships, components }) => {
  const [kpiData, setKpiData] = useState({
    totalShips: 0,
    jobsOpen: 0,
    jobsScheduled: 0,
    overdueComponents: 0,
    jobsCompleted: 0,
    componentsFixed: 0,
  });
  
  const [timeRange, setTimeRange] = useState('monthly'); // Dynamic Time Range: monthly, weekly, yearly
  const [targetData] = useState({
    totalShips: 2, // Target total ships
    jobsOpen: 1,   // Target open jobs
    jobsScheduled: 1,  // Target scheduled jobs
    overdueComponents: 1, // Target overdue components
    jobsCompleted: 1,    // Target completed jobs
    componentsFixed: 1,  // Target fixed components
  });

  useEffect(() => {
    const totalShips = ships.length;
    
    const jobsOpen = jobs.filter((job) => job.status === 'Open').length;
    const jobsScheduled = jobs.filter((job) => job.status === 'Scheduled').length;
    const jobsCompleted = jobs.filter((job) => job.status === 'Completed').length;

    const currentDate = new Date();
    const overdueComponents = components.filter((component) => {
      const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
      const timeDiff = currentDate - lastMaintenanceDate;
      const daysDiff = timeDiff / (1000 * 3600 * 24); 
      return daysDiff > 30;
    }).length;

    // Add condition based on timeRange selection (Monthly, Weekly, or Yearly)
    const filteredComponents = components.filter((component) => {
      const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
      if (timeRange === 'monthly') {
        return currentDate.getMonth() - lastMaintenanceDate.getMonth() <= 1;
      } else if (timeRange === 'weekly') {
        const diffTime = Math.abs(currentDate - lastMaintenanceDate);
        const diffDays = diffTime / (1000 * 3600 * 24);
        return diffDays <= 7;
      } else if (timeRange === 'yearly') {
        return currentDate.getFullYear() === lastMaintenanceDate.getFullYear();
      }
      return false;
    });

    const componentsFixed = filteredComponents.length;

    setKpiData({
      totalShips,
      jobsOpen,
      jobsScheduled,
      overdueComponents,
      jobsCompleted,
      componentsFixed,
    });
  }, [jobs, ships, components, timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const data = {
    labels: ['Ships', 'Jobs Open', 'Jobs Scheduled', 'Jobs Completed', 'Overdue Components', 'Components Fixed'],
    datasets: [
      {
        label: 'KPI Overview',
        data: [
          kpiData.totalShips, 
          kpiData.jobsOpen, 
          kpiData.jobsScheduled, 
          kpiData.jobsCompleted, 
          kpiData.overdueComponents, 
          kpiData.componentsFixed
        ],
        fill: false,
        borderColor: '#2563eb',
        tension: 0.1,
      },
      {
        label: 'Target Overview',
        data: [
          targetData.totalShips, 
          targetData.jobsOpen, 
          targetData.jobsScheduled, 
          targetData.jobsCompleted, 
          targetData.overdueComponents, 
          targetData.componentsFixed
        ],
        fill: false,
        borderColor: '#34D399', // Green for target line
        borderDash: [5, 5], // Dashed line for target
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    height: 200,
    width: 400,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Count: ${context.raw}`; // Detailed tooltip data
          },
        },
      },
    },
  };

  // Calculate Health Index (average of all KPIs)
  const healthIndex = (
    (kpiData.jobsOpen + kpiData.jobsScheduled + kpiData.jobsCompleted + kpiData.overdueComponents + kpiData.componentsFixed) / 5
  ).toFixed(2);

  return (
    <div>
      <h2>Key Performance Indicators (KPIs)</h2>
      <div>
        <label htmlFor="timeRange">Select Time Range: </label>
        <select id="timeRange" value={timeRange} onChange={handleTimeRangeChange}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div style={{ position: 'relative', height: '300px', width: '1000px', borderRadius: '8px', border: '1px solid #ddd', padding: '20px', backgroundColor: '#f9fafb' }}>
        <Line data={data} options={options} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Health Index: {healthIndex}</h3>
      </div>
    </div>
  );
};

export default KPICharts;

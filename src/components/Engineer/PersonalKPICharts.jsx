import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './PersonalKPICharts.css';

const PersonalKPICharts = ({ jobs }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });

  // KPI 1: Jobs Status (Completed, Pending, Upcoming)
  const completed = jobs.filter(j => j.status === 'Completed').length;
  const pending = jobs.filter(j => j.status !== 'Completed').length;
  const upcoming = jobs.filter(j => new Date(j.scheduledDate) > new Date()).length;

  // KPI 2: Defects (Found, Corrected, Pending) - Dummy Data
  const defectsFound = 25;
  const defectsCorrected = 18;
  const defectsPending = defectsFound - defectsCorrected; // Calculated here, no need for useMemo

  // Memoize KPI Data for Pie, Bar, and Line charts
  const pieData = useMemo(() => [completed, pending, upcoming], [completed, pending, upcoming]);
  const pieLabels = useMemo(() => ['Completed', 'Pending', 'Upcoming'], []);

  const barData = useMemo(() => [defectsFound, defectsCorrected, defectsPending], [defectsFound, defectsCorrected, defectsPending]);
  const barLabels = useMemo(() => ['Found', 'Corrected', '  Pending'], []);

  const lineData = useMemo(() => {
    return [5, 8, 12, 18, 20, 22, 25];  // Jobs completed each day
  }, []);  // No dependencies needed, since the data doesn't change
  const lineLabels = useMemo(() => {
    return ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  }, []);  // No dependencies needed, since the labels don't change

  const pieCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);

  const drawPieChart = (ctx, data, labels) => {
    const colors = ['#2ecc71', '#e74c3c', '#f39c12'];
    let startAngle = 0;
    data.forEach((value, index) => {
      const sliceAngle = (value / data.reduce((acc, val) => acc + val, 0)) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.arc(200, 200, 100, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = colors[index];
      ctx.fill();
      startAngle += sliceAngle;
    });

    startAngle = 0;
    data.forEach((value, index) => {
      const sliceAngle = (value / data.reduce((acc, val) => acc + val, 0)) * 2 * Math.PI;
      const labelX = 200 + 50 * Math.cos(startAngle + sliceAngle / 2);
      const labelY = 200 + 50 * Math.sin(startAngle + sliceAngle / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.fillText(labels[index], labelX, labelY);
      startAngle += sliceAngle;
    });
  };

  const drawBarChart = (ctx, data, labels) => {
    const barWidth = 40;  // Reduced width for better label fit
    const barSpacing = 40; // Increased spacing for better visual balance
    const maxHeight = 300;

    data.forEach((value, index) => {
      const x = (barWidth + barSpacing) * index + 50;
      const y = 350 - (value / Math.max(...data)) * maxHeight;
      const height = (value / Math.max(...data)) * maxHeight;
      ctx.fillStyle = '#2980b9';
      ctx.fillRect(x, y, barWidth, height);
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';  // Reduced label font size
      ctx.fillText(labels[index], x + barWidth / 2 - 15, 370);
    });
  };

  const drawLineChart = (ctx, data, labels) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const maxHeight = 300;  // Max height for the chart
  
  // Draw Y-axis
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(50, 350);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Add Y-axis labels
  ctx.font = '10px Arial';
  ctx.fillStyle = '#333';
  const yStep = (maxValue - minValue) / 5;  // Dividing the axis into 5 steps
  for (let i = 0; i <= 5; i++) {
    const yValue = maxValue - i * yStep;
    ctx.fillText(Math.round(yValue), 30, 350 - (i * (maxHeight / 5)));
  }

  // Draw the line chart
  ctx.beginPath();
  ctx.moveTo(50, 350 - (data[0] / maxValue) * maxHeight);
  data.forEach((value, index) => {
    const x = (index + 1) * 100;
    const y = 350 - (value / maxValue) * maxHeight;
    ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#9b59b6';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Add points and labels to the chart
  data.forEach((value, index) => {
    const x = (index + 1) * 100;
    const y = 350 - (value / maxValue) * maxHeight;
    ctx.fillStyle = '#333';
    ctx.fillText(labels[index], x, y - 10);
  });

  // Label for the line chart
  ctx.fillStyle = '#9b59b6';
  ctx.font = '12px Arial';
  ctx.fillText('Jobs Completed Over Time', 10, 20);
};


  const renderCharts = useCallback(() => {
    const pieCanvas = pieCanvasRef.current;
    const pieCtx = pieCanvas.getContext('2d');
    drawPieChart(pieCtx, pieData, pieLabels);

    const barCanvas = barCanvasRef.current;
    const barCtx = barCanvas.getContext('2d');
    drawBarChart(barCtx, barData, barLabels);

    const lineCanvas = lineCanvasRef.current;
    const lineCtx = lineCanvas.getContext('2d');
    drawLineChart(lineCtx, lineData, lineLabels);
  }, [pieData, pieLabels, barData, barLabels, lineData, lineLabels]);

  const handleMouseMove = (e, canvasRef, chartType) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let tooltipText = '';
    if (chartType === 'pie') {
      const angles = pieData.map((value, index) => (value / pieData.reduce((acc, val) => acc + val, 0)) * 2 * Math.PI);
      let startAngle = 0;
      angles.forEach((angle, index) => {
        if (mouseX > 200 + 100 * Math.cos(startAngle) && mouseX < 200 + 100 * Math.cos(startAngle + angle) &&
          mouseY > 200 + 100 * Math.sin(startAngle) && mouseY < 200 + 100 * Math.sin(startAngle + angle)) {
          tooltipText = pieLabels[index];
        }
        startAngle += angle;
      });
    }

    if (tooltipText) {
      setTooltip({ show: true, x: mouseX, y: mouseY, text: tooltipText });
    } else {
      setTooltip({ show: false });
    }
  };

  useEffect(() => {
    renderCharts();
  }, [renderCharts]);

  return (
    <div className="kpi-charts">
      <h2>My KPIs</h2>
      <div className="kpi-boxes">
        <div className="kpi-box">Total Assigned: {jobs.length}</div>
        <div className="kpi-box">Completed: {completed}</div>
        <div className="kpi-box">Pending: {pending}</div>
        <div className="kpi-box">Upcoming This Week: {upcoming}</div>
      </div>
      <div className="chart-container">
        <div className="chart-row">
          <div className="chart-title">Job Status Distribution</div>
          <canvas
            ref={pieCanvasRef}
            width="400"
            height="400"
            className="chart"
            onMouseMove={(e) => handleMouseMove(e, pieCanvasRef, 'pie')}
          />
          <div className="chart-title">Defects Overview</div>
          <canvas
            ref={barCanvasRef}
            width="400"
            height="400"
            className="chart"
            onMouseMove={(e) => handleMouseMove(e, barCanvasRef, 'bar')}
          />
        </div>
        <div className="chart-row">
          <div className="chart-title">Job Completion Over Time</div>
          <canvas
            ref={lineCanvasRef}
            width="400"
            height="400"
            className="chart"
            onMouseMove={(e) => handleMouseMove(e, lineCanvasRef, 'line')}
          />
        </div>
        {tooltip.show && (
          <div className="tooltip" style={{ left: tooltip.x + 'px', top: tooltip.y + 'px' }}>
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalKPICharts;

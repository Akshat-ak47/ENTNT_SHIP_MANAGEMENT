import React, { useState } from 'react';
import './ComponentInspection.css';

const ComponentInspection = ({ ships, components, setComponents }) => {
  const [selectedShipId, setSelectedShipId] = useState('');
  const [inspectionNote, setInspectionNote] = useState('');
  const [selectedComponentId, setSelectedComponentId] = useState('');

  const handleInspectionSubmit = () => {
    if (!selectedComponentId || !inspectionNote) return alert('Please fill all fields.');

    const updatedComponents = components.map(component =>
      component.id === selectedComponentId
        ? { ...component, lastInspected: new Date().toISOString(), note: inspectionNote }
        : component
    );
    setComponents(updatedComponents);
    setInspectionNote('');
    setSelectedComponentId('');
    alert('Component inspection updated!');
  };

  const componentsOfShip = selectedShipId
    ? components.filter(comp => comp.shipId === selectedShipId)
    : [];

  return (
    <div className="component-inspection">
      <h2 className="inspection-heading">Component Inspection</h2>

      <div className="inspection-controls">
        <label htmlFor="ship-select" className="label">Select Ship:</label>
        <select
          id="ship-select"
          className="select"
          value={selectedShipId}
          onChange={e => setSelectedShipId(e.target.value)}
        >
          <option value="">-- Select Ship --</option>
          {ships.map(ship => (
            <option key={ship.id} value={ship.id}>
              {ship.name}
            </option>
          ))}
        </select>

        {componentsOfShip.length > 0 && (
          <>
            <label htmlFor="component-select" className="label">Select Component:</label>
            <select
              id="component-select"
              className="select"
              value={selectedComponentId}
              onChange={e => setSelectedComponentId(e.target.value)}
            >
              <option value="">-- Select Component --</option>
              {componentsOfShip.map(component => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>

            <label htmlFor="inspection-notes" className="label">Inspection Notes:</label>
            <textarea
              id="inspection-notes"
              className="textarea"
              value={inspectionNote}
              onChange={e => setInspectionNote(e.target.value)}
              placeholder="Enter inspection details"
            />

            <button className="submit-btn" onClick={handleInspectionSubmit}>Submit Inspection</button>
          </>
        )}
      </div>

      <div className="inspection-history">
        <h3 className="history-heading">Inspection History</h3>
        <ul>
          {components.map(comp => (
            <li key={comp.id}>
              <strong>{comp.name}</strong> — Last Inspected: {comp.lastInspected ? new Date(comp.lastInspected).toLocaleString() : 'N/A'}
              {comp.note && <p>Note: {comp.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComponentInspection;

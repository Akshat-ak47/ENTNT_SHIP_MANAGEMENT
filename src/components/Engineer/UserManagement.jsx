import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(stored);
  }, []);

  const removeUser = (email) => {
    const filtered = users.filter(u => u.email !== email);
    setUsers(filtered);
    localStorage.setItem('users', JSON.stringify(filtered));
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.email} className="user-entry">
            {user.email} ({user.role})
            <button onClick={() => removeUser(user.email)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
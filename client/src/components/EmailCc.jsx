import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCCSettings = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    // Fetch existing emails on load
    axios.get('/api/admin/settings/cc').then(res => setEmails(res.data));
  }, []);

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const saveSettings = async () => {
    await axios.post('/api/admin/settings/cc', { emails });
    alert("Settings Saved!");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', background: '#fff', borderRadius: '8px' }}>
      <h3>Email CC Settings</h3>
      <div style={{ marginBottom: '10px' }}>
        <input 
          value={newEmail} 
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button onClick={addEmail}>Add</button>
      </div>
      <ul>
        {emails.map(email => (
          <li key={email}>
            {email} <button onClick={() => removeEmail(email)}>x</button>
          </li>
        ))}
      </ul>
      <button onClick={saveSettings} style={{ background: 'green', color: 'white' }}>
        Save Changes
      </button>
    </div>
  );
};
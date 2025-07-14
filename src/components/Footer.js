// src/components/Footer.js
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>
        Fitness Tracker | Developed by <strong>Marie Glenn</strong> 💪<br />
        © {new Date().getFullYear()} All Rights Reserved
      </p>
    </footer>
  );
}

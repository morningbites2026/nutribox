import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Plans from './components/Plans';
import BowlBuilder from './components/BowlBuilder';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { useContent } from './context/ContentContext';

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Plans />
      <BowlBuilder />
      <Footer />
    </>
  );
}

function App() {
  const { loading } = useContent();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--primary)',
        backgroundColor: 'var(--bg-color)',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid var(--primary-light)',
          borderTop: '4px solid var(--primary)',
          borderRadius: '50%',
          animation: 'pulse-gentle 1.5s infinite ease-in-out'
        }} />
        <p style={{ fontWeight: 500, fontSize: '18px' }}>Loading Nutribox...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;

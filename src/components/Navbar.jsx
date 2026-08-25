import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Settings, Menu, X, Leaf } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Navbar = () => {
  const { siteSettings } = useContent();
  const [theme, setTheme] = useState(localStorage.getItem('nutribox_theme') || 'light');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const businessName = siteSettings.business_name || 'Nutribox';

  // Manage Dark/Light theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutribox_theme', theme);
  }, [theme]);

  // Manage scroll background shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    
    // If not on landing page, navigate home first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`glass`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      transition: 'var(--transition-smooth)',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
      backgroundColor: scrolled ? 'var(--glass-bg)' : 'transparent'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Brand Logo */}
        <Link to="/" onClick={(e) => handleNavClick(e, 'hero')} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'var(--primary)',
          fontWeight: 700,
          fontSize: '22px',
          letterSpacing: '-0.5px'
        }}>
          {siteSettings.logo_url ? (
            <img 
              src={siteSettings.logo_url} 
              alt={businessName} 
              style={{ maxHeight: '45px', maxWidth: '180px', objectFit: 'contain' }} 
            />
          ) : (
            <>
              <Leaf style={{ width: '28px', height: '28px', fill: 'currentColor' }} />
              <span>{businessName}</span>
            </>
          )}
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '32px',
        }} className="desktop-menu">
          <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} style={navLinkStyle}>Home</a>
          <a href="#plans" onClick={(e) => handleNavClick(e, 'plans')} style={navLinkStyle}>Our Plans</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} style={navLinkStyle}>Contact</a>
          
          <button onClick={toggleTheme} style={iconBtnStyle} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile controls toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }} className="mobile-menu-toggle">
          <button onClick={toggleTheme} style={iconBtnStyle} title="Toggle Theme" className="mobile-only-btn">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button onClick={() => setIsOpen(!isOpen)} style={iconBtnStyle} className="mobile-toggle">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="glass" style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          padding: '24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeInUp 0.3s ease-out forwards',
          zIndex: 999
        }}>
          <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} style={mobileNavLinkStyle}>Home</a>
          <a href="#plans" onClick={(e) => handleNavClick(e, 'plans')} style={mobileNavLinkStyle}>Our Plans</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} style={mobileNavLinkStyle}>Contact</a>
        </div>
      )}

      {/* Inline styles for responsive override */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
        .mobile-only-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-muted)',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const mobileNavLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-main)',
  fontSize: '18px',
  fontWeight: 500,
  padding: '8px 0',
  borderBottom: '1px solid var(--border-color)'
};

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px',
  borderRadius: '50%',
  transition: 'var(--transition-smooth)'
};

const adminLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  textDecoration: 'none',
  color: 'var(--primary)',
  fontSize: '14px',
  fontWeight: 600,
  backgroundColor: 'var(--primary-light)',
  padding: '8px 16px',
  borderRadius: 'var(--radius-full)',
  transition: 'var(--transition-smooth)'
};

export default Navbar;

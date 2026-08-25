import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Leaf } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Navbar = () => {
  const { siteSettings } = useContent();
  const [theme, setTheme] = useState(localStorage.getItem('nutribox_theme') || 'light');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const businessName = siteSettings.business_name || 'Nutribox';
  const logoSrc = siteSettings.logo_url || '/logo.jpg';

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

  const getCleanWhatsappLink = () => {
    if (!siteSettings.social_whatsapp) return '#';
    const cleanNum = siteSettings.social_whatsapp.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNum}`;
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
          gap: '12px',
          textDecoration: 'none'
        }}>
          {logoSrc ? (
            <>
              <img 
                src={logoSrc} 
                alt={businessName} 
                style={{ 
                  maxHeight: '62px', 
                  width: 'auto', 
                  objectFit: 'contain', 
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                  border: '2px solid var(--primary-medium)'
                }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ 
                  fontSize: '22px', 
                  fontWeight: 800, 
                  color: 'var(--primary-dark)', 
                  lineHeight: 1.1,
                  letterSpacing: '-0.5px'
                }}>
                  {businessName}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  color: 'var(--accent)', 
                  letterSpacing: '0.7px', 
                  textTransform: 'uppercase',
                  marginTop: '3px'
                }}>
                  Small Box. Big Impact.
                </span>
              </div>
            </>
          ) : (
            <>
              <Leaf style={{ width: '28px', height: '28px', fill: 'currentColor', color: 'var(--primary)' }} />
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>{businessName}</span>
            </>
          )}
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px',
        }} className="desktop-menu">
          <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} style={navLinkStyle}>Home</a>
          <a href="#plans" onClick={(e) => handleNavClick(e, 'plans')} style={navLinkStyle}>Our Plans</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} style={navLinkStyle}>Contact</a>
          
          <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            {siteSettings.social_whatsapp && (
              <a href={getCleanWhatsappLink()} target="_blank" rel="noreferrer" style={iconBtnStyle} title="WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </a>
            )}
            {siteSettings.social_instagram && (
              <a href={siteSettings.social_instagram} target="_blank" rel="noreferrer" style={iconBtnStyle} title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            )}
            <button onClick={toggleTheme} style={iconBtnStyle} title="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile controls toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }} className="mobile-menu-toggle">
          {siteSettings.social_whatsapp && (
            <a href={getCleanWhatsappLink()} target="_blank" rel="noreferrer" style={iconBtnStyle} title="WhatsApp" className="mobile-only-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
          )}
          {siteSettings.social_instagram && (
            <a href={siteSettings.social_instagram} target="_blank" rel="noreferrer" style={iconBtnStyle} title="Instagram" className="mobile-only-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          )}
          <button onClick={toggleTheme} style={iconBtnStyle} title="Toggle Theme" className="mobile-only-btn">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
          justifyContent: center;
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-muted)',
  fontSize: '15px',
  fontWeight: 600,
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

const mobileNavLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-main)',
  fontSize: '18px',
  fontWeight: 600,
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

export default Navbar;

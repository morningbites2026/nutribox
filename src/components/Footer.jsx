import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Leaf, Heart } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Footer = () => {
  const { siteSettings, openPhoneDialer } = useContent();

  const businessName = siteSettings.business_name || 'Nutribox';
  const email = siteSettings.contact_email || 'hello@nutribox.com';
  const address = siteSettings.contact_address || '123 Green Avenue, Fresh Meadows, CA 90210';
  const hours = siteSettings.business_hours || 'Mon - Sat: 8:00 AM - 6:00 PM';
  const footerText = siteSettings.footer_text || `© ${new Date().getFullYear()} Nutribox. Fresh & Healthy Salad Subscriptions.`;

  const getCleanWhatsappLink = () => {
    if (!siteSettings.social_whatsapp) return '#';
    const cleanNum = siteSettings.social_whatsapp.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  const renderPhones = () => {
    const phoneString = siteSettings.contact_phone || '';
    const phones = phoneString.split(',').map(p => p.trim()).filter(Boolean);
    if (phones.length === 0) return <span>+91 94299 29822</span>;
    
    return (
      <button 
        onClick={() => openPhoneDialer(phoneString)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
          fontSize: '14px',
          fontFamily: 'inherit',
          display: 'inline-flex',
          alignItems: 'center',
          transition: 'color var(--transition-smooth)'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
      >
        {phones.join(' | ')}
      </button>
    );
  };

  return (
    <footer id="contact" style={{
      backgroundColor: 'var(--primary-dark)',
      color: '#ffffff',
      padding: '80px 0 30px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative leafy overlay */}
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '-30px',
        opacity: 0.05,
        color: '#ffffff',
        transform: 'rotate(-25deg)',
        zIndex: 0
      }}>
        <Leaf size={240} style={{ fill: 'currentColor' }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '48px',
          textAlign: 'left',
          marginBottom: '60px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              <Leaf style={{ width: '28px', height: '28px', fill: 'currentColor' }} />
              <span style={{ color: '#ffffff' }}>{businessName}</span>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              lineHeight: 1.6,
              maxWidth: '300px',
              marginBottom: '24px'
            }}>
              Crafting premium healthy salads & meal combinations designed to fuel your day with vitality and nutrients. Wholesome ingredients, zero compromises.
            </p>
            
            {/* Social Icons row */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {siteSettings.social_whatsapp && (
                <a 
                  href={getCleanWhatsappLink()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={socialIconStyle} 
                  title="WhatsApp Chat"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </a>
              )}
              {siteSettings.social_instagram && (
                <a 
                  href={siteSettings.social_instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={socialIconStyle} 
                  title="Instagram Page"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{
              fontSize: '18px',
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              Get In Touch
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <Phone size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                {renderPhones()}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <Mail size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <MapPin size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Delivery & Hours */}
          <div>
            <h4 style={{
              fontSize: '18px',
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              Delivery Hours
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <Clock size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{hours}</span>
              </li>
              <li style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                All orders are prepared fresh at 5:00 AM each morning and dispatched for delivery in temperature-controlled boxes.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <p>{footerText}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600 }}>
              Admin Panel
            </Link>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Made with <Heart size={12} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} /> for organic living.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const socialIconStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-smooth)',
  cursor: 'pointer'
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Leaf, Heart } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Footer = () => {
  const { siteSettings } = useContent();

  const businessName = siteSettings.business_name || 'Nutribox';
  const email = siteSettings.contact_email || 'hello@nutribox.com';
  const phone = siteSettings.contact_phone || '+1 (555) 123-4567';
  const address = siteSettings.contact_address || '123 Green Avenue, Fresh Meadows, CA 90210';
  const hours = siteSettings.business_hours || 'Mon - Sat: 8:00 AM - 6:00 PM';

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
              Crafting premium subscription salad plans designed to fuel your day with vitality and nutrients. Wholesome ingredients, zero compromises.
            </p>
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
                <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a>
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
          <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
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

export default Footer;

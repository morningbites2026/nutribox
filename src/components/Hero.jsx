import React from 'react';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Hero = () => {
  const { siteSettings } = useContent();

  const title = siteSettings.hero_title || 'Fresh, Chef-Crafted Salad Plans Delivered to Your Door';
  const subtitle = siteSettings.hero_subtitle || 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.';
  const businessName = siteSettings.business_name || 'Nutribox';

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" style={{
      padding: '160px 0 100px 0',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Blur Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(40px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(30px)',
        zIndex: -1
      }} />

      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Content */}
        <div className="animate-fade-in-up" style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} />
            <span>100% Organic & Locally Sourced</span>
          </div>

          <h1 className="font-serif" style={{
            fontSize: '52px',
            lineHeight: 1.15,
            color: 'var(--text-main)',
            marginBottom: '24px',
            fontWeight: 700
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-muted)',
            marginBottom: '38px',
            lineHeight: 1.6,
            maxWidth: '540px'
          }}>
            {subtitle}
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <button 
              onClick={() => scrollToSection('plans')} 
              className="btn btn-primary"
            >
              Explore Salad Plans
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => scrollToSection('bowl-builder')} 
              className="btn btn-secondary"
            >
              Build Your Own Bowl
            </button>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'flex',
            gap: '40px',
            marginTop: '48px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px'
          }}>
            <div>
              <h4 style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: 700 }}>15+</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Daily Ingredients</p>
            </div>
            <div>
              <h4 style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: 700 }}>100%</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Eco-Friendly Packaging</p>
            </div>
            <div>
              <h4 style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: 700 }}>0</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Preservatives / Additives</p>
            </div>
          </div>
        </div>

        {/* Right Graphic Section */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Main Visual */}
          <div className="animate-float" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '8px solid var(--card-bg)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
              alt="Premium Salad bowl from Nutribox" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Overlay Floating Glass Card */}
          <div className="glass" style={{
            position: 'absolute',
            bottom: '20px',
            left: '-20px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '240px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>Always Fresh</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Harvested & delivered daily</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Inline styles for media queries */}
      <style>{`
        @media (max-width: 768px) {
          #hero {
            padding: 100px 0 60px 0;
            text-align: center;
          }
          #hero .container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          #hero .animate-fade-in-up {
            text-align: center;
          }
          #hero div[style*="display: flex; gap: 40px"] {
            justify-content: center;
          }
          #hero div[style*="left: -20px"] {
            left: 50% !important;
            transform: translateX(-50%) !important;
            bottom: -20px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

import React from 'react';

const WeeklySchedule = () => {
  const commitments = [
    {
      title: 'DIGITAL MEAL TRACKING',
      subtitle: 'Track. Monitor. Achieve.',
      description: 'Easily monitor your daily caloric intake and nutritional goals on the go.',
      icon: (
        <svg viewBox="0 0 100 100" width="64" height="64" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <rect x="36" y="24" width="28" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
          <rect x="42" y="52" width="4" height="14" fill="currentColor" />
          <rect x="48" y="44" width="4" height="22" fill="currentColor" />
          <rect x="54" y="36" width="4" height="30" fill="currentColor" />
          <line x1="47" y1="28" x2="53" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="70" r="2.5" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'SCHEDULE YOUR MEAL DAY WISE',
      subtitle: 'Flexible & Customized Planning.',
      description: 'Choose which days of the week you want your fresh salads delivered.',
      icon: (
        <svg viewBox="0 0 100 100" width="64" height="64" style={{ color: 'var(--accent)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3.5" />
          {/* Calendar outline */}
          <rect x="28" y="28" width="44" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
          <line x1="28" y1="42" x2="72" y2="42" stroke="currentColor" strokeWidth="3.5" />
          {/* Calendar binder rings */}
          <line x1="40" y1="20" x2="40" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="20" x2="60" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          {/* Calendar checkboxes / slots */}
          <rect x="36" y="48" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="47" y="48" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="58" y="48" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="36" y="58" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="47" y="58" width="6" height="6" rx="1" fill="currentColor" />
          <rect x="58" y="58" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'FRESH INGREDIENTS',
      subtitle: 'Pure. Natural. Wholesome.',
      description: 'Handpicked organic greens, fruits, and seeds sourced fresh every morning.',
      icon: (
        <svg viewBox="0 0 100 100" width="64" height="64" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <path d="M35,65 C35,45 45,35 65,35 C65,55 55,65 35,65 Z" fill="currentColor" opacity="0.85" />
          <path d="M45,65 C45,55 50,50 60,45" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M28,52 C32,42 42,32 52,28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      title: 'NO PRESERVATIVES',
      subtitle: 'Clean food. Real good.',
      description: '100% natural salad bowls prepared fresh with zero artificial additives.',
      icon: (
        <svg viewBox="0 0 100 100" width="64" height="64" style={{ color: 'var(--accent)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <path d="M35,32 C45,32 50,26 50,26 C50,26 55,32 65,32 C65,50 50,68 50,68 C50,68 35,50 35,32 Z" fill="currentColor" opacity="0.85" />
          <path d="M44,48 L48,52 L56,42" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section style={{
      padding: '80px 0',
      backgroundColor: 'var(--primary-light)',
      fontFamily: 'var(--font-sans)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container">
        
        {/* Banner Glass card */}
        <div className="glass-card" style={{
          padding: '50px 40px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          
          {/* Section Header */}
          <div style={{ maxWidth: '600px', margin: '0 auto 48px auto' }}>
            <h2 className="font-serif" style={{
              fontSize: '32px',
              color: 'var(--primary-dark)',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              Our Core Quality Commitments
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>
              At Nutribox, we design meal plans with absolute focus on raw nutrient density, convenience, and health tracking.
            </p>
          </div>

          {/* Grid of 4 Key Commitments */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px'
          }}>
            {commitments.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '28px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-color)',
                  transition: 'var(--transition-smooth)',
                  cursor: 'default'
                }}
                className="feature-banner-item"
              >
                {/* SVG Icon */}
                <div style={{
                  marginBottom: '20px',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} className="feature-banner-icon">
                  {item.icon}
                </div>

                {/* Text Details */}
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '0.5px',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  {item.title}
                </h4>

                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  {item.subtitle}
                </span>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Interactivity Styles */}
      <style>{`
        .feature-banner-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-medium);
          background-color: var(--card-bg) !important;
        }
        .feature-banner-item:hover .feature-banner-icon {
          transform: scale(1.1) rotate(2deg);
        }
      `}</style>
    </section>
  );
};

export default WeeklySchedule;

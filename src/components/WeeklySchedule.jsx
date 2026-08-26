import React from 'react';

const WeeklySchedule = () => {
  const scheduleDays = [
    { day: 'MONDAY', salad: 'Chickpea Crunch Salad', type: 'chickpea' },
    { day: 'TUESDAY', salad: 'Sprouts Salad', type: 'sprouts' },
    { day: 'WEDNESDAY', salad: 'Chickpea Crunch Salad', type: 'chickpea' },
    { day: 'THURSDAY', salad: 'Sprouts Salad', type: 'sprouts' },
    { day: 'FRIDAY', salad: 'Chickpea Crunch Salad', type: 'chickpea' },
    { day: 'SATURDAY', salad: 'Sprouts Salad', type: 'sprouts' },
  ];

  const features = [
    {
      title: 'FRESH INGREDIENTS',
      subtitle: 'Pure. Natural. Wholesome.',
      icon: (
        <svg viewBox="0 0 100 100" width="60" height="60" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M35,65 C35,45 45,35 65,35 C65,55 55,65 35,65 Z" fill="currentColor" opacity="0.85" />
          <path d="M45,65 C45,55 50,50 60,45" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28,52 C32,42 42,32 52,28" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      title: 'HIGH PROTEIN',
      subtitle: 'Fuel your body right.',
      icon: (
        <svg viewBox="0 0 100 100" width="60" height="60" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          {/* Strong Bicep Silhouette */}
          <path d="M50,70 C38,70 32,58 35,48 C37,42 43,40 48,42 C51,35 58,30 65,34 C72,38 72,48 68,55 C70,62 65,70 50,70 Z" fill="currentColor" opacity="0.85" />
          <path d="M42,48 C42,48 46,54 53,52" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      title: 'DIGITAL MEAL TRACKING',
      subtitle: 'Track. Monitor. Achieve.',
      icon: (
        <svg viewBox="0 0 100 100" width="60" height="60" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          {/* Smartphone Outline */}
          <rect x="36" y="24" width="28" height="52" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
          {/* Graph bars inside phone */}
          <rect x="42" y="52" width="4" height="14" fill="currentColor" />
          <rect x="48" y="44" width="4" height="22" fill="currentColor" />
          <rect x="54" y="36" width="4" height="30" fill="currentColor" />
          {/* Phone speaker/button */}
          <line x1="47" y1="28" x2="53" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="70" r="2" fill="currentColor" />
        </svg>
      )
    },
    {
      title: 'NO PRESERVATIVES',
      subtitle: 'Clean food. Real good.',
      icon: (
        <svg viewBox="0 0 100 100" width="60" height="60" style={{ color: 'var(--primary)' }}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          {/* Clean Shield & Leaf */}
          <path d="M35,32 C45,32 50,26 50,26 C50,26 55,32 65,32 C65,50 50,68 50,68 C50,68 35,50 35,32 Z" fill="currentColor" opacity="0.85" />
          <path d="M44,48 L48,52 L56,42" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <section style={{
      padding: '80px 0',
      backgroundColor: 'var(--bg-color)',
      fontFamily: 'var(--font-sans)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container">
        
        {/* Outer Glass Container */}
        <div className="glass-card" style={{
          padding: '40px 30px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          
          {/* Weekly Schedule Section */}
          <div style={{ marginBottom: '50px' }}>
            
            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
              <svg width="24" height="16" viewBox="0 0 24 16" fill="var(--primary)" style={{ transform: 'scaleX(-1)' }}>
                <path d="M2,14 C6,12 10,8 11,4 C11,4 7,8 2,10 C1,10.5 0,11 0,12 C0,13 1,14 2,14 Z" />
                <path d="M8,15 C11,13 13,10 14,7 C14,7 11,10 7,11.5 C6,12 5.5,12.5 5.5,13.5 C5.5,14.5 6.5,15 8,15 Z" />
              </svg>
              
              <div style={{
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                padding: '8px 24px',
                borderRadius: 'var(--radius-full)',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '2px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                WEEKLY SCHEDULE
              </div>

              <svg width="24" height="16" viewBox="0 0 24 16" fill="var(--primary)">
                <path d="M2,14 C6,12 10,8 11,4 C11,4 7,8 2,10 C1,10.5 0,11 0,12 C0,13 1,14 2,14 Z" />
                <path d="M8,15 C11,13 13,10 14,7 C14,7 11,10 7,11.5 C6,12 5.5,12.5 5.5,13.5 C5.5,14.5 6.5,15 8,15 Z" />
              </svg>
            </div>

            {/* Horizontal Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-color)',
              marginBottom: '24px'
            }} className="schedule-grid">
              
              {scheduleDays.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{
                    padding: '24px 16px',
                    borderRight: idx < 5 ? '1px solid var(--border-color)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="schedule-day-column"
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: 'var(--primary)',
                    textTransform: 'uppercase'
                  }}>
                    {item.day}
                  </span>

                  {/* SVG Custom Icons */}
                  <div style={{
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.type === 'chickpea' ? 'var(--accent)' : 'var(--primary)',
                    transition: 'transform 0.3s ease'
                  }} className="day-icon">
                    {item.type === 'chickpea' ? (
                      // Golden-yellow Chickpea Flower/Seed icon
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
                        <circle cx="12" cy="7" r="3" />
                        <circle cx="8" cy="11" r="3" />
                        <circle cx="16" cy="11" r="3" />
                        <circle cx="10" cy="16" r="3" />
                        <circle cx="14" cy="16" r="3" />
                      </svg>
                    ) : (
                      // Green Seedling Sprouts Leaf icon
                      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12,22 L12,12" />
                        <path d="M12,12 C12,12 8,10 6,12 C4,14 6,17 12,16" fill="currentColor" opacity="0.15" />
                        <path d="M12,12 C12,12 8,10 6,12 C4,14 6,17 12,16 Z" />
                        <path d="M12,15 C12,15 16,13 18,15 C20,17 18,20 12,19 Z" fill="currentColor" opacity="0.15" />
                        <path d="M12,15 C12,15 16,13 18,15 C20,17 18,20 12,19 Z" />
                      </svg>
                    )}
                  </div>

                  <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: '1.3',
                    color: 'var(--text-main)',
                    maxWidth: '120px'
                  }}>
                    {item.salad}
                  </span>
                </div>
              ))}
            </div>

            {/* Sunday Rest Day */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="12" viewBox="0 0 24 16" fill="var(--primary)" style={{ transform: 'scaleX(-1)', opacity: 0.7 }}>
                <path d="M2,14 C6,12 10,8 11,4 C11,4 7,8 2,10 C1,10.5 0,11 0,12 C0,13 1,14 2,14 Z" />
              </svg>
              <div style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--border-color)',
                padding: '8px 28px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                SUNDAY • REST DAY
                <span style={{ color: 'var(--danger)', fontSize: '14px' }}>♥</span>
              </div>
              <svg width="20" height="12" viewBox="0 0 24 16" fill="var(--primary)" style={{ opacity: 0.7 }}>
                <path d="M2,14 C6,12 10,8 11,4 C11,4 7,8 2,10 C1,10.5 0,11 0,12 C0,13 1,14 2,14 Z" />
              </svg>
            </div>

          </div>

          {/* Divider Line */}
          <div style={{
            height: '1px',
            backgroundColor: 'var(--border-color)',
            margin: '0 -30px 45px -30px'
          }} />

          {/* Key Commitments / Features Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px'
          }}>
            {features.map((feature, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  textAlign: 'left',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition-smooth)'
                }}
                className="commitment-item"
              >
                {/* Vector Icon */}
                <div style={{ flexShrink: 0, transition: 'transform 0.3s ease' }} className="commitment-icon">
                  {feature.icon}
                </div>

                {/* Details */}
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    color: 'var(--text-main)',
                    marginBottom: '4px'
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    margin: 0
                  }}>
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Hover & Responsive CSS styles */}
      <style>{`
        .schedule-day-column:hover {
          background-color: var(--card-bg) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .schedule-day-column:hover .day-icon {
          transform: scale(1.15);
        }
        .commitment-item:hover {
          background-color: var(--bg-color);
        }
        .commitment-item:hover .commitment-icon {
          transform: scale(1.08) rotate(3deg);
        }
        @media (max-width: 992px) {
          .schedule-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .schedule-day-column {
            border-bottom: 1px solid var(--border-color);
          }
          .schedule-day-column:nth-child(3n) {
            border-right: none !important;
          }
          .schedule-day-column:nth-child(4),
          .schedule-day-column:nth-child(5),
          .schedule-day-column:nth-child(6) {
            border-bottom: none !important;
          }
        }
        @media (max-width: 600px) {
          .schedule-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .schedule-day-column {
            border-bottom: 1px solid var(--border-color) !important;
            border-right: 1px solid var(--border-color) !important;
          }
          .schedule-day-column:nth-child(2n) {
            border-right: none !important;
          }
          .schedule-day-column:nth-child(5),
          .schedule-day-column:nth-child(6) {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WeeklySchedule;

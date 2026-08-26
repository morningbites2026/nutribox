import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';

const WeeklySchedule = () => {
  const { salads, siteSettings } = useContent();

  // State for custom meal selections: object mapping saladId to variant ('half', 'full', or null)
  const [customSelections, setCustomSelections] = useState({});

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
          <rect x="28" y="28" width="44" height="44" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
          <line x1="28" y1="42" x2="72" y2="42" stroke="currentColor" strokeWidth="3.5" />
          <line x1="40" y1="20" x2="40" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="20" x2="60" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
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

  // Handle toggling of salad variant choice in Custom Builder
  const handleToggleVariant = (saladId, variant) => {
    setCustomSelections(prev => {
      const current = prev[saladId];
      if (current === variant) {
        // Deselect if clicking the same choice
        const copy = { ...prev };
        delete copy[saladId];
        return copy;
      } else {
        return {
          ...prev,
          [saladId]: variant
        };
      }
    });
  };

  // Calculations for custom meal builder
  const getSelectedItems = () => {
    return Object.keys(customSelections).map(id => {
      const salad = salads.find(s => s.id === id);
      const variant = customSelections[id];
      if (!salad || !variant) return null;
      const price = variant === 'half' ? salad.price_half : salad.price_full;
      return { salad, variant, price };
    }).filter(Boolean);
  };

  const selectedItems = getSelectedItems();
  const selectedCount = selectedItems.length;

  const calculateCustomPrice = () => {
    if (selectedCount === 0) return 0;
    return selectedItems.reduce((acc, item) => acc + item.price, 0);
  };

  const calculatedPrice = calculateCustomPrice();

  const handleOrderCustomPlan = () => {
    if (selectedCount === 0) return;

    const rawNum = siteSettings.social_whatsapp || '+91 94299 29822';
    const cleanNum = rawNum.replace(/[^\d]/g, '');

    const saladsLines = selectedItems.map(
      item => `• ${item.salad.title} (${item.variant === 'half' ? 'Half Pack' : 'Full Pack'} - ₹${item.price})`
    ).join('\n');

    const messageText = `Hello ${siteSettings.business_name || 'Nutribox'}!\n\nI would like to order a Custom 10-Meal Subscription Plan.\n\nIncluded Recipes:\n${saladsLines}\n\nFixed Portions: 10 Meals\nEstimated Price: *₹${calculatedPrice}*\n\nPlease confirm my custom delivery schedule!`;
    
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      backgroundColor: 'var(--primary-light)',
      padding: '80px 0',
      fontFamily: 'var(--font-sans)'
    }}>
      
      {/* SECTION 1: Core Commitments Banner */}
      <div className="container">
        <div className="glass-card" style={{
          padding: '50px 40px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>
          
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
                <div style={{
                  marginBottom: '20px',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }} className="feature-banner-icon">
                  {item.icon}
                </div>

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

      {/* SECTION 2: Custom Meal Plan Builder Banner */}
      <div className="container">
        <div className="glass-card" style={{
          padding: '50px 40px',
          backgroundColor: 'var(--card-bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'left'
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }} className="builder-layout">
            
            {/* Left Column: Salad Checklist */}
            <div>
              <span style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '16px'
              }}>
                INTERACTIVE CALCULATOR
              </span>

              <h2 className="font-serif" style={{
                fontSize: '32px',
                color: 'var(--primary-dark)',
                fontWeight: 700,
                marginBottom: '12px',
                lineHeight: '1.2'
              }}>
                Design your meal in your own way
              </h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', maxWidth: '640px' }}>
                Build a customized 10-meal subscription combo. Select the recipes and portions you would like to include, and we will compute your tailored package pricing instantly.
              </p>

              {/* Salads list selection block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {salads.map(salad => {
                  const supportsHalf = salad.variant_support === 'half' || salad.variant_support === 'both';
                  const supportsFull = salad.variant_support === 'full' || salad.variant_support === 'both';
                  const currentSelection = customSelections[salad.id];

                  return (
                    <div 
                      key={salad.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: currentSelection ? 'var(--primary-light)' : 'var(--bg-color)',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="builder-salad-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={salad.image_url} 
                          alt={salad.title} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                            {salad.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {salad.tags?.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Variant Selection Pills */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {supportsHalf && (
                          <button
                            type="button"
                            onClick={() => handleToggleVariant(salad.id, 'half')}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid',
                              borderColor: currentSelection === 'half' ? 'var(--primary)' : 'var(--border-color)',
                              backgroundColor: currentSelection === 'half' ? 'var(--primary)' : 'var(--card-bg)',
                              color: currentSelection === 'half' ? '#ffffff' : 'var(--text-muted)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            Half Pack (₹{salad.price_half})
                          </button>
                        )}
                        {supportsFull && (
                          <button
                            type="button"
                            onClick={() => handleToggleVariant(salad.id, 'full')}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid',
                              borderColor: currentSelection === 'full' ? 'var(--primary)' : 'var(--border-color)',
                              backgroundColor: currentSelection === 'full' ? 'var(--primary)' : 'var(--card-bg)',
                              color: currentSelection === 'full' ? '#ffffff' : 'var(--text-muted)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'var(--transition-smooth)'
                            }}
                          >
                            Full Pack (₹{salad.price_full})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Pricing Summary Card */}
            <div>
              <div className="glass-card" style={{
                position: 'sticky',
                top: '100px',
                padding: '30px',
                backgroundColor: 'var(--bg-color)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
                  Custom Plan Summary
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Total Meals</span>
                  <span style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 700 }}>10 Meals (Fixed)</span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Selected Salads ({selectedCount})
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {selectedItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          {item.salad.title}
                        </span>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {item.variant === 'half' ? 'Half' : 'Full'}
                        </span>
                      </div>
                    ))}
                    {selectedCount === 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No items selected. Choose portion sizes on the left to start.
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--card-bg)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Estimated Combo Price
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{calculatedPrice}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOrderCustomPlan}
                  disabled={selectedCount === 0}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px',
                    opacity: selectedCount === 0 ? 0.6 : 1,
                    cursor: selectedCount === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Order Custom Combo
                </button>
              </div>
            </div>

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
        @media (max-width: 992px) {
          .builder-layout {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
          .builder-salad-row {
            flex-direction: column !important;
            align-items: start !important;
            gap: 16px !important;
          }
          .builder-salad-row div {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WeeklySchedule;

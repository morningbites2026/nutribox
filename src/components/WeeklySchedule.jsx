import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';

const WeeklySchedule = () => {
  const { salads, saladPlans, siteSettings, recordInquiry } = useContent();

  // State for custom meal selections: array of selected Salad Plan IDs
  const [selectedPlanIds, setSelectedPlanIds] = useState([]);

  // Popup Modal states for Order Custom Plan
  const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);
  const [packageName, setPackageName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('Please share delivery slots for this custom combination!');

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

  // Helper: resolve and format associated salad titles for any plan
  const getAssociatedSaladsText = (plan) => {
    if (!plan.salad_items || plan.salad_items.length === 0) return '';
    const titles = plan.salad_items.map(item => {
      const [saladId] = item.split(':');
      const salad = salads.find(s => s.id === saladId);
      return salad ? salad.title : '';
    }).filter(Boolean);
    return titles.join(', ');
  };

  // Filter plans based on admin-defined calculator setups
  const getFilteredPlans = () => {
    const featuredStr = siteSettings.calculator_featured_plans || '';
    const featuredIds = featuredStr.split(',').map(id => id.trim()).filter(Boolean);
    if (featuredIds.length === 0) return saladPlans;
    return saladPlans.filter(p => featuredIds.includes(p.id));
  };

  const filteredPlans = getFilteredPlans();

  // Toggle selection state for a plan
  const handleTogglePlan = (planId) => {
    setSelectedPlanIds(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  // Selection calculations
  const selectedPlans = saladPlans.filter(p => selectedPlanIds.includes(p.id));
  const selectedCount = selectedPlans.length;
  const calculatedPrice = selectedPlans.reduce((acc, p) => acc + p.price, 0);

  // Trigger popup to name package and write query
  const handleOpenPopup = () => {
    if (selectedCount === 0) return;
    setIsOrderPopupOpen(true);
  };

  // Final Action: Send to database and redirect to WhatsApp
  const handleOrderCustomPlan = async (e) => {
    e.preventDefault();
    if (selectedCount === 0 || !packageName || !clientPhone) return;

    // Log the lead in the database
    try {
      await recordInquiry({
        phone_number: clientPhone,
        source_path: window.location.pathname || '/',
        submitted_data: {
          inquiry_type: 'Custom Calculator Order',
          custom_package_name: packageName,
          selected_plans: selectedPlans.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price
          })),
          total_price: calculatedPrice,
          message: clientMessage
        }
      });
    } catch (err) {
      console.error("Failed to insert lead inquiry logs:", err);
    }

    const rawNum = siteSettings.calculator_whatsapp || siteSettings.social_whatsapp || '+91 94299 29822';
    const cleanNum = rawNum.replace(/[^\d]/g, '');

    const plansLines = selectedPlans.map(
      p => `• ${p.title} (${p.plan_type === 'individual' ? 'Individual' : 'Combo'} - ₹${p.price})`
    ).join('\n');

    const messageText = `Hello ${siteSettings.business_name || 'Nutribox'}!\n\nI want to order a Custom Salad Plan named: *${packageName}*.\n\nSelected Plans:\n${plansLines}\n\nTotal Price: *₹${calculatedPrice}*\nMy Phone: ${clientPhone}\nQuery: ${clientMessage}`;
    
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Reset state & close
    setPackageName('');
    setClientPhone('');
    setSelectedPlanIds([]);
    setIsOrderPopupOpen(false);
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
            
            {/* Left Column: Salad Plan Checklist */}
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
                Select and combine multiple pre-configured salad plans to build your custom subscription combo package. Live pricing updates instantly.
              </p>

              {/* Plans list selection block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredPlans.map(plan => {
                  const isSelected = selectedPlanIds.includes(plan.id);
                  const isCombo = plan.plan_type === 'combo';
                  const associatedSalads = getAssociatedSaladsText(plan);

                  return (
                    <div 
                      key={plan.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-color)',
                        transition: 'var(--transition-smooth)'
                      }}
                      className="builder-salad-row"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={plan.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'} 
                          alt={plan.title} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                              {plan.title}
                            </h4>
                            <span className="badge" style={{ 
                              fontSize: '9px', 
                              padding: '2px 8px', 
                              backgroundColor: isCombo ? 'rgba(59, 130, 246, 0.1)' : 'var(--primary-light)',
                              color: isCombo ? '#2563eb' : 'var(--primary)'
                            }}>
                              {isCombo ? 'Combo' : 'Individual'}
                            </span>
                          </div>
                          
                          {/* Conditional Description: If Combo, show ONLY associated salads list. Otherwise show default plan description */}
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                            {isCombo 
                              ? `Includes: ${associatedSalads || 'Salads loading...'}` 
                              : plan.description}
                          </span>
                        </div>
                      </div>

                      {/* Select / Add Button */}
                      <div>
                        <button
                          type="button"
                          onClick={() => handleTogglePlan(plan.id)}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                            color: isSelected ? '#ffffff' : 'var(--primary)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          {isSelected ? 'Selected' : `Add Plan (₹${plan.price})`}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredPlans.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No featured calculator plans are currently active. Update them in the Admin Panel Calculator Setup tab.
                  </div>
                )}
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

                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Selected Salad Plans ({selectedCount})
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {selectedPlans.map((plan, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px', fontWeight: 600 }}>
                          {plan.title}
                        </span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          ₹{plan.price}
                        </span>
                      </div>
                    ))}
                    {selectedCount === 0 && (
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No plans selected. Add plans on the left to start.
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
                    Estimated Total Price
                  </span>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>
                    ₹{calculatedPrice}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPopup}
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
                  Order Custom Plan
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* POPUP MODAL: Customize / Package Name Modal */}
      {isOrderPopupOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            backgroundColor: 'var(--card-bg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsOrderPopupOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              &times;
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
              Finalize Custom Combo
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Name your custom package and provide your contact phone to complete registration. This logs your lead and opens WhatsApp.
            </p>

            <form onSubmit={handleOrderCustomPlan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-input-group">
                <label className="admin-label" style={{ fontWeight: 600 }}>Custom Package Name *</label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. My Veggie Special, Workout Pack"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ fontWeight: 600 }}>Your Phone Number *</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. +91 94299 29822"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label" style={{ fontWeight: 600 }}>Query Message / Instructions</label>
                <textarea
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  placeholder="Add delivery slots or notes..."
                  className="admin-textarea"
                  style={{ minHeight: '80px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsOrderPopupOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', fontWeight: 700 }}
                >
                  Send & WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { X, Send, PhoneCall, AlertTriangle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WeeklySchedule, { MealCalculator } from './components/WeeklySchedule';
import Plans from './components/Plans';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { useContent } from './context/ContentContext';

function LandingPage() {
  const { 
    activeSubscribePlan, setActiveSubscribePlan, 
    activeDialerPhones, setActiveDialerPhones, 
    saladPlans, siteSettings, recordInquiry,
    activeTrackerOpen, setActiveTrackerOpen,
    subscriptions
  } = useContent();

  const [selectedPlan, setSelectedPlan] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [queryMessage, setQueryMessage] = useState('Hi, I am interested in subscribing to this salad plan! Please let me know the daily delivery slots and payment details.');

  // Tracker state variables
  const [phoneInput, setPhoneInput] = useState('');
  const [trackerResult, setTrackerResult] = useState(null); // null, 'not_found', or subscription object

  // Sync selected dropdown plan with the plan clicked by user
  useEffect(() => {
    if (activeSubscribePlan) {
      setSelectedPlan(activeSubscribePlan);
    }
  }, [activeSubscribePlan]);

  const handleWhatsAppSend = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Log inquiry in DB/LocalStorage
    try {
      await recordInquiry({
        phone_number: clientPhone,
        source_path: window.location.pathname || '/',
        submitted_data: {
          inquiry_type: 'Standard Plan Subscription',
          plan_name: selectedPlan,
          message: queryMessage
        }
      });
    } catch (err) {
      console.error("Failed to log inquiry:", err);
    }

    // Clean phone number from settings, fallback to user-specified default if not present
    const rawNum = siteSettings.social_whatsapp || '+91 94299 29822';
    const cleanNum = rawNum.replace(/[^\d]/g, '');

    const messageText = `Hello ${siteSettings.business_name || 'Nutribox'}!\n\nI would like to subscribe to the plan: *${selectedPlan}*.\n\nMy Phone: ${clientPhone}\nHere is my query:\n${queryMessage}`;
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    setClientPhone('');
    setActiveSubscribePlan(null); // Close modal
  };

  const handlePhoneDial = (num) => {
    const cleanNum = num.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNum}`;
    setActiveDialerPhones(null); // Close modal
  };

  const handleTrackerSearch = (e) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    const cleanedInput = phoneInput.replace(/[^\d]/g, '');
    if (cleanedInput.length < 8) {
      alert('Please enter a valid mobile number (at least 8 digits).');
      return;
    }

    const matches = (subscriptions || []).filter(sub => {
      const cleanedSubPhone = (sub.phone_number || '').replace(/[^\d]/g, '');
      return cleanedSubPhone && cleanedInput && 
             (cleanedSubPhone.includes(cleanedInput) || cleanedInput.includes(cleanedSubPhone)) &&
             sub.allow_tracking === true;
    });

    if (matches.length > 0) {
      setTrackerResult(matches);
    } else {
      setTrackerResult('not_found');
    }
  };

  const closeTracker = () => {
    setActiveTrackerOpen(false);
    setPhoneInput('');
    setTrackerResult(null);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <WeeklySchedule />
      <Plans />
      <MealCalculator />
      <Footer />

      {/* GLOBAL MODAL 1: Subscribe / Inquiry Modal */}
      {activeSubscribePlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1500,
          padding: '20px',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div className="glass-card" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            textAlign: 'left',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setActiveSubscribePlan(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
              Subscribe / Inquire Plan
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Confirm your selected plan and write down any queries. This will direct you to WhatsApp to place your order.
            </p>

            <form onSubmit={handleWhatsAppSend}>
              <div className="admin-input-group">
                <label className="admin-label" style={{ fontWeight: 600 }}>Plan Name *</label>
                <select 
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="admin-input"
                  style={{ height: '45px', width: '100%' }}
                  required
                >
                  <option value="" disabled>Select a Plan</option>
                  {saladPlans.map(plan => (
                    <option key={plan.id} value={plan.title}>
                      {plan.title} (₹{plan.price} / {plan.meals_count} meals)
                    </option>
                  ))}
                  {selectedPlan && !saladPlans.some(p => p.title === selectedPlan) && (
                    <option value={selectedPlan}>
                      {selectedPlan}
                    </option>
                  )}
                </select>
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
                <label className="admin-label" style={{ fontWeight: 600 }}>Query Description *</label>
                <textarea 
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  placeholder="Enter details like custom address, preferred delivery time slots, or diet restrictions..."
                  className="admin-textarea"
                  style={{ minHeight: '120px', width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setActiveSubscribePlan(null)} 
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} />
                  Send Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 2: Multiple Phone Selection Dialog */}
      {activeDialerPhones && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1500,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-card" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            textAlign: 'center',
            animation: 'fadeInUp 0.25s ease-out'
          }}>
            <button 
              onClick={() => setActiveDialerPhones(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <PhoneCall size={22} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Select Contact Number
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              We have multiple numbers configured. Choose one to open your phone dialer:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeDialerPhones.map((phone, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePhoneDial(phone)}
                  className="btn btn-secondary"
                  style={{
                    padding: '12px',
                    width: '100%',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    backgroundColor: 'var(--primary-light)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  <PhoneCall size={14} />
                  {phone}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveDialerPhones(null)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '16px', padding: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL 3: Subscription Tracker Modal */}
      {activeTrackerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1500,
          padding: '20px',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div className="glass-card" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            textAlign: 'left',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            {/* Close Button */}
            <button 
              onClick={closeTracker}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>

            {/* SCREEN 1: Search Form */}
            {!trackerResult && (
              <form onSubmit={handleTrackerSearch}>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
                  Track My Subscription
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Enter your registered mobile number below to see your ongoing plans, meals count, and active subscription status.
                </p>

                <div className="admin-input-group" style={{ marginBottom: '24px' }}>
                  <label className="admin-label" style={{ fontWeight: 600 }}>Mobile Number *</label>
                  <input 
                    type="tel" 
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. +91 94299 29822"
                    className="admin-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    type="button" 
                    onClick={closeTracker}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    Track Status
                  </button>
                </div>
              </form>
            )}

            {/* SCREEN 2: Not Found */}
            {trackerResult === 'not_found' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <AlertTriangle size={32} />
                </div>
                
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  No Subscription Found
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                  We couldn't locate any active subscriptions registered with <strong>{phoneInput}</strong>. 
                  Please check the number or message us on WhatsApp to register your plan.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setTrackerResult(null); setPhoneInput(''); }}
                    className="btn btn-primary"
                    style={{ padding: '12px' }}
                  >
                    Try Another Number
                  </button>
                  
                  {/* WhatsApp Support Link */}
                  {(() => {
                    const rawNum = siteSettings.social_whatsapp || '+91 94299 29822';
                    const cleanNum = rawNum.replace(/[^\d]/g, '');
                    const message = encodeURIComponent(`Hi, I tried to track my salad subscription with number ${phoneInput} but it wasn't found. Can you please check my registration?`);
                    return (
                      <a 
                        href={`https://wa.me/${cleanNum}?text=${message}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ 
                          padding: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '8px',
                          borderColor: 'var(--primary)',
                          color: 'var(--primary)',
                          backgroundColor: 'var(--primary-light)'
                        }}
                      >
                        Contact Support on WhatsApp
                      </a>
                    );
                  })()}

                  <button 
                    type="button" 
                    onClick={closeTracker}
                    className="btn btn-secondary"
                    style={{ padding: '10px' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: Subscriber Details found */}
            {/* SCREEN 3: Subscriber Details found */}
            {Array.isArray(trackerResult) && (() => {
              const list = trackerResult;
              const customerName = list[0]?.customer_name || 'Customer';
              const phoneNumber = list[0]?.phone_number || '';

              return (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                    Active Subscriptions
                  </h3>

                  {/* Customer General Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{customerName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Registered Phone:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{phoneNumber}</strong>
                    </div>
                  </div>

                  {/* Subscriptions List Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                    {list.map((sub, index) => {
                      const total = sub.meals_total;
                      const remaining = sub.meals_remaining;
                      const used = Math.max(0, total - remaining);
                      const percent = Math.min(100, Math.max(0, (used / total) * 100));

                      // Custom status display
                      let statusText = 'Active';
                      let statusBg = 'var(--primary-light)';
                      let statusColor = 'var(--primary)';

                      if (sub.status === 'hold') {
                        statusText = 'On Hold';
                        statusBg = '#fef3c7';
                        statusColor = '#d97706';
                      } else if (sub.status === 'done') {
                        statusText = 'Done';
                        statusBg = '#f3f4f6';
                        statusColor = '#6b7280';
                      } else if (sub.status === 'low') {
                        statusText = 'Low';
                        statusBg = '#fee2e2';
                        statusColor = '#ef4444';
                      } else if (sub.status === 'cancelled') {
                        statusText = 'Cancelled';
                        statusBg = '#f3f4f6';
                        statusColor = '#9ca3af';
                      }

                      return (
                        <div key={sub.id || index} style={{ 
                          backgroundColor: '#ffffff', 
                          padding: '16px', 
                          borderRadius: 'var(--radius-sm)', 
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <div style={{ maxWidth: '70%' }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan Details</span>
                              <strong style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block', wordBreak: 'break-word' }}>{sub.plan_name}</strong>
                            </div>
                            <span className="badge" style={{
                              fontSize: '10px',
                              padding: '4px 10px',
                              fontWeight: 700,
                              backgroundColor: statusBg,
                              color: statusColor,
                              textTransform: 'uppercase',
                              borderRadius: '20px'
                            }}>
                              {statusText}
                            </span>
                          </div>

                          {/* Progress Bar Display */}
                          <div style={{ 
                            backgroundColor: 'var(--primary-light)', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            border: '1px solid rgba(16, 185, 129, 0.05)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '6px' }}>
                              <span>Packs Completed</span>
                              <span>{used} / {total} Packs Used</span>
                            </div>

                            {/* Bar Container */}
                            <div style={{
                              width: '100%',
                              height: '10px',
                              backgroundColor: 'rgba(0, 0, 0, 0.06)',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              position: 'relative'
                            }}>
                              <div style={{
                                width: `${percent}%`,
                                height: '100%',
                                backgroundColor: statusColor,
                                borderRadius: '6px',
                                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                              }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      type="button" 
                      onClick={() => { setTrackerResult(null); setPhoneInput(''); }}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      Track Another
                    </button>
                    <button 
                      type="button" 
                      onClick={closeTracker}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
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

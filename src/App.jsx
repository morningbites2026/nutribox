import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { X, Send, PhoneCall } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Plans from './components/Plans';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { useContent } from './context/ContentContext';

function LandingPage() {
  const { 
    activeSubscribePlan, setActiveSubscribePlan, 
    activeDialerPhones, setActiveDialerPhones, 
    saladPlans, siteSettings 
  } = useContent();

  const [selectedPlan, setSelectedPlan] = useState('');
  const [queryMessage, setQueryMessage] = useState('Hi, I am interested in subscribing to this salad plan! Please let me know the daily delivery slots and payment details.');

  // Sync selected dropdown plan with the plan clicked by user
  useEffect(() => {
    if (activeSubscribePlan) {
      setSelectedPlan(activeSubscribePlan);
    }
  }, [activeSubscribePlan]);

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Clean phone number from settings, fallback to user-specified default if not present
    const rawNum = siteSettings.social_whatsapp || '+91 94299 29822';
    const cleanNum = rawNum.replace(/[^\d]/g, '');

    const messageText = `Hello ${siteSettings.business_name || 'Nutribox'}! I would like to subscribe to the plan: *${selectedPlan}*.\n\nHere is my query:\n${queryMessage}`;
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    setActiveSubscribePlan(null); // Close modal
  };

  const handlePhoneDial = (num) => {
    const cleanNum = num.replace(/[^\d+]/g, '');
    window.location.href = `tel:${cleanNum}`;
    setActiveDialerPhones(null); // Close modal
  };

  return (
    <>
      <Navbar />
      <Hero />
      <Plans />
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
                </select>
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

import React, { useState } from 'react';
import { Check, Salad, Tag } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Plans = () => {
  const { saladPlans, salads } = useContent();
  const [activeMenuTab, setActiveMenuTab] = useState('individual'); // 'individual' or 'combo'

  const handleSelectPlan = (title) => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="plans" style={{
      padding: '100px 0',
      backgroundColor: 'var(--primary-light)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          maxWidth: '650px',
          margin: '0 auto 60px auto'
        }}>
          <h2 className="font-serif" style={{
            fontSize: '40px',
            color: 'var(--primary-dark)',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            Explore Our Salad Menu
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px'
          }}>
            Fresh, calorie-counted, and nutritionally balanced. Choose from our single serving signature recipes or select a curated combo package.
          </p>

          {/* Individual Salad vs Combo Toggle Tabs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--card-bg)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
            marginTop: '32px'
          }}>
            <button
              onClick={() => setActiveMenuTab('individual')}
              style={{
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '15px',
                transition: 'var(--transition-smooth)',
                backgroundColor: activeMenuTab === 'individual' ? 'var(--primary)' : 'transparent',
                color: activeMenuTab === 'individual' ? '#ffffff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Salad size={18} />
              Individual Salads
            </button>
            <button
              onClick={() => setActiveMenuTab('combo')}
              style={{
                padding: '12px 28px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '15px',
                transition: 'var(--transition-smooth)',
                backgroundColor: activeMenuTab === 'combo' ? 'var(--primary)' : 'transparent',
                color: activeMenuTab === 'combo' ? '#ffffff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Tag size={18} />
              Curated Combos
            </button>
          </div>
        </div>

        {/* Tab 1: Render Individual Salads */}
        {activeMenuTab === 'individual' && (
          <div className="grid-responsive">
            {salads.map((salad) => {
              const supportsHalf = salad.variant_support === 'half' || salad.variant_support === 'both';
              const supportsFull = salad.variant_support === 'full' || salad.variant_support === 'both';

              return (
                <div 
                  key={salad.id} 
                  className="glass-card" 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {/* Photo */}
                  <div style={{
                    height: '220px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--primary-light)'
                  }}>
                    <img 
                      src={salad.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'} 
                      alt={salad.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    textAlign: 'left'
                  }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {salad.tags && salad.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="badge" 
                          style={{
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontSize: '10px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: '22px', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 600 }}>
                      {salad.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                      {salad.description}
                    </p>

                    {/* Ingredients List */}
                    <div style={{ marginBottom: '24px', flexGrow: 1 }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.5px',
                        marginBottom: '10px'
                      }}>
                        Ingredients included:
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {salad.ingredients && salad.ingredients.map((ing, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
                            <Check size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0 -28px 24px -28px' }} />

                    {/* Prices */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {supportsHalf && (
                          <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>
                            Half Pack: <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{salad.price_half}</span>
                          </div>
                        )}
                        {supportsFull && (
                          <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>
                            Full Pack: <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{salad.price_full}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleSelectPlan(salad.title)}
                        className="btn btn-primary"
                        style={{ padding: '10px 18px', fontSize: '13px' }}
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {salads.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No signature salads found.
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Render Curated Combos */}
        {activeMenuTab === 'combo' && (
          <div className="grid-responsive">
            {saladPlans.map((plan) => {
              // Resolve salad items with variants
              const resolvedItems = plan.salad_items ? plan.salad_items.map(item => {
                const [saladId, variant] = item.split(':');
                const salad = salads.find(s => s.id === saladId);
                return { salad, variant };
              }).filter(item => item.salad) : [];
              
              // Compile unified ingredients and tags
              const compiledIngredients = Array.from(
                new Set(resolvedItems.flatMap(item => item.salad.ingredients || []))
              );
              
              const compiledTags = Array.from(
                new Set(resolvedItems.flatMap(item => item.salad.tags || []))
              );

              return (
                <div 
                  key={plan.id} 
                  className="glass-card" 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {/* Photo */}
                  <div style={{
                    height: '220px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--primary-light)'
                  }}>
                    <img 
                      src={plan.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'} 
                      alt={plan.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>

                  {/* Info */}
                  <div style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    textAlign: 'left'
                  }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {compiledTags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="badge" 
                          style={{
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontSize: '10px'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: '22px', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 600 }}>
                      {plan.title}
                    </h3>

                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                      {plan.description}
                    </p>

                    {/* Included Salads List */}
                    {resolvedItems.length > 0 && (
                      <div style={{ marginBottom: '16px', backgroundColor: 'var(--bg-color)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Salad size={14} style={{ color: 'var(--primary)' }} />
                          Salads in this Combo:
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {resolvedItems.map((item, idx) => (
                            <span key={idx} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                              • {item.salad.title} <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 700 }}>({item.variant === 'half' ? 'Half Pack' : 'Full Pack'})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unified Ingredients List */}
                    <div style={{ marginBottom: '24px', flexGrow: 1 }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.5px',
                        marginBottom: '10px'
                      }}>
                        Combined Ingredients:
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {compiledIngredients.map((ing, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)' }}>
                            <Check size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0 -28px 24px -28px' }} />

                    {/* Price & Order */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {plan.price_half > 0 && (
                          <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>
                            Half Combo: <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{plan.price_half}</span>
                          </div>
                        )}
                        {plan.price_full > 0 && (
                          <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500 }}>
                            Full Combo: <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{plan.price_full}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleSelectPlan(plan.title)}
                        className="btn btn-primary"
                        style={{ padding: '10px 18px', fontSize: '13px' }}
                      >
                        Order Combo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {saladPlans.length === 0 && (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No curated combos found.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;

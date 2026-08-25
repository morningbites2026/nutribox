import React, { useState } from 'react';
import { Check, Salad } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Plans = () => {
  const { saladPlans, salads } = useContent();
  const [billingPeriod, setBillingPeriod] = useState('weekly'); // 'weekly', 'monthly', or 'pack'

  const handleSelectPlan = (planTitle) => {
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
            Choose Your Salad Plan
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px'
          }}>
            Explore our curated meal plan subscription options. Get fresh, chef-prepared salads made from 100% organic ingredients delivered daily.
          </p>

          {/* Weekly / Monthly / Fix Pack Toggle */}
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
              onClick={() => setBillingPeriod('weekly')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'var(--transition-smooth)',
                backgroundColor: billingPeriod === 'weekly' ? 'var(--primary)' : 'transparent',
                color: billingPeriod === 'weekly' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Weekly
            </button>
            <button
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'var(--transition-smooth)',
                backgroundColor: billingPeriod === 'monthly' ? 'var(--primary)' : 'transparent',
                color: billingPeriod === 'monthly' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('pack')}
              style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'var(--transition-smooth)',
                backgroundColor: billingPeriod === 'pack' ? 'var(--primary)' : 'transparent',
                color: billingPeriod === 'pack' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Fix Pack
            </button>
          </div>
          <p style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent)',
            marginTop: '8px'
          }}>
            🔥 Save more with monthly subscriptions or flexible fixed packs!
          </p>
        </div>

        {/* Salad Cards Grid */}
        <div className="grid-responsive">
          {saladPlans.map((plan) => {
            let priceLabel = 'Per Week';
            let price = plan.price_weekly;

            if (billingPeriod === 'monthly') {
              priceLabel = 'Per Month';
              price = plan.price_monthly;
            } else if (billingPeriod === 'pack') {
              priceLabel = `For ${plan.pack_name || '10 Pack'}`;
              price = plan.price_pack;
            }

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
                {/* Plan Image */}
                <div style={{
                  height: '220px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--primary-light)'
                }}>
                  <img 
                    src={plan.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'} 
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
                  {billingPeriod === 'pack' && plan.pack_name && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 600,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <span>{plan.pack_name}</span>
                    </div>
                  )}
                </div>

                {/* Plan Info */}
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

                  <h3 style={{
                    fontSize: '22px',
                    color: 'var(--text-main)',
                    marginBottom: '10px',
                    fontWeight: 600
                  }}>
                    {plan.title}
                  </h3>

                  <p style={{
                    fontSize: '14px',
                    color: 'var(--text-muted)',
                    lineHeight: '1.5',
                    marginBottom: '20px'
                  }}>
                    {plan.description}
                  </p>

                  {/* Included Salads & Variants */}
                  {resolvedItems.length > 0 && (
                    <div style={{ marginBottom: '16px', backgroundColor: 'var(--bg-color)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Salad size={14} style={{ color: 'var(--primary)' }} />
                        Included Salad Recipes:
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

                  {/* Ingredients Header */}
                  <div style={{ marginBottom: '24px', flexGrow: 1 }}>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.5px',
                      marginBottom: '10px'
                    }}>
                      Unified Ingredients:
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {compiledIngredients.map((ing, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: 'var(--text-main)'
                        }}>
                          <Check size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>{ing}</span>
                        </li>
                      ))}
                      {compiledIngredients.length === 0 && (
                        <li style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No salads associated with this plan.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    backgroundColor: 'var(--border-color)',
                    margin: '0 -28px 24px -28px'
                  }} />

                  {/* Price and CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto'
                  }}>
                    <div>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {priceLabel}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{price}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSelectPlan(plan.title)}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 20px',
                        fontSize: '14px'
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Plans;

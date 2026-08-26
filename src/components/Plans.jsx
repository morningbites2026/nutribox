import React, { useState } from 'react';
import { Check, Salad, Tag } from 'lucide-react';
import { useContent, isRecipeActive } from '../context/ContentContext';

const Plans = () => {
  const { saladPlans, salads, siteSettings, setActiveSubscribePlan } = useContent();
  const [activeMenuTab, setActiveMenuTab] = useState('individual'); // 'individual' or 'combo'

  // Filter plans based on active tab, active status, and showcase selections
  const getShowcasePlans = () => {
    const showcaseStr = siteSettings.showcase_plans || '';
    const showcaseIds = showcaseStr.split(',').map(id => id.trim()).filter(Boolean);
    if (showcaseIds.length === 0) {
      return saladPlans.filter(plan => plan.plan_type === activeMenuTab && plan.active !== false);
    }
    return saladPlans.filter(plan => showcaseIds.includes(plan.id) && plan.plan_type === activeMenuTab && plan.active !== false);
  };

  const filteredPlans = getShowcasePlans();

  return (
    <section id="plans" style={{
      padding: '100px 0',
      backgroundColor: 'var(--bg-color)',
      fontFamily: 'var(--font-sans)',
      transition: 'var(--transition-smooth)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Header Title */}
        <div style={{ maxWidth: '640px', margin: '0 auto 48px auto' }}>
          <span style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Choose Your Plan
          </span>
          <h2 className="font-serif" style={{
            fontSize: '38px',
            color: 'var(--primary-dark)',
            fontWeight: 700,
            marginTop: '16px',
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Salad Subscriptions Packages
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            Select from our chef-curated individual or combo health-focused packages. Skip, pause, or customize delivery slots at your convenience.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '50px'
        }}>
          <div style={{
            display: 'inline-flex',
            backgroundColor: 'var(--primary-light)',
            padding: '6px',
            borderRadius: 'var(--radius-full)'
          }}>
            <button
              onClick={() => setActiveMenuTab('individual')}
              className={`btn ${activeMenuTab === 'individual' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeMenuTab === 'individual' ? 'var(--primary)' : 'transparent',
                color: activeMenuTab === 'individual' ? '#ffffff' : 'var(--primary-dark)',
                boxShadow: activeMenuTab === 'individual' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Salad size={18} />
              Individual Plans
            </button>
            <button
              onClick={() => setActiveMenuTab('combo')}
              className={`btn ${activeMenuTab === 'combo' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '10px 24px',
                fontSize: '14px',
                border: 'none',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeMenuTab === 'combo' ? 'var(--primary)' : 'transparent',
                color: activeMenuTab === 'combo' ? '#ffffff' : 'var(--primary-dark)',
                boxShadow: activeMenuTab === 'combo' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Tag size={18} />
              Combo Salad Plans
            </button>
          </div>
        </div>

        {/* Salad Cards Grid */}
        <div className="grid-responsive">
          {filteredPlans.map((plan) => {
            // Resolve salad items with variants (filtering out inactive ones)
            const resolvedItems = plan.salad_items ? plan.salad_items
              .filter(item => isRecipeActive(item, salads))
              .map(item => {
                const [saladId, variant] = item.split(':');
                
                // Try exact match first
                let salad = salads.find(s => s.id === item);
                if (!salad && variant) {
                  // Try matching variant-specific row
                  salad = salads.find(s => {
                    const sid = s.id.toLowerCase();
                    const searchId = saladId.toLowerCase();
                    const searchVar = variant.toLowerCase();
                    return sid.startsWith(searchId) && sid.includes(searchVar);
                  });
                }
                if (!salad) {
                  // Try base match
                  salad = salads.find(s => s.id === saladId);
                }
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
                  {plan.meals_count && (
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
                      <span>{plan.meals_count} Meals</span>
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
                        {plan.plan_type === 'individual' ? 'Selected Recipe:' : 'Salads in this Combo:'}
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

                  {/* Ingredients Checklist */}
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
                        Price for {plan.meals_count} meals
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
                          ₹{plan.price}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveSubscribePlan(plan.title)}
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
          {filteredPlans.length === 0 && (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No plans available under this tab.
            </p>
          )}
        </div>

        {/* Sample Packs Section */}
        <div style={{
          marginTop: '80px',
          paddingTop: '60px',
          borderTop: '1px dashed var(--border-color)',
          textAlign: 'center'
        }}>
          <span style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Sample Packs
          </span>
          <h3 className="font-serif" style={{
            fontSize: '32px',
            color: 'var(--primary-dark)',
            fontWeight: 700,
            marginTop: '16px',
            marginBottom: '12px'
          }}>
            Do you want to try a sample pack?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            You can also try the samples listed below. Select from our showcase recipes and order a single test pack to experience the taste and freshness before subscribing.
          </p>

          <div className="grid-responsive" style={{ marginTop: '30px' }}>
            {salads.filter(s => s.active !== false).map((salad) => {
              return (
                <div 
                  key={salad.id} 
                  className="glass-card" 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '24px',
                    textAlign: 'left',
                    height: '100%',
                    position: 'relative',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {/* Salad Image */}
                  <div style={{
                    height: '200px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    position: 'relative'
                  }}>
                    <img 
                      src={salad.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'} 
                      alt={salad.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {salad.tags && salad.tags.length > 0 && (
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        {salad.tags.map((tag, i) => (
                          <span key={i} className="badge" style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    {salad.title}
                  </h4>
                  
                  {salad.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                      {salad.description}
                    </p>
                  )}

                  {/* Ingredients Checklist */}
                  <div style={{ marginBottom: '24px', flexGrow: 1 }}>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.5px',
                      marginBottom: '8px'
                    }}>
                      Included Ingredients:
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
                      {salad.ingredients && salad.ingredients.map((ing, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: 'var(--text-main)'
                        }}>
                          <Check size={12} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <span>{ing}</span>
                        </li>
                      ))}
                      {(!salad.ingredients || salad.ingredients.length === 0) && (
                        <li style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Fresh seasonal farm veggies.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    backgroundColor: 'var(--border-color)',
                    margin: '0 -24px 20px -24px'
                  }} />

                  {/* Price & CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Sample pack pricing
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        {(salad.variant_support === 'half' || salad.variant_support === 'both') && (
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Half Pack: <span style={{ color: 'var(--primary)' }}>₹{salad.price_half}</span>
                          </span>
                        )}
                        {(salad.variant_support === 'full' || salad.variant_support === 'both') && (
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                            Full Pack: <span style={{ color: 'var(--primary)' }}>₹{salad.price_full}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveSubscribePlan(`Sample Pack: ${salad.title}`)}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px'
                      }}
                    >
                      Try Sample
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;

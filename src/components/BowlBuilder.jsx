import React, { useState } from 'react';
import { Leaf, Plus, Check, Info, RefreshCw } from 'lucide-react';

const BASES = [
  { name: 'Baby Spinach', calories: 15, protein: 1, carbs: 2, color: '#4caf50' },
  { name: 'Organic Kale', calories: 30, protein: 2, carbs: 6, color: '#2e7d32' },
  { name: 'Crisp Romaine', calories: 10, protein: 1, carbs: 2, color: '#81c784' },
  { name: 'Wild Arugula', calories: 20, protein: 1, carbs: 3, color: '#388e3c' }
];

const PROTEINS = [
  { name: 'Grilled Chicken Breast', calories: 150, protein: 26, carbs: 0, color: '#f5cba7' },
  { name: 'Crispy Organic Tofu', calories: 90, protein: 10, carbs: 2, color: '#fcf3cf' },
  { name: 'Smoked Salmon Slice', calories: 110, protein: 18, carbs: 0, color: '#f5b7b1' },
  { name: 'Herb Roasted Chickpeas', calories: 120, protein: 7, carbs: 20, color: '#ebf5fb' }
];

const TOPPINGS = [
  { name: 'Creamy Avocado', calories: 80, protein: 1, carbs: 4, color: '#aed581' },
  { name: 'Cherry Tomatoes', calories: 15, protein: 0.5, carbs: 3, color: '#e57373' },
  { name: 'Crumbled Feta Cheese', calories: 75, protein: 4, carbs: 1, color: '#fdfefe' },
  { name: 'Sliced Cucumber', calories: 8, protein: 0.3, carbs: 2, color: '#c8e6c9' },
  { name: 'Toasted Almonds', calories: 90, protein: 3, carbs: 3, color: '#d7ccc8' },
  { name: 'Steam Broccoli', calories: 25, protein: 2, carbs: 5, color: '#455a64' },
  { name: 'Sweet Golden Corn', calories: 45, protein: 1.5, carbs: 10, color: '#fff59d' }
];

const DRESSINGS = [
  { name: 'Zesty Lemon Vinaigrette', calories: 60, protein: 0, carbs: 1, color: '#fff9c4' },
  { name: 'Creamy Tahini Dressing', calories: 95, protein: 2, carbs: 3, color: '#f5f5f5' },
  { name: 'Olive Oil & Fresh Herbs', calories: 110, protein: 0, carbs: 0, color: '#e8f5e9' },
  { name: 'Spicy Honey Mustard', calories: 70, protein: 0.5, carbs: 8, color: '#fff176' }
];

const BowlBuilder = () => {
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [selectedProtein, setSelectedProtein] = useState(PROTEINS[0]);
  const [selectedToppings, setSelectedToppings] = useState([TOPPINGS[0], TOPPINGS[1]]);
  const [selectedDressing, setSelectedDressing] = useState(DRESSINGS[0]);

  // Calculate totals
  const totalCalories = 
    selectedBase.calories + 
    selectedProtein.calories + 
    selectedToppings.reduce((sum, item) => sum + item.calories, 0) + 
    selectedDressing.calories;

  const totalProtein = 
    selectedBase.protein + 
    selectedProtein.protein + 
    selectedToppings.reduce((sum, item) => sum + item.protein, 0) + 
    selectedDressing.protein;

  const totalCarbs = 
    selectedBase.carbs + 
    selectedProtein.carbs + 
    selectedToppings.reduce((sum, item) => sum + item.carbs, 0) + 
    selectedDressing.carbs;

  const handleToppingToggle = (topping) => {
    if (selectedToppings.find(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      if (selectedToppings.length < 4) {
        setSelectedToppings([...selectedToppings, topping]);
      }
    }
  };

  const handleReset = () => {
    setSelectedBase(BASES[0]);
    setSelectedProtein(PROTEINS[0]);
    setSelectedToppings([TOPPINGS[0], TOPPINGS[1]]);
    setSelectedDressing(DRESSINGS[0]);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="bowl-builder" style={{
      padding: '100px 0',
      backgroundColor: 'var(--bg-color)'
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
            color: 'var(--primary)',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            Interactive Bowl Builder
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '16px'
          }}>
            Design your dream salad. Pick your favorite base greens, clean proteins, gourmet toppings, and hand-whipped dressings. See macro metrics update in real-time.
          </p>
        </div>

        {/* Builder Container */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* Left Panel: Selector Options */}
          <div className="glass-card" style={{
            padding: '32px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Step 1: Base */}
            <div>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
                Choose Greens Base
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {BASES.map(base => (
                  <button
                    key={base.name}
                    onClick={() => setSelectedBase(base)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedBase.name === base.name ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: selectedBase.name === base.name ? 'var(--primary-light)' : 'var(--card-bg)',
                      color: selectedBase.name === base.name ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <span>{base.name}</span>
                    {selectedBase.name === base.name && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Protein */}
            <div>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
                Select Lean Protein
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PROTEINS.map(protein => (
                  <button
                    key={protein.name}
                    onClick={() => setSelectedProtein(protein)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedProtein.name === protein.name ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: selectedProtein.name === protein.name ? 'var(--primary-light)' : 'var(--card-bg)',
                      color: selectedProtein.name === protein.name ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <span>{protein.name.split(' ')[0]} {protein.name.split(' ')[1] || ''}</span>
                    {selectedProtein.name === protein.name && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Toppings */}
            <div>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
                Gourmet Toppings (Max 4)
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Selected: {selectedToppings.length}/4
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TOPPINGS.map(topping => {
                  const isSelected = selectedToppings.find(t => t.name === topping.name);
                  const isLimitReached = selectedToppings.length >= 4;
                  return (
                    <button
                      key={topping.name}
                      onClick={() => handleToppingToggle(topping)}
                      disabled={!isSelected && isLimitReached}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        fontWeight: 500,
                        fontSize: '13px',
                        cursor: (!isSelected && isLimitReached) ? 'not-allowed' : 'pointer',
                        opacity: (!isSelected && isLimitReached) ? 0.4 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <span>{topping.name}</span>
                      {isSelected ? <Check size={12} /> : <Plus size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Dressing */}
            <div>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>4</span>
                Artisanal Dressing
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {DRESSINGS.map(dressing => (
                  <button
                    key={dressing.name}
                    onClick={() => setSelectedDressing(dressing)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: selectedDressing.name === dressing.name ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: selectedDressing.name === dressing.name ? 'var(--primary-light)' : 'var(--card-bg)',
                      color: selectedDressing.name === dressing.name ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <span>{dressing.name.split(' ')[0]} {dressing.name.split(' ')[1] || ''}</span>
                    {selectedDressing.name === dressing.name && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Salad Bowl Visualization & Metrics */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'sticky',
            top: '110px'
          }}>
            {/* Visual Salad Bowl */}
            <div className="glass-card" style={{
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '320px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Reset button */}
              <button 
                onClick={handleReset}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
                title="Reset Builder"
              >
                <RefreshCw size={14} />
                Reset
              </button>

              {/* The Visual Salad Bowl */}
              <div style={{
                position: 'relative',
                width: '240px',
                height: '140px',
                borderRadius: '0 0 120px 120px',
                border: '8px solid var(--border-color)',
                borderTop: 'none',
                backgroundColor: 'rgba(255,255,255,0.05)',
                boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                paddingBottom: '20px',
                marginTop: '40px',
                zIndex: 2
              }}>
                {/* Greens Base fill (lowest layer) */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  top: '10px',
                  backgroundColor: selectedBase.color,
                  borderRadius: '0 0 110px 110px',
                  opacity: 0.85,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)',
                  zIndex: 3
                }}>
                  {selectedBase.name}
                </div>

                {/* Protein overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  width: '120px',
                  height: '40px',
                  backgroundColor: selectedProtein.color,
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#2b302c',
                  transition: 'var(--transition-smooth)',
                  boxShadow: 'var(--shadow-sm)',
                  zIndex: 4
                }}>
                  {selectedProtein.name.split(' ')[0]}
                </div>

                {/* Dressing Splash Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50px',
                  width: '100px',
                  height: '25px',
                  backgroundColor: selectedDressing.color,
                  borderRadius: 'var(--radius-full)',
                  transform: 'rotate(-10deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: 'var(--primary-dark)',
                  opacity: 0.9,
                  border: '1px dashed var(--primary)',
                  boxShadow: 'var(--shadow-sm)',
                  zIndex: 5
                }}>
                  {selectedDressing.name.split(' ')[0]} Dressing
                </div>

                {/* Floating ingredients tags representing toppings */}
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '200px',
                  zIndex: 6
                }}>
                  {selectedToppings.map(topping => (
                    <span key={topping.name} style={{
                      backgroundColor: topping.color,
                      color: '#000000',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      transform: 'rotate(' + (Math.random() * 8 - 4) + 'deg)',
                      transition: 'var(--transition-smooth)'
                    }}>
                      {topping.name.split(' ')[1] || topping.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Your Custom Creation</p>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', fontStyle: 'italic', marginTop: '4px' }}>
                  {selectedBase.name} + {selectedProtein.name} + {selectedToppings.map(t => t.name).join(', ')} + {selectedDressing.name}
                </p>
              </div>
            </div>

            {/* Real-time Nutritional Card */}
            <div className="glass-card" style={{
              padding: '28px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', fontWeight: 700, marginBottom: '16px' }}>Nutritional Content</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>{totalCalories}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Calories</p>
                </div>
                <div style={{ backgroundColor: 'var(--accent-light)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{totalProtein}g</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Protein</p>
                </div>
                <div style={{ backgroundColor: 'var(--border-color)', padding: '12px', borderRadius: 'var(--radius-md)', opacity: 0.7 }}>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>{totalCarbs}g</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Carbs</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '8px',
                backgroundColor: 'var(--bg-color)',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '20px'
              }}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>Nutritional values are estimates based on standard serving sizes. Customize your salad selection below.</span>
              </div>

              <button 
                onClick={scrollToContact} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
              >
                Inquire About Custom Plans
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BowlBuilder;

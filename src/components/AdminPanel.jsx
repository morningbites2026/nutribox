import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutGrid, FileText, Database, Plus, Trash2, Edit2, 
  Check, AlertTriangle, HelpCircle, Save, LogOut, CheckCircle, ShieldAlert
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

const AdminPanel = () => {
  const { 
    siteSettings, saladPlans, isDemoMode, 
    updateMultipleSettings, addSaladPlan, updateSaladPlan, deleteSaladPlan 
  } = useContent();

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'settings', 'database'

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Plan editor states
  const [editingPlanId, setEditingPlanId] = useState(null); // null = new, id = edit
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    price_weekly: '',
    price_monthly: '',
    calories: '',
    image_url: '',
    ingredients_raw: '',
    tags_raw: ''
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    hero_title: '',
    hero_subtitle: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    business_hours: '',
    admin_passcode: ''
  });

  // Initialize settings form values
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        business_name: siteSettings.business_name || '',
        hero_title: siteSettings.hero_title || '',
        hero_subtitle: siteSettings.hero_subtitle || '',
        contact_email: siteSettings.contact_email || '',
        contact_phone: siteSettings.contact_phone || '',
        contact_address: siteSettings.contact_address || '',
        business_hours: siteSettings.business_hours || '',
        admin_passcode: siteSettings.admin_passcode || ''
      });
    }
  }, [siteSettings]);

  // Check auth session
  useEffect(() => {
    const isAuthed = sessionStorage.getItem('nutribox_admin_authed');
    if (isAuthed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const triggerAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Authenticate Passcode
  const handleAuth = (e) => {
    e.preventDefault();
    const correctPasscode = siteSettings.admin_passcode || import.meta.env.VITE_ADMIN_PASSCODE || 'admin123';
    
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nutribox_admin_authed', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nutribox_admin_authed');
    navigate('/');
  };

  // Site Settings Submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMultipleSettings(settingsForm);
      triggerAlert('Site settings updated successfully!');
    } catch (err) {
      triggerAlert('Failed to update settings. Please check console.', 'error');
    }
  };

  // Edit plan trigger
  const openEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      title: plan.title || '',
      description: plan.description || '',
      price_weekly: plan.price_weekly || '',
      price_monthly: plan.price_monthly || '',
      calories: plan.calories || '',
      image_url: plan.image_url || '',
      ingredients_raw: plan.ingredients ? plan.ingredients.join(', ') : '',
      tags_raw: plan.tags ? plan.tags.join(', ') : ''
    });
    setIsPlanFormOpen(true);
  };

  const openNewPlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      title: '',
      description: '',
      price_weekly: '',
      price_monthly: '',
      calories: '',
      image_url: '',
      ingredients_raw: '',
      tags_raw: ''
    });
    setIsPlanFormOpen(true);
  };

  // Salad Plan CRUD operations
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    
    if (!planForm.title || !planForm.price_weekly || !planForm.price_monthly) {
      triggerAlert('Title, Weekly Price, and Monthly Price are required fields!', 'error');
      return;
    }

    const processedPlan = {
      title: planForm.title,
      description: planForm.description,
      price_weekly: parseFloat(planForm.price_weekly),
      price_monthly: parseFloat(planForm.price_monthly),
      calories: parseInt(planForm.calories) || 0,
      image_url: planForm.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      ingredients: planForm.ingredients_raw.split(',').map(i => i.trim()).filter(Boolean),
      tags: planForm.tags_raw.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingPlanId) {
        await updateSaladPlan(editingPlanId, processedPlan);
        triggerAlert('Salad plan updated successfully!');
      } else {
        await addSaladPlan(processedPlan);
        triggerAlert('New salad plan added successfully!');
      }
      setIsPlanFormOpen(false);
    } catch (err) {
      triggerAlert('Failed to save salad plan. Please try again.', 'error');
    }
  };

  const handleDeletePlan = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the plan: "${title}"?`)) {
      try {
        await deleteSaladPlan(id);
        triggerAlert(`Salad plan "${title}" deleted.`);
      } catch (err) {
        triggerAlert('Failed to delete plan.', 'error');
      }
    }
  };

  // Rendering passcode auth check screen
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        fontFamily: 'var(--font-sans)',
        padding: '24px'
      }}>
        <div className="glass-card" style={{
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <ShieldAlert size={28} />
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
            Admin Access Required
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Please enter your administrator passcode to manage salad plans and configurations.
          </p>

          <form onSubmit={handleAuth}>
            <div className="admin-input-group">
              <label className="admin-label">Passcode</label>
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="admin-input"
                style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
                autoFocus
              />
            </div>

            {authError && (
              <p style={{
                color: 'var(--danger)',
                fontSize: '13px',
                fontWeight: 600,
                marginTop: '-12px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                {authError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '10px' }}
              >
                Go Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '10px' }}
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-main)'
    }}>
      {/* Visual Banners Alert */}
      {alert.show && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '16px 24px',
          borderRadius: 'var(--radius-sm)',
          color: '#ffffff',
          backgroundColor: alert.type === 'success' ? 'var(--success)' : 'var(--danger)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1100,
          animation: 'fadeInUp 0.3s ease-out forwards',
          fontWeight: 600
        }}>
          {alert.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <button 
            onClick={() => navigate('/')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            <ArrowLeft size={16} />
            Back to Site
          </button>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
            Nutribox Admin Center {isDemoMode && <span style={{ color: 'var(--accent)', fontSize: '12px', verticalAlign: 'middle', marginLeft: '6px' }}>(Demo Mode)</span>}
          </h2>

          <button 
            onClick={handleLogout} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '40px',
        paddingTop: '40px',
        paddingBottom: '60px',
        width: '100%',
        flexGrow: 1
      }} className="admin-body-layout">
        
        {/* Left Sidebar Menu */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="admin-sidebar">
          <button 
            onClick={() => { setActiveTab('plans'); setIsPlanFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'plans' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'plans' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'plans' ? 700 : 500
            }}
          >
            <LayoutGrid size={18} />
            Salad Plans
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsPlanFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'settings' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'settings' ? 700 : 500
            }}
          >
            <FileText size={18} />
            Site Settings
          </button>
          <button 
            onClick={() => { setActiveTab('database'); setIsPlanFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'database' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'database' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'database' ? 700 : 500
            }}
          >
            <Database size={18} />
            Cloud Database
          </button>
        </aside>

        {/* Right Dashboard Content Panel */}
        <main className="glass-card" style={{ padding: '36px', textAlign: 'left', minHeight: '400px' }}>
          
          {/* Tab 1: Salad Plans CRUD */}
          {activeTab === 'plans' && (
            <>
              {!isPlanFormOpen ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>Manage Salad Plans</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure subscription salad meals displayed on the homepage.</p>
                    </div>
                    <button onClick={openNewPlan} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                      <Plus size={16} />
                      Add Salad Plan
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Salad Plan Title</th>
                          <th>Weekly Price</th>
                          <th>Monthly Price</th>
                          <th>Kcal</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {saladPlans.map(plan => (
                          <tr key={plan.id}>
                            <td>
                              <img 
                                src={plan.image_url} 
                                alt={plan.title} 
                                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{plan.title}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '300px' }}>{plan.description}</div>
                            </td>
                            <td style={{ fontWeight: 600 }}>${plan.price_weekly}</td>
                            <td style={{ fontWeight: 600 }}>${plan.price_monthly}</td>
                            <td>{plan.calories || '-'}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => openEditPlan(plan)}
                                  style={actionBtnStyle}
                                  title="Edit Plan"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeletePlan(plan.id, plan.title)}
                                  style={{ ...actionBtnStyle, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                  title="Delete Plan"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {saladPlans.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                              No plans configured. Click "Add Salad Plan" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                // Add / Edit Form UI
                <form onSubmit={handlePlanSubmit}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>
                    {editingPlanId ? 'Edit Salad Plan' : 'Create New Salad Plan'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div className="admin-input-group">
                      <label className="admin-label">Salad Plan Title *</label>
                      <input 
                        type="text" 
                        value={planForm.title}
                        onChange={(e) => setPlanForm({...planForm, title: e.target.value})}
                        placeholder="e.g. Avocado Crunch Bowl"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Image Photo URL</label>
                      <input 
                        type="text" 
                        value={planForm.image_url}
                        onChange={(e) => setPlanForm({...planForm, image_url: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Plan Description</label>
                    <textarea 
                      value={planForm.description}
                      onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                      placeholder="Explain details, target dietary objective..."
                      className="admin-textarea"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="price-inputs">
                    <div className="admin-input-group">
                      <label className="admin-label">Weekly Price ($) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={planForm.price_weekly}
                        onChange={(e) => setPlanForm({...planForm, price_weekly: e.target.value})}
                        placeholder="39.99"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Monthly Price ($) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={planForm.price_monthly}
                        onChange={(e) => setPlanForm({...planForm, price_monthly: e.target.value})}
                        placeholder="149.99"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Estimated Calories (kcal)</label>
                      <input 
                        type="number" 
                        value={planForm.calories}
                        onChange={(e) => setPlanForm({...planForm, calories: e.target.value})}
                        placeholder="350"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Ingredients (Comma-separated list)</label>
                    <input 
                      type="text" 
                      value={planForm.ingredients_raw}
                      onChange={(e) => setPlanForm({...planForm, ingredients_raw: e.target.value})}
                      placeholder="Baby Spinach, Cucumber, Tomatoes, Avocado, Feta"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Tags (Comma-separated list)</label>
                    <input 
                      type="text" 
                      value={planForm.tags_raw}
                      onChange={(e) => setPlanForm({...planForm, tags_raw: e.target.value})}
                      placeholder="Keto, Vegan, High Protein, Gluten Free"
                      className="admin-input"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsPlanFormOpen(false)} 
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <Save size={16} />
                      Save Salad Plan
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Tab 2: Site Settings */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSettingsSubmit}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Site Content Settings</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Update structural headlines, contact values, and passwords.</p>

              <div className="admin-input-group">
                <label className="admin-label">Business Name</label>
                <input 
                  type="text" 
                  value={settingsForm.business_name}
                  onChange={(e) => setSettingsForm({...settingsForm, business_name: e.target.value})}
                  className="admin-input"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Hero Banner Headline</label>
                <input 
                  type="text" 
                  value={settingsForm.hero_title}
                  onChange={(e) => setSettingsForm({...settingsForm, hero_title: e.target.value})}
                  className="admin-input"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Hero Description Subtitle</label>
                <textarea 
                  value={settingsForm.hero_subtitle}
                  onChange={(e) => setSettingsForm({...settingsForm, hero_subtitle: e.target.value})}
                  className="admin-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="admin-input-group">
                  <label className="admin-label">Contact Phone</label>
                  <input 
                    type="text" 
                    value={settingsForm.contact_phone}
                    onChange={(e) => setSettingsForm({...settingsForm, contact_phone: e.target.value})}
                    className="admin-input"
                  />
                </div>
                <div className="admin-input-group">
                  <label className="admin-label">Contact Email</label>
                  <input 
                    type="email" 
                    value={settingsForm.contact_email}
                    onChange={(e) => setSettingsForm({...settingsForm, contact_email: e.target.value})}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Store Physical Address</label>
                <input 
                  type="text" 
                  value={settingsForm.contact_address}
                  onChange={(e) => setSettingsForm({...settingsForm, contact_address: e.target.value})}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="admin-input-group">
                  <label className="admin-label">Working Hours Statement</label>
                  <input 
                    type="text" 
                    value={settingsForm.business_hours}
                    onChange={(e) => setSettingsForm({...settingsForm, business_hours: e.target.value})}
                    className="admin-input"
                  />
                </div>
                <div className="admin-input-group">
                  <label className="admin-label">Admin Passcode (Secure auth key)</label>
                  <input 
                    type="text" 
                    value={settingsForm.admin_passcode}
                    onChange={(e) => setSettingsForm({...settingsForm, admin_passcode: e.target.value})}
                    placeholder="admin123"
                    className="admin-input"
                  />
                </div>
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Site Settings
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Database & Cloud Config */}
          {activeTab === 'database' && (
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Database Diagnostics</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Examine connection statuses and learn how to sync with cloud databases.</p>

              {/* Status Box */}
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                display: 'flex',
                alignItems: 'start',
                gap: '16px',
                backgroundColor: isDemoMode ? 'var(--accent-light)' : 'var(--primary-light)',
                marginBottom: '32px'
              }}>
                <div style={{
                  color: isDemoMode ? 'var(--accent)' : 'var(--primary)',
                  backgroundColor: 'var(--card-bg)',
                  padding: '10px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {isDemoMode ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {isDemoMode ? 'Offline Demo Mode (LocalStorage)' : 'Connected to Cloud Database (Supabase)'}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {isDemoMode 
                      ? 'The website is currently executing in offline sandbox mode. All modifications are preserved locally in this browser. To view your changes from another device or publish the site to Vercel with a database, integrate Supabase.'
                      : 'The website is active and connected to your remote Supabase instance. Edits made in this Admin Panel are saved to the PostgreSQL database and immediately broadcasted to all visitors.'}
                  </p>
                </div>
              </div>

              {/* Integration Instructions */}
              {isDemoMode && (
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
                    How to Connect Your Supabase Cloud Database (Option B)
                  </h4>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--text-muted)'
                  }}>
                    <p>
                      <strong>Step 1:</strong> Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Supabase.com</a>, sign up for a free account, and create a new project called <strong>Nutribox</strong>.
                    </p>
                    <p>
                      <strong>Step 2:</strong> Go to the <strong>SQL Editor</strong> tab on your Supabase sidebar, select "New query", and copy/paste the database structure defined in:
                      <br />
                      <code style={{ fontSize: '12px', display: 'block', backgroundColor: 'var(--card-bg)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '6px', color: 'var(--primary-dark)', fontFamily: 'var(--font-serif)' }}>
                        supabase_setup.sql
                      </code>
                      Run the script to initialize tables, insert defaults, and configure access permissions.
                    </p>
                    <p>
                      <strong>Step 3:</strong> Open your local project directory and locate the <code>.env</code> file. Uncomment the variables and replace them with your database endpoints:
                      <code style={{ fontSize: '11px', display: 'block', backgroundColor: 'var(--card-bg)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', marginTop: '6px', color: 'var(--text-main)' }}>
                        VITE_SUPABASE_URL=https://[your-project-ref].supabase.co<br />
                        VITE_SUPABASE_ANON_KEY=[your-public-anon-key]
                      </code>
                    </p>
                    <p>
                      <strong>Step 4:</strong> Restart your dev server (<code>npm run dev</code>). The panel will automatically detect the key variables, switch from LocalStorage to Supabase, and load the database values!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .admin-body-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .admin-sidebar {
            flex-direction: row !important;
            overflow-x: auto !important;
            padding-bottom: 8px !important;
          }
          .admin-sidebar button {
            white-space: nowrap !important;
          }
          .price-inputs {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
        }
      `}</style>
    </div>
  );
};

const sidebarBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'var(--transition-smooth)'
};

const actionBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--card-bg)',
  cursor: 'pointer',
  color: 'var(--text-muted)',
  transition: 'var(--transition-smooth)'
};

export default AdminPanel;

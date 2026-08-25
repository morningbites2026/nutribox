import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutGrid, FileText, Database, Plus, Trash2, Edit2, 
  Check, AlertTriangle, HelpCircle, Save, LogOut, CheckCircle, ShieldAlert, Salad, Tag
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

const AdminPanel = () => {
  const { 
    siteSettings, salads, saladPlans, isDemoMode, 
    updateMultipleSettings, addSalad, updateSalad, deleteSalad,
    addSaladPlan, updateSaladPlan, deleteSaladPlan 
  } = useContent();

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState('salads'); // 'salads', 'plans', 'settings', 'database'

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Salad editor states
  const [editingSaladId, setEditingSaladId] = useState(null); // null = new, id = edit
  const [isSaladFormOpen, setIsSaladFormOpen] = useState(false);
  const [saladForm, setSaladForm] = useState({
    title: '',
    description: '',
    variant_support: 'both', // 'half', 'full', 'both'
    price_half: '',
    price_full: '',
    image_url: '',
    ingredients_raw: '',
    tags_raw: ''
  });

  // Salad Plan editor states
  const [editingPlanId, setEditingPlanId] = useState(null); // null = new, id = edit
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    plan_type: 'combo', // 'individual' or 'combo'
    price: '',
    meals_count: '10',
    image_url: '',
    salad_items: [] // array of 'salad_id:variant'
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    business_name: '',
    logo_url: '',
    hero_title: '',
    hero_subtitle: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    business_hours: '',
    admin_passcode: '',
    social_whatsapp: '',
    social_instagram: '',
    footer_text: ''
  });

  // Initialize settings form values
  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        business_name: siteSettings.business_name || '',
        logo_url: siteSettings.logo_url || '',
        hero_title: siteSettings.hero_title || '',
        hero_subtitle: siteSettings.hero_subtitle || '',
        contact_email: siteSettings.contact_email || '',
        contact_phone: siteSettings.contact_phone || '',
        contact_address: siteSettings.contact_address || '',
        business_hours: siteSettings.business_hours || '',
        admin_passcode: siteSettings.admin_passcode || '',
        social_whatsapp: siteSettings.social_whatsapp || '',
        social_instagram: siteSettings.social_instagram || '',
        footer_text: siteSettings.footer_text || ''
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

  // ==========================================
  // SALADS OPERATIONS
  // ==========================================
  const openEditSalad = (salad) => {
    setEditingSaladId(salad.id);
    setSaladForm({
      title: salad.title || '',
      description: salad.description || '',
      variant_support: salad.variant_support || 'both',
      price_half: salad.price_half || '',
      price_full: salad.price_full || '',
      image_url: salad.image_url || '',
      ingredients_raw: salad.ingredients ? salad.ingredients.join(', ') : '',
      tags_raw: salad.tags ? salad.tags.join(', ') : ''
    });
    setIsSaladFormOpen(true);
  };

  const openNewSalad = () => {
    setEditingSaladId(null);
    setSaladForm({
      title: '',
      description: '',
      variant_support: 'both',
      price_half: '',
      price_full: '',
      image_url: '',
      ingredients_raw: '',
      tags_raw: ''
    });
    setIsSaladFormOpen(true);
  };

  const handleSaladSubmit = async (e) => {
    e.preventDefault();
    if (!saladForm.title) {
      triggerAlert('Salad Name is required!', 'error');
      return;
    }

    const processedSalad = {
      title: saladForm.title,
      description: saladForm.description,
      variant_support: saladForm.variant_support,
      price_half: (saladForm.variant_support === 'half' || saladForm.variant_support === 'both') ? parseFloat(saladForm.price_half) || 0 : 0,
      price_full: (saladForm.variant_support === 'full' || saladForm.variant_support === 'both') ? parseFloat(saladForm.price_full) || 0 : 0,
      image_url: saladForm.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      ingredients: saladForm.ingredients_raw.split(',').map(i => i.trim()).filter(Boolean),
      tags: saladForm.tags_raw.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingSaladId) {
        await updateSalad(editingSaladId, processedSalad);
        triggerAlert('Salad recipe updated successfully!');
      } else {
        await addSalad(processedSalad);
        triggerAlert('New salad recipe added successfully!');
      }
      setIsSaladFormOpen(false);
    } catch (err) {
      triggerAlert('Failed to save salad. Please try again.', 'error');
    }
  };

  const handleDeleteSalad = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the salad recipe: "${title}"?\nThis will automatically remove it from any Salad Plans.`)) {
      try {
        await deleteSalad(id);
        triggerAlert(`Salad recipe "${title}" deleted successfully.`);
      } catch (err) {
        triggerAlert('Failed to delete salad.', 'error');
      }
    }
  };

  // ==========================================
  // SALAD PLANS OPERATIONS
  // ==========================================
  const openEditPlan = (plan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      title: plan.title || '',
      description: plan.description || '',
      plan_type: plan.plan_type || 'combo',
      price: plan.price || '',
      meals_count: plan.meals_count ? plan.meals_count.toString() : '10',
      image_url: plan.image_url || '',
      salad_items: plan.salad_items || []
    });
    setIsPlanFormOpen(true);
  };

  const openNewPlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      title: '',
      description: '',
      plan_type: 'combo',
      price: '',
      meals_count: '10',
      image_url: '',
      salad_items: []
    });
    setIsPlanFormOpen(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    if (!planForm.title || !planForm.price) {
      triggerAlert('Title and Price are required fields!', 'error');
      return;
    }

    if (planForm.salad_items.length === 0) {
      triggerAlert('Please select at least one salad recipe variant!', 'error');
      return;
    }

    const processedPlan = {
      title: planForm.title,
      description: planForm.description,
      plan_type: planForm.plan_type,
      price: parseFloat(planForm.price),
      meals_count: parseInt(planForm.meals_count) || 10,
      image_url: planForm.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
      salad_items: planForm.salad_items || []
    };

    try {
      if (editingPlanId) {
        await updateSaladPlan(editingPlanId, processedPlan);
        triggerAlert('Salad Plan updated successfully!');
      } else {
        await addSaladPlan(processedPlan);
        triggerAlert('New Salad Plan added successfully!');
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

  const handleSaladItemSelect = (saladId, variant, isChecked) => {
    const itemKey = `${saladId}:${variant}`;
    
    if (planForm.plan_type === 'individual') {
      // Radio button behavior for individual type: only exactly one selection allowed!
      if (isChecked) {
        setPlanForm(prev => ({ ...prev, salad_items: [] }));
      } else {
        setPlanForm(prev => ({ ...prev, salad_items: [itemKey] }));
      }
    } else {
      // Normal multi-select checklist behavior for combos
      const currentItems = planForm.salad_items || [];
      const updated = isChecked 
        ? currentItems.filter(item => item !== itemKey)
        : [...currentItems, itemKey];
      setPlanForm(prev => ({ ...prev, salad_items: updated }));
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
            Please enter your administrator passcode to manage salad configurations.
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
            onClick={() => { setActiveTab('salads'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'salads' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'salads' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'salads' ? 700 : 500
            }}
          >
            <Salad size={18} />
            Salads Recipes
          </button>
          <button 
            onClick={() => { setActiveTab('plans'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
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
            onClick={() => { setActiveTab('settings'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
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
            onClick={() => { setActiveTab('database'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
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
          
          {/* TAB: SALADS CRUD */}
          {activeTab === 'salads' && (
            <>
              {!isSaladFormOpen ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>Manage Salads</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure specific salads and their ingredients, which can be linked to your plans.</p>
                    </div>
                    <button onClick={openNewSalad} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                      <Plus size={16} />
                      Add Salad
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Salad Title</th>
                          <th>Variant Prices</th>
                          <th>Ingredients</th>
                          <th>Tags</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salads.map(salad => (
                          <tr key={salad.id}>
                            <td>
                              <img 
                                src={salad.image_url} 
                                alt={salad.title} 
                                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{salad.title}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '200px' }}>{salad.description}</div>
                            </td>
                            <td>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                                {(salad.variant_support === 'half' || salad.variant_support === 'both') && <div>Half Pack: ₹{salad.price_half}</div>}
                                {(salad.variant_support === 'full' || salad.variant_support === 'both') && <div>Full Pack: ₹{salad.price_full}</div>}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontSize: '12px', color: 'var(--text-main)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {salad.ingredients ? salad.ingredients.join(', ') : '-'}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {salad.tags?.slice(0, 2).map((t, i) => (
                                  <span key={i} className="badge" style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                                    {t}
                                  </span>
                                ))}
                                {salad.tags?.length > 2 && <span style={{ fontSize: '10px' }}>+{salad.tags.length - 2}</span>}
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => openEditSalad(salad)}
                                  style={actionBtnStyle}
                                  title="Edit Salad"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteSalad(salad.id, salad.title)}
                                  style={{ ...actionBtnStyle, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                  title="Delete Salad"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {salads.length === 0 && (
                          <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                              No salads configured. Click "Add Salad" to build one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                // Add / Edit Salad Form UI
                <form onSubmit={handleSaladSubmit}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '24px' }}>
                    {editingSaladId ? 'Edit Salad Recipe' : 'Create New Salad Recipe'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    <div className="admin-input-group">
                      <label className="admin-label">Salad Name *</label>
                      <input 
                        type="text" 
                        value={saladForm.title}
                        onChange={(e) => setSaladForm({...saladForm, title: e.target.value})}
                        placeholder="e.g. Avocado Crunch Bowl"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Variant Availability *</label>
                      <select 
                        value={saladForm.variant_support}
                        onChange={(e) => setSaladForm({...saladForm, variant_support: e.target.value})}
                        className="admin-input"
                        style={{ height: '45px' }}
                      >
                        <option value="both">Both (Half & Full Pack)</option>
                        <option value="half">Half Pack Only</option>
                        <option value="full">Full Pack Only</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                    {(saladForm.variant_support === 'half' || saladForm.variant_support === 'both') && (
                      <div className="admin-input-group">
                        <label className="admin-label">Half Pack Price (₹) *</label>
                        <input 
                          type="number" 
                          value={saladForm.price_half}
                          onChange={(e) => setSaladForm({...saladForm, price_half: e.target.value})}
                          placeholder="100"
                          className="admin-input"
                          required
                        />
                      </div>
                    )}
                    {(saladForm.variant_support === 'full' || saladForm.variant_support === 'both') && (
                      <div className="admin-input-group">
                        <label className="admin-label">Full Pack Price (₹) *</label>
                        <input 
                          type="number" 
                          value={saladForm.price_full}
                          onChange={(e) => setSaladForm({...saladForm, price_full: e.target.value})}
                          placeholder="180"
                          className="admin-input"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Image Photo URL</label>
                    <input 
                      type="text" 
                      value={saladForm.image_url}
                      onChange={(e) => setSaladForm({...saladForm, image_url: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Description</label>
                    <textarea 
                      value={saladForm.description}
                      onChange={(e) => setSaladForm({...saladForm, description: e.target.value})}
                      placeholder="Recipe summary details..."
                      className="admin-textarea"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Ingredients (Comma-separated list)</label>
                    <input 
                      type="text" 
                      value={saladForm.ingredients_raw}
                      onChange={(e) => setSaladForm({...saladForm, ingredients_raw: e.target.value})}
                      placeholder="Baby Spinach, Cucumber, Tomatoes, Avocado, Feta"
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Tags (Comma-separated list)</label>
                    <input 
                      type="text" 
                      value={saladForm.tags_raw}
                      onChange={(e) => setSaladForm({...saladForm, tags_raw: e.target.value})}
                      placeholder="Keto, Vegan, High Protein, Gluten Free"
                      className="admin-input"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsSaladFormOpen(false)} 
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      <Save size={16} />
                      Save Salad Recipe
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* TAB 1: Salad Plans CRUD */}
          {activeTab === 'plans' && (
            <>
              {!isPlanFormOpen ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)' }}>Manage Salad Plans</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Configure subscription salad packages displayed on the homepage.</p>
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
                          <th>Plan Type</th>
                          <th>Price (₹)</th>
                          <th>Meals Quantity</th>
                          <th>Salads Associated</th>
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
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '250px' }}>{plan.description}</div>
                            </td>
                            <td>
                              <span className="badge" style={{ backgroundColor: plan.plan_type === 'individual' ? 'var(--primary-light)' : 'rgba(59, 130, 246, 0.1)', color: plan.plan_type === 'individual' ? 'var(--primary)' : '#2563eb' }}>
                                {plan.plan_type === 'individual' ? 'Individual' : 'Combo'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 800 }}>₹{plan.price}</td>
                            <td style={{ fontWeight: 600 }}>{plan.meals_count} meals</td>
                            <td>
                              <span className="badge" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                                {plan.salad_items ? plan.salad_items.length : 0} Items
                              </span>
                            </td>
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
                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
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
                        placeholder="e.g. Lean & Clean Pack"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Plan Category / Type *</label>
                      <select 
                        value={planForm.plan_type}
                        onChange={(e) => {
                          setPlanForm({
                            ...planForm,
                            plan_type: e.target.value,
                            salad_items: []
                          });
                        }}
                        className="admin-input"
                        style={{ height: '45px' }}
                      >
                        <option value="combo">Combo Plan (Multiple Salads)</option>
                        <option value="individual">Individual Salad Plan (Single Salad)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
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
                      placeholder="Explain details, target subscription audience..."
                      className="admin-textarea"
                    />
                  </div>

                  {/* Multi-Select checklist of salads with Half / Full variant checkboxes */}
                  <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                    <label className="admin-label" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                      {planForm.plan_type === 'individual' 
                        ? 'Select exactly one salad variant for this plan * (Selection is restricted to 1)' 
                        : 'Select salads and variants to include in this combo *'}
                    </label>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      border: '1px solid var(--border-color)',
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-color)',
                      maxHeight: '280px',
                      overflowY: 'auto'
                    }}>
                      {salads.map(salad => {
                        const supportsHalf = salad.variant_support === 'half' || salad.variant_support === 'both';
                        const supportsFull = salad.variant_support === 'full' || salad.variant_support === 'both';

                        const isHalfChecked = planForm.salad_items?.includes(`${salad.id}:half`);
                        const isFullChecked = planForm.salad_items?.includes(`${salad.id}:full`);

                        return (
                          <div key={salad.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: (isHalfChecked || isFullChecked) ? 'var(--primary-light)' : 'transparent',
                            transition: 'var(--transition-smooth)'
                          }} className="salad-select-row">
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{salad.title}</span>
                            
                            <div style={{ display: 'flex', gap: '16px' }}>
                              {supportsHalf && (
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                  <input 
                                    type="checkbox"
                                    checked={isHalfChecked}
                                    onChange={() => handleSaladItemSelect(salad.id, 'half', isHalfChecked)}
                                    style={{ accentColor: 'var(--primary)' }}
                                  />
                                  <span>Half Pack (₹{salad.price_half})</span>
                                </label>
                              )}
                              {supportsFull && (
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                  <input 
                                    type="checkbox"
                                    checked={isFullChecked}
                                    onChange={() => handleSaladItemSelect(salad.id, 'full', isFullChecked)}
                                    style={{ accentColor: 'var(--primary)' }}
                                  />
                                  <span>Full Pack (₹{salad.price_full})</span>
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {salads.length === 0 && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                          No salads available. Create salads first in the "Salads Recipes" tab.
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                    <div className="admin-input-group">
                      <label className="admin-label">Plan Price (₹) *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={planForm.price}
                        onChange={(e) => setPlanForm({...planForm, price: e.target.value})}
                        placeholder="400"
                        className="admin-input"
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label className="admin-label">Meals Count (Quantity of meals provided) *</label>
                      <input 
                        type="number" 
                        value={planForm.meals_count}
                        onChange={(e) => setPlanForm({...planForm, meals_count: e.target.value})}
                        placeholder="10"
                        className="admin-input"
                        required
                      />
                    </div>
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

          {/* TAB 2: Site Settings */}
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
                <label className="admin-label">Site Logo URL</label>
                <input 
                  type="text" 
                  value={settingsForm.logo_url}
                  onChange={(e) => setSettingsForm({...settingsForm, logo_url: e.target.value})}
                  placeholder="https://example.com/logo.png"
                  className="admin-input"
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  💡 Suggested Size: For horizontal logos, use dimensions around <strong>180px width × 50px height</strong> (or aspect ratio ~3.5:1). For square icons, <strong>40px × 40px</strong> is recommended.
                </span>
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
                  <label className="admin-label">Contact Phone (Comma-separated for multiple)</label>
                  <input 
                    type="text" 
                    value={settingsForm.contact_phone}
                    onChange={(e) => setSettingsForm({...settingsForm, contact_phone: e.target.value})}
                    placeholder="+91 94299 29822, +91 98765 43210"
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

              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '24px', marginBottom: '12px' }}>Social Media & Footer Settings</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="admin-input-group">
                  <label className="admin-label">WhatsApp Number (e.g. +91 94299 29822)</label>
                  <input 
                    type="text" 
                    value={settingsForm.social_whatsapp}
                    onChange={(e) => setSettingsForm({...settingsForm, social_whatsapp: e.target.value})}
                    placeholder="+919429929822"
                    className="admin-input"
                  />
                </div>
                <div className="admin-input-group">
                  <label className="admin-label">Instagram Profile URL</label>
                  <input 
                    type="text" 
                    value={settingsForm.social_instagram}
                    onChange={(e) => setSettingsForm({...settingsForm, social_instagram: e.target.value})}
                    placeholder="https://instagram.com/your-username"
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Footer Copyright / Text</label>
                <input 
                  type="text" 
                  value={settingsForm.footer_text}
                  onChange={(e) => setSettingsForm({...settingsForm, footer_text: e.target.value})}
                  placeholder="© 2026 Nutribox. Fresh & Healthy Salad Subscriptions."
                  className="admin-input"
                />
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Site Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Database & Cloud Config */}
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
          .salad-select-row {
            flex-direction: column !important;
            align-items: start !important;
            gap: 8px !important;
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutGrid, FileText, Database, Plus, Trash2, Edit2, 
  Check, AlertTriangle, HelpCircle, Save, LogOut, CheckCircle, ShieldAlert, Salad, Settings,
  Calculator, ClipboardList, Users, Minus
} from 'lucide-react';
import { useContent, menuIdToUuid } from '../context/ContentContext';

const AdminPanel = () => {
  const { 
    siteSettings, salads, saladPlans, isDemoMode, 
    updateMultipleSettings, addSalad, updateSalad, deleteSalad,
    addSaladPlan, updateSaladPlan, deleteSaladPlan,
    inquiries, deleteInquiry, menuItemSalads, addSaladFromMenuItem
  } = useContent();

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState('salads'); // 'salads', 'plans', 'settings', 'footer', 'database'

  // Alert state
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Salad editor states
  const [editingSaladId, setEditingSaladId] = useState(null); // null = new, id = edit
  const [isSaladFormOpen, setIsSaladFormOpen] = useState(false);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState('');
  const [saladForm, setSaladForm] = useState({
    title: '',
    description: '',
    variant_support: 'both', // 'half', 'full', 'both'
    price_half: '',
    price_full: '',
    image_url: '',
    ingredients_raw: '',
    tags_raw: '',
    active: true
  });

  // Salad Plan editor states
  const [editingPlanId, setEditingPlanId] = useState(null); // null = new, id = edit
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [selectedShowcasePlanId, setSelectedShowcasePlanId] = useState('');
  const [planForm, setPlanForm] = useState({
    title: '',
    description: '',
    plan_type: 'combo', // 'individual' or 'combo'
    price: '',
    meals_count: '10',
    image_url: '',
    salad_items: [], // array of 'salad_id:variant'
    active: true
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
    footer_text: '',
    delivery_info: '',
    calculator_whatsapp: '',
    calculator_featured_plans: '',
    samples_badge: '',
    samples_title: '',
    samples_subtitle: '',
    plans_badge: '',
    plans_title: '',
    plans_subtitle: '',
    calc_badge: '',
    calc_title: '',
    calc_subtitle: ''
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
        footer_text: siteSettings.footer_text || '',
        delivery_info: siteSettings.delivery_info || '',
        calculator_whatsapp: siteSettings.calculator_whatsapp || '',
        calculator_featured_plans: siteSettings.calculator_featured_plans || '',
        samples_badge: siteSettings.samples_badge || '',
        samples_title: siteSettings.samples_title || '',
        samples_subtitle: siteSettings.samples_subtitle || '',
        plans_badge: siteSettings.plans_badge || '',
        plans_title: siteSettings.plans_title || '',
        plans_subtitle: siteSettings.plans_subtitle || '',
        calc_badge: siteSettings.calc_badge || '',
        calc_title: siteSettings.calc_title || '',
        calc_subtitle: siteSettings.calc_subtitle || ''
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
      triggerAlert('Settings updated successfully!');
    } catch (err) {
      triggerAlert('Failed to update settings. Please check console.', 'error');
    }
  };

  const openNewSalad = () => {
    setEditingSaladId(null);
    setSelectedMenuItemId('');
    setSaladForm({
      title: '',
      description: '',
      variant_support: 'both',
      price_half: '',
      price_full: '',
      image_url: '',
      ingredients_raw: '',
      tags_raw: '',
      active: true
    });
    setIsSaladFormOpen(true);
  };

  const openEditSalad = (salad) => {
    setEditingSaladId(salad.id);
    setSelectedMenuItemId(salad.id);
    setSaladForm({
      title: salad.title || '',
      description: salad.description || '',
      variant_support: salad.variant_support || 'both',
      price_half: salad.price_half || '',
      price_full: salad.price_full || '',
      image_url: salad.image_url || '',
      ingredients_raw: salad.ingredients ? salad.ingredients.join('\n') : '',
      tags_raw: salad.tags ? salad.tags.join(', ') : '',
      active: salad.active !== false
    });
    setIsSaladFormOpen(true);
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

  const handleDropdownChange = (itemId) => {
    setSelectedMenuItemId(itemId);
    const item = menuItemSalads.find(m => m.id.toString() === itemId.toString());
    if (item) {
      let ingredientsRaw = '';
      if (item.ingredients) {
        ingredientsRaw = Array.isArray(item.ingredients) ? item.ingredients.join('\n') : item.ingredients.toString();
      } else if (item.description) {
        ingredientsRaw = item.description.toString();
      }
      setSaladForm({
        ...saladForm,
        image_url: item.image_url || item.image || '',
        ingredients_raw: ingredientsRaw,
        tags_raw: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        active: true
      });
    }
  };

  const handleAddSaladFromMenu = async (e) => {
    e.preventDefault();
    if (editingSaladId) {
      try {
        await updateSalad(editingSaladId, {
          ingredients: saladForm.ingredients_raw.split('\n').map(i => i.trim()).filter(Boolean),
          tags: saladForm.tags_raw.split(',').map(t => t.trim()).filter(Boolean),
          image_url: saladForm.image_url,
          active: saladForm.active !== false
        });
        triggerAlert('Salad recipe updated successfully!');
      } catch (err) {
        triggerAlert('Failed to update salad recipe.', 'error');
      }
    } else {
      if (!selectedMenuItemId) {
        triggerAlert('Please select a salad recipe to add!', 'error');
        return;
      }
      const chosenItem = menuItemSalads.find(m => m.id.toString() === selectedMenuItemId.toString());
      if (chosenItem) {
        try {
          await addSaladFromMenuItem(chosenItem, {
            ingredients_raw: saladForm.ingredients_raw,
            tags_raw: saladForm.tags_raw,
            image_url: saladForm.image_url,
            active: saladForm.active !== false
          });
          triggerAlert('Salad recipe added successfully!');
        } catch (err) {
          triggerAlert('Failed to add salad recipe.', 'error');
        }
      }
    }
    setIsSaladFormOpen(false);
  };

  // ==========================================
  // SALAD PLANS OPERATIONS
  // ==========================================
  const openNewPlan = () => {
    setSelectedShowcasePlanId('');
    setIsPlanFormOpen(true);
  };

  const handleAddShowcasePlan = async (e) => {
    e.preventDefault();
    if (!selectedShowcasePlanId) {
      triggerAlert('Please select a plan to showcase!', 'error');
      return;
    }
    const currentShowcase = siteSettings.showcase_plans || '';
    const currentIds = currentShowcase.split(',').map(id => id.trim()).filter(Boolean);
    if (!currentIds.includes(selectedShowcasePlanId)) {
      currentIds.push(selectedShowcasePlanId);
      try {
        await updateMultipleSettings({ showcase_plans: currentIds.join(',') });
        triggerAlert("Salad Plan added to showcase successfully!");
      } catch (err) {
        triggerAlert("Failed to update site settings.", "error");
      }
    } else {
      triggerAlert("This plan is already showcased!", "info");
    }
    setIsPlanFormOpen(false);
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
            <Settings size={18} />
            Site Settings
          </button>
          <button 
            onClick={() => { setActiveTab('footer'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'footer' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'footer' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'footer' ? 700 : 500
            }}
          >
            <FileText size={18} />
            Footer Settings
          </button>
          <button 
            onClick={() => { setActiveTab('calculator'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'calculator' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'calculator' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'calculator' ? 700 : 500
            }}
          >
            <Calculator size={18} />
            Calculator Setup
          </button>
          <button 
            onClick={() => { setActiveTab('inquiries'); setIsPlanFormOpen(false); setIsSaladFormOpen(false); }}
            style={{
              ...sidebarBtnStyle,
              backgroundColor: activeTab === 'inquiries' ? 'var(--primary-light)' : 'transparent',
              color: activeTab === 'inquiries' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'inquiries' ? 700 : 500
            }}
          >
            <ClipboardList size={18} />
            Inquiries Log
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
                          <th>Status</th>
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
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await updateSalad(salad.id, { active: !salad.active });
                                    triggerAlert(`Salad status changed to ${!salad.active ? 'Active' : 'Inactive'}!`);
                                  } catch (err) {
                                    triggerAlert("Failed to update status.", "error");
                                  }
                                }}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-full)',
                                  border: 'none',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  backgroundColor: salad.active ? 'var(--primary-light)' : '#f3f4f6',
                                  color: salad.active ? 'var(--primary)' : '#6b7280',
                                  transition: 'all 0.2s ease',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                {salad.active ? 'Active' : 'Inactive'}
                              </button>
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
                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                              No salads added to showcase. Click "Add Salad" to select one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Showcase Salad Selection Form */
                <form onSubmit={handleAddSaladFromMenu}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                    {editingSaladId ? 'Edit Salad Showcase' : 'Select Salad Recipe to Add'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Choose a recipe from your existing menu items database (type = Salad) to showcase on the Nutribox website.
                  </p>

                  <div className="admin-input-group">
                    <label className="admin-label">Choose Recipe *</label>
                    <select
                      value={selectedMenuItemId}
                      onChange={(e) => handleDropdownChange(e.target.value)}
                      className="admin-input"
                      style={{ height: '45px' }}
                      required
                      disabled={!!editingSaladId}
                    >
                      <option value="">-- Select an Active Salad --</option>
                      {(() => {
                        const addedIds = salads.map(s => s.id);
                        return menuItemSalads
                          .filter(item => editingSaladId ? item.id.toString() === selectedMenuItemId.toString() : !addedIds.includes(item.id.toString()))
                          .map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name || item.title || 'Unnamed Salad'}
                            </option>
                          ));
                      })()}
                    </select>
                  </div>

                  {(selectedMenuItemId || editingSaladId) && (() => {
                    const chosenItem = menuItemSalads.find(m => m.id.toString() === selectedMenuItemId.toString()) || salads.find(s => s.id === editingSaladId);
                    if (!chosenItem) return null;
                    return (
                      <>
                        {/* Variants List Display */}
                        <div style={{
                          marginBottom: '24px',
                          padding: '16px 20px',
                          backgroundColor: 'var(--primary-light)',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: '4px solid var(--primary)'
                        }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '8px' }}>
                            Detected Variants:
                          </h4>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {Array.isArray(chosenItem.options) ? chosenItem.options.map((opt, idx) => (
                              <div key={idx} style={{
                                backgroundColor: 'var(--card-bg)',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-main)'
                              }}>
                                {opt.name || opt.label || 'Regular'}: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{opt.price}</span>
                              </div>
                            )) : (
                              <div style={{
                                backgroundColor: 'var(--card-bg)',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: 'var(--text-main)'
                              }}>
                                {(chosenItem.variant_support === 'half' || chosenItem.variant_support === 'both') && <span>Half Pack: ₹{chosenItem.price_half}</span>}
                                {chosenItem.variant_support === 'both' && <span> | </span>}
                                {(chosenItem.variant_support === 'full' || chosenItem.variant_support === 'both') && <span>Full Pack: ₹{chosenItem.price_full}</span>}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Editable Fields */}
                        <div className="admin-input-group">
                          <label className="admin-label">Ingredients</label>
                          <textarea 
                            value={saladForm.ingredients_raw}
                            onChange={(e) => setSaladForm({...saladForm, ingredients_raw: e.target.value})}
                            placeholder="Enter ingredients (one per line)..."
                            className="admin-textarea"
                            style={{ minHeight: '120px' }}
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">Tags (Comma-separated list)</label>
                          <input 
                            type="text" 
                            value={saladForm.tags_raw}
                            onChange={(e) => setSaladForm({...saladForm, tags_raw: e.target.value})}
                            placeholder="Keto, Vegan, High Protein"
                            className="admin-input"
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">Image URL</label>
                          <input 
                            type="text" 
                            value={saladForm.image_url}
                            onChange={(e) => setSaladForm({...saladForm, image_url: e.target.value})}
                            placeholder="https://images.unsplash.com/..."
                            className="admin-input"
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>Showcase Status:</span>
                          <button
                            type="button"
                            onClick={() => setSaladForm({...saladForm, active: saladForm.active !== false ? false : true})}
                            style={{
                              padding: '6px 16px',
                              borderRadius: 'var(--radius-full)',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              backgroundColor: (saladForm.active !== false) ? 'var(--primary-light)' : '#f3f4f6',
                              color: (saladForm.active !== false) ? 'var(--primary)' : '#6b7280',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {(saladForm.active !== false) ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </>
                    );
                  })()}

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
                      <Plus size={16} />
                      {editingSaladId ? 'Save Changes' : 'Add Salad Recipe'}
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
                          <th>Status</th>
                          <th>Meals</th>
                          <th>Price (₹)</th>
                          <th>Type</th>
                          <th>Associated Salads</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const showcaseStr = siteSettings.showcase_plans || '';
                          const showcaseIds = showcaseStr.split(',').map(id => id.trim()).filter(Boolean);
                          const showcasedPlans = saladPlans.filter(p => showcaseIds.includes(p.id));

                          return showcasedPlans.map(plan => (
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
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '200px' }}>{plan.description}</div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await updateSaladPlan(plan.id, { active: !plan.active });
                                      triggerAlert(`Plan status changed to ${!plan.active ? 'Active' : 'Inactive'}!`);
                                    } catch (err) {
                                      triggerAlert("Failed to update status.", "error");
                                    }
                                  }}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    border: 'none',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    backgroundColor: plan.active ? 'var(--primary-light)' : '#f3f4f6',
                                    color: plan.active ? 'var(--primary)' : '#6b7280',
                                    transition: 'all 0.2s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  {plan.active ? 'Active' : 'Inactive'}
                                </button>
                              </td>
                              <td style={{ fontWeight: 600 }}>{plan.meals_count} meals</td>
                              <td style={{ fontWeight: 800 }}>₹{plan.price}</td>
                              <td>
                                <span className="badge" style={{ backgroundColor: plan.plan_type === 'individual' ? 'var(--primary-light)' : 'rgba(59, 130, 246, 0.1)', color: plan.plan_type === 'individual' ? 'var(--primary)' : '#2563eb' }}>
                                  {plan.plan_type === 'individual' ? 'Individual' : 'Combo'}
                                </span>
                              </td>
                              <td style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                {(() => {
                                  if (!plan.salad_items || plan.salad_items.length === 0) return 'None';
                                  return plan.salad_items.map(item => {
                                    const [saladId] = item.split(':');
                                    const salad = salads.find(s => s.id === saladId);
                                    return salad ? salad.title : null;
                                  }).filter(Boolean).join(', ') || 'None';
                                })()}
                              </td>
                            </tr>
                          ));
                        })()}
                        {(() => {
                          const showcaseStr = siteSettings.showcase_plans || '';
                          const showcaseIds = showcaseStr.split(',').map(id => id.trim()).filter(Boolean);
                          if (saladPlans.filter(p => showcaseIds.includes(p.id)).length === 0) {
                            return (
                              <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                                  No salad plans added to showcase. Click "Add Salad Plan" to select one.
                                </td>
                              </tr>
                            );
                          }
                          return null;
                        })()}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                /* Showcase Selection Dropdown UI */
                <form onSubmit={handleAddShowcasePlan}>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                    Select Salad Plan to Showcase
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Choose an active created package from the database to display in the homepage showcase grid.
                  </p>

                  <div className="admin-input-group">
                    <label className="admin-label">Choose Package *</label>
                    <select
                      value={selectedShowcasePlanId}
                      onChange={(e) => setSelectedShowcasePlanId(e.target.value)}
                      className="admin-input"
                      style={{ height: '45px' }}
                      required
                    >
                      <option value="">-- Select an Active Package --</option>
                      {(() => {
                        const showcaseStr = siteSettings.showcase_plans || '';
                        const showcaseIds = showcaseStr.split(',').map(id => id.trim()).filter(Boolean);
                        
                        // Filter plans that:
                        // - Are active (active !== false)
                        // - Are NOT customized packages (e.g. title does not contain 'custom')
                        // - Are NOT already in the showcase list
                        return saladPlans
                          .filter(p => p.active !== false && 
                                       !p.title.toLowerCase().includes('custom') && 
                                       !p.description?.toLowerCase().includes('custom') &&
                                       !showcaseIds.includes(p.id))
                          .map(p => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({p.plan_type === 'individual' ? 'Individual' : 'Combo'} - ₹{p.price})
                            </option>
                          ));
                      })()}
                    </select>
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
                      <Plus size={16} />
                      Add to Showcase
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
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Update structural headlines, site details, and passwords.</p>

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

              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px dashed var(--border-color)',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>🥗 Sample Packs Section Settings</h4>
                
                <div className="admin-input-group">
                  <label className="admin-label">Sample Section Badge</label>
                  <input 
                    type="text" 
                    value={settingsForm.samples_badge}
                    onChange={(e) => setSettingsForm({...settingsForm, samples_badge: e.target.value})}
                    placeholder="Sample Packs"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Sample Section Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.samples_title}
                    onChange={(e) => setSettingsForm({...settingsForm, samples_title: e.target.value})}
                    placeholder="Do you want to try a sample pack?"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Sample Section Subtitle / Description</label>
                  <textarea 
                    value={settingsForm.samples_subtitle}
                    onChange={(e) => setSettingsForm({...settingsForm, samples_subtitle: e.target.value})}
                    placeholder="You can also try the samples listed below. Select from our showcase recipes and order a single test pack to experience the taste and freshness before subscribing."
                    className="admin-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px dashed var(--border-color)',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>🥗 Salad Plans Section Settings</h4>
                
                <div className="admin-input-group">
                  <label className="admin-label">Plans Section Badge</label>
                  <input 
                    type="text" 
                    value={settingsForm.plans_badge}
                    onChange={(e) => setSettingsForm({...settingsForm, plans_badge: e.target.value})}
                    placeholder="Choose Your Plan"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Plans Section Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.plans_title}
                    onChange={(e) => setSettingsForm({...settingsForm, plans_title: e.target.value})}
                    placeholder="Salad Subscriptions Packages"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Plans Section Subtitle / Description</label>
                  <textarea 
                    value={settingsForm.plans_subtitle}
                    onChange={(e) => setSettingsForm({...settingsForm, plans_subtitle: e.target.value})}
                    placeholder="Select from our chef-curated individual or combo health-focused packages. Skip, pause, or customize delivery slots at your convenience."
                    className="admin-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>

              <div style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px dashed var(--border-color)',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '16px' }}>🧮 Interactive Calculator Settings</h4>
                
                <div className="admin-input-group">
                  <label className="admin-label">Calculator Badge Text</label>
                  <input 
                    type="text" 
                    value={settingsForm.calc_badge}
                    onChange={(e) => setSettingsForm({...settingsForm, calc_badge: e.target.value})}
                    placeholder="INTERACTIVE CALCULATOR"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Calculator Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.calc_title}
                    onChange={(e) => setSettingsForm({...settingsForm, calc_title: e.target.value})}
                    placeholder="Design your meal in your own way"
                    className="admin-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Calculator Subtitle / Description</label>
                  <textarea 
                    value={settingsForm.calc_subtitle}
                    onChange={(e) => setSettingsForm({...settingsForm, calc_subtitle: e.target.value})}
                    placeholder="Select and combine multiple pre-configured salad plans to build your custom subscription combo package. Live pricing updates instantly."
                    className="admin-textarea"
                    style={{ minHeight: '80px' }}
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

          {/* TAB: FOOTER SETTINGS (SEPARATE FROM SITE SETTINGS) */}
          {activeTab === 'footer' && (
            <form onSubmit={handleSettingsSubmit}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Footer & Social Settings</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure footer texts, hours, delivery descriptions, multiple phone listings, and social link handles.</p>

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
                    placeholder="hello@nutribox.com"
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
                  placeholder="123 Green Avenue, HSR Layout, Bangalore"
                  className="admin-input"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Working Hours Statement</label>
                <input 
                  type="text" 
                  value={settingsForm.business_hours}
                  onChange={(e) => setSettingsForm({...settingsForm, business_hours: e.target.value})}
                  placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                  className="admin-input"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Delivery Description / Info Statement (Authorable)</label>
                <textarea 
                  value={settingsForm.delivery_info}
                  onChange={(e) => setSettingsForm({...settingsForm, delivery_info: e.target.value})}
                  placeholder="e.g. All orders are prepared fresh at 5:00 AM each morning and dispatched for delivery..."
                  className="admin-textarea"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '10px' }}>
                <div className="admin-input-group">
                  <label className="admin-label">WhatsApp Handle Number (e.g. +91 94299 29822)</label>
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
                <label className="admin-label">Footer Copyright Label / Text</label>
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
                  Save Footer Settings
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

              {/* Data Migration Option when Connected to Supabase */}
              {!isDemoMode && (
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  backgroundColor: 'var(--bg-color)',
                  marginTop: '24px'
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    📦 Migrate Local Browser Data to Cloud Database
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                    If you entered salad recipes, plans, settings, or inquiries while running in offline "Demo Mode" and would like to copy them to your connected Supabase database, you can initiate a migration now. 
                    <br />
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Note:</span> This will safely insert all your local records into your active remote database.
                  </p>

                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to migrate all local browser storage data into your active Supabase database?")) {
                        try {
                          const localSalads = JSON.parse(localStorage.getItem('nutribox_salads') || '[]');
                          const localPlans = JSON.parse(localStorage.getItem('nutribox_plans') || '[]');
                          const localSettings = JSON.parse(localStorage.getItem('nutribox_settings') || '{}');
                          const localInquiries = JSON.parse(localStorage.getItem('nutribox_inquiries') || '[]');

                          // Migrate Settings
                          if (Object.keys(localSettings).length > 0) {
                            // Strip keys that shouldn't override cloud defaults if empty
                            const cleanSettings = { ...localSettings };
                            delete cleanSettings.logo_url; // Don't wipe cloud logos if empty
                            await updateMultipleSettings(cleanSettings);
                          }

                          // Migrate Salads (Insert one by one to trigger Supabase inserts)
                          for (const salad of localSalads) {
                            // Verify salad does not already exist by title to prevent duplicates
                            const exists = salads.some(s => s.title.toLowerCase() === salad.title.toLowerCase());
                            if (!exists) {
                              const { id, created_at, ...cleanSalad } = salad; // remove offline IDs to auto-generate UUIDs
                              await addSalad(cleanSalad);
                            }
                          }

                          // Migrate Plans
                          for (const plan of localPlans) {
                            const exists = saladPlans.some(p => p.title.toLowerCase() === plan.title.toLowerCase());
                            if (!exists) {
                              const { id, created_at, ...cleanPlan } = plan;
                              await addSaladPlan(cleanPlan);
                            }
                          }

                          triggerAlert("Data migration successfully completed! Refreshing page...");
                          setTimeout(() => {
                            window.location.reload();
                          }, 1500);
                        } catch (err) {
                          console.error("Migration failed:", err);
                          triggerAlert("Migration failed: " + err.message, "error");
                        }
                      }
                    }}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  >
                    <Database size={16} />
                    Start Local Storage Migration
                  </button>
                </div>
              )}

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

          {/* TAB 4: Calculator Setup */}
          {activeTab === 'calculator' && (
            <form onSubmit={handleSettingsSubmit}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Calculator Setup</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Configure the WhatsApp checkout number and select which Salad Plans appear in the front-end custom builder.</p>

              <div className="admin-input-group">
                <label className="admin-label">Calculator WhatsApp Number</label>
                <input 
                  type="text" 
                  value={settingsForm.calculator_whatsapp}
                  onChange={(e) => setSettingsForm({...settingsForm, calculator_whatsapp: e.target.value})}
                  className="admin-input"
                  placeholder="e.g. +91 94299 29822"
                />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  This specific number will receive the inquiry texts from the front-end calculator section.
                </span>
              </div>

              <div className="admin-input-group" style={{ marginTop: '30px' }}>
                <label className="admin-label" style={{ marginBottom: '12px', fontWeight: 700 }}>Choose Featured Plans for Calculator Checklist</label>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Check the Salad Plans you would like to make available for customized ordering. If no plans are selected, all created plans will appear.</p>
                
                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '20px',
                  backgroundColor: 'var(--bg-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {saladPlans.map(plan => {
                    const currentFeaturedStr = settingsForm.calculator_featured_plans || '';
                    let currentIds = currentFeaturedStr.split(',').map(id => id.trim()).filter(Boolean);
                    const isChecked = currentIds.includes(plan.id);

                    const handlePlanCheckToggle = () => {
                      if (isChecked) {
                        currentIds = currentIds.filter(id => id !== plan.id);
                      } else {
                        currentIds.push(plan.id);
                      }
                      setSettingsForm({ ...settingsForm, calculator_featured_plans: currentIds.join(',') });
                    };

                    return (
                      <label 
                        key={plan.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          fontSize: '14px', 
                          color: 'var(--text-main)', 
                          cursor: 'pointer',
                          padding: '6px 0'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={handlePlanCheckToggle}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontWeight: 600 }}>{plan.title}</span>
                        <span style={{ color: 'var(--text-muted)' }}>(₹{plan.price} / {plan.plan_type === 'combo' ? 'Combo' : 'Individual'})</span>
                      </label>
                    );
                  })}
                  {saladPlans.length === 0 && (
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No salad plans found. Please add plans in the \"Salad Plans\" tab first.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  Save Calculator Setup
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: Inquiries Log */}
          {activeTab === 'inquiries' && (
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>Inquiries Log</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Track all lead details, package inquiries, and phone numbers captured across the website.</p>

              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-dark)', textAlign: 'left' }}>
                      <th style={{ padding: '16px' }}>Date & Time</th>
                      <th style={{ padding: '16px' }}>Phone Number</th>
                      <th style={{ padding: '16px' }}>Source Path</th>
                      <th style={{ padding: '16px' }}>Submitted Data</th>
                      <th style={{ padding: '16px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => {
                      const details = inq.submitted_data || {};
                      const isCustom = details.inquiry_type === 'Custom Plan Calculator Combination';
                      
                      const renderDetails = () => {
                        if (isCustom) {
                          const plans = details.selected_plans || [];
                          return (
                            <div>
                              <strong style={{ color: 'var(--primary)' }}>Custom Combo:</strong> {details.custom_package_name || 'N/A'}<br />
                              <strong>Total Price:</strong> ₹{details.total_price || 0}<br />
                              <strong>Selected:</strong> {plans.map(p => p.title).join(', ') || 'None'}<br />
                              {details.message && <span><strong>Message:</strong> {details.message}</span>}
                            </div>
                          );
                        } else {
                          return (
                            <div>
                              <strong style={{ color: 'var(--accent)' }}>Plan Subscribe:</strong> {details.plan_name || 'N/A'}<br />
                              {details.message && <span><strong>Message:</strong> {details.message}</span>}
                            </div>
                          );
                        }
                      };

                      return (
                        <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-light)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '16px', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                            {new Date(inq.created_at).toLocaleString()}
                          </td>
                          <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {inq.phone_number || 'N/A'}
                          </td>
                          <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {inq.source_path || '/'}
                          </td>
                          <td style={{ padding: '16px', fontSize: '13px', lineHeight: 1.4, color: 'var(--text-main)' }}>
                            {renderDetails()}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button 
                              type="button" 
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this inquiry record?")) {
                                  try {
                                    await deleteInquiry(inq.id);
                                    triggerAlert("Inquiry deleted successfully!");
                                  } catch (err) {
                                    triggerAlert("Failed to delete inquiry.", "error");
                                  }
                                }
                              }} 
                              style={{ ...actionBtnStyle, color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger)'; e.currentTarget.style.color = '#ffffff'; }}
                              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--card-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {inquiries.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No inquiries logged yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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

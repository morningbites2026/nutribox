import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const ContentContext = createContext();

export const isRecipeActive = (saladItemId, salads) => {
  if (!saladItemId || !Array.isArray(salads)) return true;
  const [saladId] = saladItemId.split(':');
  const salad = salads.find(s => s.id === saladId);
  return salad ? salad.active !== false : true;
};

export const menuIdToUuid = (menuItemId) => {
  if (!menuItemId) return null;
  const idStr = menuItemId.toString().trim();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(idStr)) {
    return idStr.toLowerCase();
  }
  const cleanInt = parseInt(idStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(cleanInt)) {
    return '00000000-0000-0000-0000-000000000000';
  }
  const hex = cleanInt.toString(16).padStart(12, '0');
  return `00000000-0000-0000-0000-${hex}`;
};

// Mock Initial Data for LocalStorage fallback
const defaultSettings = {
  business_name: 'Nutribox',
  logo_url: '/logo.jpg',
  hero_title: 'Fresh, Chef-Crafted Salads & Combos Delivered to Your Door',
  hero_subtitle: 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.',
  contact_email: 'hello@nutribox.com',
  contact_phone: '+91 94299 29822, +91 98765 43210',
  contact_address: '123 Green Avenue, Sector 5, HSR Layout, Bangalore, Karnataka 560102',
  business_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
  admin_passcode: 'admin123',
  social_whatsapp: '+91 94299 29822',
  social_instagram: 'https://instagram.com/nutribox',
  footer_text: '© 2026 Nutribox. Fresh & Healthy Salad Subscriptions.',
  delivery_info: 'All orders are prepared fresh at 5:00 AM each morning and dispatched for delivery in temperature-controlled boxes.',
  calculator_whatsapp: '+91 94299 29822',
  calculator_featured_plans: '', // Comma-separated plan IDs to filter display
  showcase_plans: '', // Comma-separated plan IDs to showcase on frontend
  samples_badge: 'Sample Packs',
  samples_title: 'Do you want to try a sample pack?',
  samples_subtitle: 'You can also try the samples listed below. Select from our showcase recipes and order a single test pack to experience the taste and freshness before subscribing.',
  plans_badge: 'Choose Your Plan',
  plans_title: 'Salad Subscriptions Packages',
  plans_subtitle: 'Select from our chef-curated individual or combo health-focused packages. Skip, pause, or customize delivery slots at your convenience.',
  calc_badge: 'INTERACTIVE CALCULATOR',
  calc_title: 'Design your meal in your own way',
  calc_subtitle: 'Select and combine multiple pre-configured salad plans to build your custom subscription combo package. Live pricing updates instantly.'
};

const defaultSalads = [
  {
    id: 's1',
    title: 'Garden Greens Salad',
    description: 'Fresh leafy greens, cucumber, tomatoes, and organic seeds.',
    variant_support: 'both', // 'half', 'full', 'both'
    price_half: 100,
    price_full: 180,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Pumpkin Seeds', 'Lemon Vinaigrette'],
    tags: ['Low Carb', 'Vegan', 'Organic']
  },
  {
    id: 's2',
    title: 'Protein Booster Salad',
    description: 'Grilled chicken breast with almonds, greens, and broccoli.',
    variant_support: 'both',
    price_half: 150,
    price_full: 260,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Grilled Chicken Breast', 'Mixed Greens', 'Broccoli Florets', 'Almonds', 'Tahini Dressing'],
    tags: ['High Protein', 'Gluten Free']
  },
  {
    id: 's3',
    title: 'Keto Smoked Salmon',
    description: 'High healthy fats from smoked salmon, hard boiled egg, and walnuts.',
    variant_support: 'both',
    price_half: 170,
    price_full: 290,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'],
    tags: ['Keto', 'High Fat', 'Gluten Free']
  },
  {
    id: 's4',
    title: 'Feta Berry Crunch',
    description: 'Vegetarian delight with crumbled feta, fresh berries, and walnuts.',
    variant_support: 'both',
    price_half: 120,
    price_full: 200,
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Feta Cheese', 'Strawberries', 'Spinach', 'Walnuts', 'Balsamic Vinaigrette'],
    tags: ['Vegetarian', 'Gluten Free']
  }
];

const defaultPlans = [
  {
    id: 'p1',
    title: 'Lean & Clean Single Plan',
    description: 'Enjoy a 10-meal pack of our low-carb Garden Greens Salad (Half Pack) to jumpstart your diet.',
    plan_type: 'individual', // 'individual' or 'combo'
    price: 400,
    meals_count: 10,
    salad_items: ['s1:half'],
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p2',
    title: 'Detox & Greens Combo Plan',
    description: 'A healthy combination of Garden Greens (Half Pack) and Feta Berry Crunch (Full Pack) to stay active.',
    plan_type: 'combo',
    price: 600,
    meals_count: 10,
    salad_items: ['s1:half', 's4:full'],
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p3',
    title: 'Muscle Recovery Combo Plan',
    description: 'Premium protein-heavy combo featuring Protein Booster (Full Pack) and Keto Smoked Salmon (Full Pack).',
    plan_type: 'combo',
    price: 900,
    meals_count: 10,
    salad_items: ['s2:full', 's3:full'],
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
  }
];

export const ContentProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [salads, setSalads] = useState([]);
  const [saladPlans, setSaladPlans] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Loaded active salads from existing menu_items table
  const [menuItemSalads, setMenuItemSalads] = useState([
    { id: 5, name: 'Sprouts Salad', description: 'Healthy sprouts mix', type: 'salad', is_active: true, options: [{name: 'Half pack', price: 45}, {name: 'Full Pack', price: 65}] },
    { id: 19, name: 'Chickpea Salad', description: 'Zesty chickpea blend', type: 'salad', is_active: true, options: [{name: 'Half', price: 60}, {name: 'Full', price: 90}] },
    { id: 20, name: 'Fruit salad', description: 'Fresh seasonal fruits', type: 'salad', is_active: true, options: [{name: 'Regular', price: 65}] }
  ]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Global modals states
  const [activeSubscribePlan, setActiveSubscribePlan] = useState(null);
  const [activeDialerPhones, setActiveDialerPhones] = useState(null);
  const [activeTrackerOpen, setActiveTrackerOpen] = useState(false);

  // Initialize Supabase Client if env variables exist
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id')) {
      try {
        const client = createClient(supabaseUrl, supabaseAnonKey);
        setSupabaseClient(client);
        setIsDemoMode(false);
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
        setIsDemoMode(true);
      }
    } else {
      setIsDemoMode(true);
    }
  }, []);

  // Fetch all settings, salads, plans, and inquiries
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      if (supabaseClient && !isDemoMode) {
        try {
          // Load settings
          const { data: settingsData, error: settingsError } = await supabaseClient
            .from('site_settings')
            .select('*');
          
          if (settingsError) throw settingsError;

          if (settingsData && settingsData.length > 0) {
            const settingsObj = {};
            settingsData.forEach(item => {
              settingsObj[item.key] = item.value;
            });
            setSiteSettings(prev => ({ ...prev, ...settingsObj }));
          }

          // Load salads
          const { data: saladsData, error: saladsError } = await supabaseClient
            .from('salads')
            .select('*')
            .order('created_at', { ascending: true });
          
          if (saladsError) throw saladsError;
          if (saladsData) {
            setSalads(saladsData.map(s => ({ ...s, active: s.active !== false })));
          }

          // Load salads from the main menu_items table if they exist
          try {
            const { data: menuData, error: menuError } = await supabaseClient
              .from('menu_items')
              .select('*')
              .eq('type', 'salad')
              .eq('is_active', true);
            
            if (!menuError && menuData) {
              setMenuItemSalads(menuData);
            }
          } catch (err) {
            console.warn("Could not load from menu_items table (might not exist):", err);
          }

          // Load plans
          const { data: plansData, error: plansError } = await supabaseClient
            .from('salad_plans')
            .select('*')
            .order('created_at', { ascending: true });
          
          if (plansError) throw plansError;
          if (plansData) {
            setSaladPlans(plansData.map(p => ({ ...p, active: p.active !== false })));
          }

          // Load inquiries
          const { data: inquiriesData, error: inquiriesError } = await supabaseClient
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!inquiriesError && inquiriesData) {
            setInquiries(inquiriesData);
          }
          // Load subscriptions (joined from customers, customer_packages & packages tables)
          try {
            const { data: customersData, error: customersError } = await supabaseClient
              .from('customers')
              .select('*')
              .eq('is_deleted', false)
              .order('created_at', { ascending: false });

            const { data: packagesData, error: packagesError } = await supabaseClient
              .from('packages')
              .select('*');

            const { data: customerPackagesData, error: customerPackagesError } = await supabaseClient
              .from('customer_packages')
              .select('*')
              .neq('status', 'cancelled');

            if (!customersError && customersData) {
              const pkgs = packagesData || [];
              const mapped = [];

              customersData.forEach(c => {
                const cPacks = customerPackagesData ? customerPackagesData.filter(cp => cp.customer_id === c.id) : [];

                if (cPacks.length > 0) {
                  // Active packages for this customer
                  cPacks.forEach(cp => {
                    const pkg = pkgs.find(p => p.id === cp.package_id);
                    const remainingMeals = Math.max(0, (cp.total || 0) - (cp.used || 0));
                    
                    // Custom status mapping logic
                    let resolvedStatus = cp.status || 'active';
                    if (resolvedStatus === 'active') {
                      if (remainingMeals === 0) {
                        resolvedStatus = 'done';
                      } else if (remainingMeals <= 2) {
                        resolvedStatus = 'low';
                      }
                    } else if (resolvedStatus === 'hold') {
                      resolvedStatus = 'hold';
                    } else if (resolvedStatus === 'done') {
                      resolvedStatus = 'done';
                    }

                    // Only map ongoing/active subscriptions (exclude done and cancelled)
                    if (resolvedStatus !== 'done' && resolvedStatus !== 'cancelled') {
                      mapped.push({
                        id: `${c.id}:${cp.id}`,
                        customer_id: c.id,
                        customer_name: c.name,
                        phone_number: c.phone,
                        plan_name: pkg ? pkg.name : 'Salad Plan',
                        meals_total: cp.total || 10,
                        meals_remaining: remainingMeals,
                        status: resolvedStatus,
                        allow_tracking: c.allow_tracking === true
                      });
                    }
                  });
                } else if (c.package_id) {
                  // Fallback for legacy customers without customer_packages rows
                  const pkg = pkgs.find(p => p.id === c.package_id);
                  const remainingMeals = Math.max(0, (c.total || 10) - (c.used || 0));
                  
                  let resolvedStatus = c.status || 'active';
                  if (resolvedStatus === 'active') {
                    if (remainingMeals === 0) {
                      resolvedStatus = 'done';
                    } else if (remainingMeals <= 2) {
                      resolvedStatus = 'low';
                    }
                  }

                  // Only map ongoing/active subscriptions (exclude done and cancelled)
                  if (resolvedStatus !== 'done' && resolvedStatus !== 'cancelled') {
                    mapped.push({
                      id: `${c.id}:legacy`,
                      customer_id: c.id,
                      customer_name: c.name,
                      phone_number: c.phone,
                      plan_name: pkg ? pkg.name : 'Salad Plan',
                      meals_total: c.total || 10,
                      meals_remaining: remainingMeals,
                      status: resolvedStatus,
                      allow_tracking: c.allow_tracking === true
                    });
                  }
                }
              });
              setSubscriptions(mapped);
            } else {
              // Fallback to local
              const savedSubs = localStorage.getItem('nutribox_subscriptions');
              if (savedSubs) setSubscriptions(JSON.parse(savedSubs));
            }
          } catch (err) {
            console.warn("Could not load subscribers from database:", err);
            const savedSubs = localStorage.getItem('nutribox_subscriptions');
            if (savedSubs) setSubscriptions(JSON.parse(savedSubs));
          }
        } catch (error) {
          console.error("Error loading data from Supabase. Falling back to local state:", error);
          loadFromLocalStorage();
        }
      } else {
        // Fallback: LocalStorage
        loadFromLocalStorage();
      }
      setLoading(false);
    };

    loadContent();
  }, [supabaseClient, isDemoMode]);

  const loadFromLocalStorage = () => {
    const savedSettings = localStorage.getItem('nutribox_settings');
    const savedSalads = localStorage.getItem('nutribox_salads');
    const savedPlans = localStorage.getItem('nutribox_plans');
    const savedInquiries = localStorage.getItem('nutribox_inquiries');

    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem('nutribox_settings', JSON.stringify(defaultSettings));
    }

    if (savedSalads) {
      const parsedSalads = JSON.parse(savedSalads);
      setSalads(parsedSalads.map(s => ({ ...s, active: s.active !== false })));
    } else {
      localStorage.setItem('nutribox_salads', JSON.stringify(defaultSalads));
    }

    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      setSaladPlans(parsedPlans.map(p => ({ ...p, active: p.active !== false })));
    } else {
      localStorage.setItem('nutribox_plans', JSON.stringify(defaultPlans));
    }

    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    } else {
      localStorage.setItem('nutribox_inquiries', JSON.stringify([]));
    }

    const savedSubs = localStorage.getItem('nutribox_subscriptions');
    if (savedSubs) {
      setSubscriptions(JSON.parse(savedSubs));
    } else {
      localStorage.setItem('nutribox_subscriptions', JSON.stringify([]));
    }
  };

  // Update site settings
  const updateMultipleSettings = async (settingsObj) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...settingsObj };
      if (isDemoMode) {
        localStorage.setItem('nutribox_settings', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const upserts = Object.keys(settingsObj).map(key => ({
        key,
        value: settingsObj[key],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabaseClient
        .from('site_settings')
        .upsert(upserts);
      
      if (error) {
        console.error("Failed to batch update settings in Supabase:", error);
        throw error;
      }
    }
  };

  // Safe phone dialer router
  const openPhoneDialer = (phoneString) => {
    if (!phoneString) return;
    const phones = phoneString.split(',').map(p => p.trim()).filter(Boolean);
    if (phones.length <= 1) {
      const cleanPhoneNum = phones[0] ? phones[0].replace(/[^\d+]/g, '') : '';
      window.location.href = `tel:${cleanPhoneNum}`;
    } else {
      setActiveDialerPhones(phones);
    }
  };

  // ==========================================
  // INQUIRIES OPERATIONS
  // ==========================================

  const recordInquiry = async (inquiryData) => {
    const rawData = {
      phone_number: inquiryData.phone_number || '',
      source_path: inquiryData.source_path || window.location.pathname || '/',
      submitted_data: inquiryData.submitted_data || {},
      created_at: new Date().toISOString()
    };

    if (isDemoMode) {
      const id = Date.now().toString();
      const newInq = { ...rawData, id };
      setInquiries(prev => {
        const updated = [newInq, ...prev];
        localStorage.setItem('nutribox_inquiries', JSON.stringify(updated));
        return updated;
      });
      return newInq;
    } else {
      const { data, error } = await supabaseClient
        .from('inquiries')
        .insert([rawData])
        .select();

      if (error) {
        console.error("Failed to insert inquiry into Supabase:", error);
        throw error;
      }
      if (data && data[0]) {
        setInquiries(prev => [data[0], ...prev]);
        return data[0];
      }
    }
  };

  const deleteInquiry = async (id) => {
    setInquiries(prev => {
      const updated = prev.filter(i => i.id !== id);
      if (isDemoMode) {
        localStorage.setItem('nutribox_inquiries', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Failed to delete inquiry ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  // ==========================================
  // SALADS CRUD OPERATIONS
  // ==========================================

  const addSalad = async (newSalad) => {
    if (isDemoMode) {
      const id = Date.now().toString();
      const saladWithId = { ...newSalad, id };
      setSalads(prev => {
        const updated = [...prev, saladWithId];
        localStorage.setItem('nutribox_salads', JSON.stringify(updated));
        return updated;
      });
      return saladWithId;
    } else {
      const { data, error } = await supabaseClient
        .from('salads')
        .insert([{
          title: newSalad.title,
          description: newSalad.description,
          variant_support: newSalad.variant_support,
          price_half: parseFloat(newSalad.price_half) || 0,
          price_full: parseFloat(newSalad.price_full) || 0,
          ingredients: newSalad.ingredients,
          tags: newSalad.tags,
          image_url: newSalad.image_url
        }])
        .select();

      if (error) {
        console.error("Failed to insert salad in Supabase:", error);
        throw error;
      }
      
      if (data && data[0]) {
        setSalads(prev => [...prev, data[0]]);
        return data[0];
      }
    }
  };

  const addSaladFromMenuItem = async (menuItem, customFields) => {
    const options = Array.isArray(menuItem.options) ? menuItem.options : [];
    let variant_support = 'both';
    let price_half = 0;
    let price_full = 0;

    if (options.length === 1) {
      const opt = options[0];
      const nameLower = (opt.name || opt.label || '').toLowerCase();
      if (nameLower.includes('half')) {
        price_half = opt.price || 0;
        variant_support = 'half';
      } else {
        price_full = opt.price || 0;
        variant_support = 'full';
      }
    } else if (options.length >= 2) {
      const halfOpt = options.find(o => (o.name || o.label || '').toLowerCase().includes('half'));
      const fullOpt = options.find(o => (o.name || o.label || '').toLowerCase().includes('full'));
      if (halfOpt) price_half = halfOpt.price || 0;
      if (fullOpt) price_full = fullOpt.price || 0;

      if (!halfOpt && options[0]) price_half = options[0].price || 0;
      if (!fullOpt && options[1]) price_full = options[1].price || 0;
      
      variant_support = 'both';
    }

    const cleanSalad = {
      id: menuIdToUuid(menuItem.id),
      title: menuItem.name || menuItem.title || 'Unnamed Salad',
      description: menuItem.description || '',
      variant_support,
      price_half,
      price_full,
      image_url: customFields.image_url || menuItem.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      ingredients: customFields.ingredients_raw ? customFields.ingredients_raw.split('\n').map(i => i.trim()).filter(Boolean) : [],
      tags: customFields.tags_raw ? customFields.tags_raw.split(',').map(t => t.trim()).filter(Boolean) : [],
      active: customFields.active !== false
    };

    setSalads(prev => {
      const filtered = prev.filter(s => s.id !== cleanSalad.id);
      const updated = [...filtered, cleanSalad];
      if (isDemoMode) {
        localStorage.setItem('nutribox_salads', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('salads')
        .upsert([cleanSalad]);

      if (error) {
        console.error("Failed to upsert salad recipe:", error);
        throw error;
      }
    }
  };

  const updateSalad = async (id, updatedSalad) => {
    setSalads(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updatedSalad } : s);
      if (isDemoMode) {
        localStorage.setItem('nutribox_salads', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const updatePayload = {};
      if (updatedSalad.title !== undefined) updatePayload.title = updatedSalad.title;
      if (updatedSalad.description !== undefined) updatePayload.description = updatedSalad.description;
      if (updatedSalad.variant_support !== undefined) updatePayload.variant_support = updatedSalad.variant_support;
      if (updatedSalad.price_half !== undefined) updatePayload.price_half = parseFloat(updatedSalad.price_half) || 0;
      if (updatedSalad.price_full !== undefined) updatePayload.price_full = parseFloat(updatedSalad.price_full) || 0;
      if (updatedSalad.ingredients !== undefined) updatePayload.ingredients = updatedSalad.ingredients;
      if (updatedSalad.tags !== undefined) updatePayload.tags = updatedSalad.tags;
      if (updatedSalad.image_url !== undefined) updatePayload.image_url = updatedSalad.image_url;
      if (updatedSalad.active !== undefined) updatePayload.active = updatedSalad.active;

      const { error } = await supabaseClient
        .from('salads')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error(`Failed to update salad ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  const deleteSalad = async (id) => {
    setSalads(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (isDemoMode) {
        localStorage.setItem('nutribox_salads', JSON.stringify(updated));
      }
      return updated;
    });

    setSaladPlans(prevPlans => {
      const updatedPlans = prevPlans.map(plan => ({
        ...plan,
        salad_items: plan.salad_items ? plan.salad_items.filter(item => !item.startsWith(`${id}:`)) : []
      }));
      if (isDemoMode) {
        localStorage.setItem('nutribox_plans', JSON.stringify(updatedPlans));
      }
      return updatedPlans;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('salads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Failed to delete salad ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  // ==========================================
  // SALAD PLANS CRUD
  // ==========================================

  const addSaladPlan = async (newPlan) => {
    const planToSave = { ...newPlan, active: newPlan.active !== false };
    if (isDemoMode) {
      const id = Date.now().toString();
      const planWithId = { ...planToSave, id };
      setSaladPlans(prev => {
        const updated = [...prev, planWithId];
        localStorage.setItem('nutribox_plans', JSON.stringify(updated));
        return updated;
      });
      return planWithId;
    } else {
      const { data, error } = await supabaseClient
        .from('salad_plans')
        .insert([{
          title: newPlan.title,
          description: newPlan.description,
          plan_type: newPlan.plan_type,
          price: parseFloat(newPlan.price) || 0,
          meals_count: parseInt(newPlan.meals_count) || 10,
          salad_items: newPlan.salad_items || [],
          image_url: newPlan.image_url,
          active: newPlan.active !== false
        }])
        .select();

      if (error) {
        console.error("Failed to insert salad plan in Supabase:", error);
        throw error;
      }
      
      if (data && data[0]) {
        setSaladPlans(prev => [...prev, { ...data[0], active: data[0].active !== false }]);
        return data[0];
      }
    }
  };

  const updateSaladPlan = async (id, updatedPlan) => {
    setSaladPlans(prev => {
      const updated = prev.map(plan => plan.id === id ? { ...plan, ...updatedPlan } : plan);
      if (isDemoMode) {
        localStorage.setItem('nutribox_plans', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const updatePayload = {};
      if (updatedPlan.title !== undefined) updatePayload.title = updatedPlan.title;
      if (updatedPlan.description !== undefined) updatePayload.description = updatedPlan.description;
      if (updatedPlan.plan_type !== undefined) updatePayload.plan_type = updatedPlan.plan_type;
      if (updatedPlan.price !== undefined) updatePayload.price = parseFloat(updatedPlan.price) || 0;
      if (updatedPlan.meals_count !== undefined) updatePayload.meals_count = parseInt(updatedPlan.meals_count) || 10;
      if (updatedPlan.salad_items !== undefined) updatePayload.salad_items = updatedPlan.salad_items;
      if (updatedPlan.image_url !== undefined) updatePayload.image_url = updatedPlan.image_url;
      if (updatedPlan.active !== undefined) updatePayload.active = updatedPlan.active;

      const { error } = await supabaseClient
        .from('salad_plans')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        console.error(`Failed to update salad plan ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  const deleteSaladPlan = async (id) => {
    setSaladPlans(prev => {
      const updated = prev.filter(plan => plan.id !== id);
      if (isDemoMode) {
        localStorage.setItem('nutribox_plans', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('salad_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Failed to delete salad plan ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  const addSubscription = async (sub) => {
    const newSub = {
      id: sub.id || Date.now().toString(),
      phone_number: sub.phone_number,
      customer_name: sub.customer_name,
      plan_name: sub.plan_name,
      meals_total: parseInt(sub.meals_total, 10) || 10,
      meals_remaining: parseInt(sub.meals_remaining, 10) || 10,
      status: sub.status || 'active',
      allow_tracking: sub.allow_tracking === true,
      created_at: sub.created_at || new Date().toISOString()
    };

    setSubscriptions(prev => {
      const filtered = prev.filter(s => s.phone_number !== newSub.phone_number);
      const updated = [...filtered, newSub];
      localStorage.setItem('nutribox_subscriptions', JSON.stringify(updated));
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      try {
        const { error } = await supabaseClient
          .from('customer_subscriptions')
          .upsert([newSub]);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to insert subscription in Supabase:", err);
      }
    }
  };

  const updateSubscription = async (id, updatedFields) => {
    setSubscriptions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updatedFields } : s);
      localStorage.setItem('nutribox_subscriptions', JSON.stringify(updated));
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      try {
        // Map database fields to customers table
        const dbFields = {};
        if (updatedFields.hasOwnProperty('allow_tracking')) {
          dbFields.allow_tracking = updatedFields.allow_tracking;
        }

        const { error } = await supabaseClient
          .from('customers')
          .update(dbFields)
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to update subscriber in Supabase:", err);
      }
    }
  };

  const deleteSubscription = async (id) => {
    setSubscriptions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('nutribox_subscriptions', JSON.stringify(updated));
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      try {
        const { error } = await supabaseClient
          .from('customer_subscriptions')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to delete subscription from Supabase:", err);
      }
    }
  };

  return (
    <ContentContext.Provider value={{
      siteSettings,
      salads,
      saladPlans,
      inquiries,
      loading,
      isDemoMode,
      updateMultipleSettings,
      activeSubscribePlan,
      setActiveSubscribePlan,
      activeDialerPhones,
      setActiveDialerPhones,
      openPhoneDialer,
      recordInquiry,
      deleteInquiry,
      addSalad,
      updateSalad,
      deleteSalad,
      addSaladPlan,
      updateSaladPlan,
      deleteSaladPlan,
      menuItemSalads,
      addSaladFromMenuItem,
      subscriptions,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      activeTrackerOpen,
      setActiveTrackerOpen
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};

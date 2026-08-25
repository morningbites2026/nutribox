import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const ContentContext = createContext();

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
  delivery_info: 'All orders are prepared fresh at 5:00 AM each morning and dispatched for delivery in temperature-controlled boxes.'
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
  const [salads, setSalads] = useState(defaultSalads);
  const [saladPlans, setSaladPlans] = useState(defaultPlans);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);

  // Global modals states
  const [activeSubscribePlan, setActiveSubscribePlan] = useState(null);
  const [activeDialerPhones, setActiveDialerPhones] = useState(null);

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

  // Fetch all settings, salads, and plans
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
            setSalads(saladsData);
          }

          // Load plans
          const { data: plansData, error: plansError } = await supabaseClient
            .from('salad_plans')
            .select('*')
            .order('created_at', { ascending: true });
          
          if (plansError) throw plansError;
          if (plansData) {
            setSaladPlans(plansData);
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

    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem('nutribox_settings', JSON.stringify(defaultSettings));
    }

    if (savedSalads) {
      setSalads(JSON.parse(savedSalads));
    } else {
      localStorage.setItem('nutribox_salads', JSON.stringify(defaultSalads));
    }

    if (savedPlans) {
      setSaladPlans(JSON.parse(savedPlans));
    } else {
      localStorage.setItem('nutribox_plans', JSON.stringify(defaultPlans));
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

  const updateSalad = async (id, updatedSalad) => {
    setSalads(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updatedSalad } : s);
      if (isDemoMode) {
        localStorage.setItem('nutribox_salads', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('salads')
        .update({
          title: updatedSalad.title,
          description: updatedSalad.description,
          variant_support: updatedSalad.variant_support,
          price_half: parseFloat(updatedSalad.price_half) || 0,
          price_full: parseFloat(updatedSalad.price_full) || 0,
          ingredients: updatedSalad.ingredients,
          tags: updatedSalad.tags,
          image_url: updatedSalad.image_url
        })
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
    if (isDemoMode) {
      const id = Date.now().toString();
      const planWithId = { ...newPlan, id };
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
          image_url: newPlan.image_url
        }])
        .select();

      if (error) {
        console.error("Failed to insert salad plan in Supabase:", error);
        throw error;
      }
      
      if (data && data[0]) {
        setSaladPlans(prev => [...prev, data[0]]);
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
      const { error } = await supabaseClient
        .from('salad_plans')
        .update({
          title: updatedPlan.title,
          description: updatedPlan.description,
          plan_type: updatedPlan.plan_type,
          price: parseFloat(updatedPlan.price) || 0,
          meals_count: parseInt(updatedPlan.meals_count) || 10,
          salad_items: updatedPlan.salad_items || [],
          image_url: updatedPlan.image_url
        })
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

  return (
    <ContentContext.Provider value={{
      siteSettings,
      salads,
      saladPlans,
      loading,
      isDemoMode,
      updateMultipleSettings,
      activeSubscribePlan,
      setActiveSubscribePlan,
      activeDialerPhones,
      setActiveDialerPhones,
      openPhoneDialer,
      addSalad,
      updateSalad,
      deleteSalad,
      addSaladPlan,
      updateSaladPlan,
      deleteSaladPlan
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

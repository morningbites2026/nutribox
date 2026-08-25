import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const ContentContext = createContext();

// Mock Initial Data for LocalStorage fallback
const defaultSettings = {
  business_name: 'Nutribox',
  logo_url: '',
  hero_title: 'Fresh, Chef-Crafted Salad Plans Delivered to Your Door',
  hero_subtitle: 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.',
  contact_email: 'hello@nutribox.com',
  contact_phone: '+91 98765 43210',
  contact_address: '123 Green Avenue, Sector 5, HSR Layout, Bangalore, Karnataka 560102',
  business_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
  admin_passcode: 'admin123'
};

const defaultSalads = [
  {
    id: 's1',
    title: 'Garden Greens Salad',
    description: 'Fresh leafy greens, cucumber, tomatoes, and organic seeds.',
    price: 150,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Pumpkin Seeds', 'Lemon Vinaigrette'],
    tags: ['Low Carb', 'Vegan', 'Organic']
  },
  {
    id: 's2',
    title: 'Protein Booster Salad',
    description: 'Grilled chicken breast with almonds, greens, and broccoli.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Grilled Chicken Breast', 'Mixed Greens', 'Broccoli Florets', 'Almonds', 'Tahini Dressing'],
    tags: ['High Protein', 'Gluten Free']
  },
  {
    id: 's3',
    title: 'Keto Smoked Salmon',
    description: 'High healthy fats from smoked salmon, hard boiled egg, and walnuts.',
    price: 250,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'],
    tags: ['Keto', 'High Fat', 'Gluten Free']
  },
  {
    id: 's4',
    title: 'Feta Berry Crunch',
    description: 'Vegetarian delight with crumbled feta, fresh berries, and walnuts.',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=600',
    ingredients: ['Feta Cheese', 'Strawberries', 'Spinach', 'Walnuts', 'Balsamic Vinaigrette'],
    tags: ['Vegetarian', 'Gluten Free']
  }
];

const defaultPlans = [
  {
    id: 'p1',
    title: 'Lean & Green Plan',
    description: 'Designed for weight loss and detoxification. Combines our Garden Greens and Feta Berry salads.',
    price_weekly: 699,
    price_monthly: 2499,
    price_pack: 400,
    pack_name: '10 Pack',
    salad_ids: ['s1', 's4']
  },
  {
    id: 'p2',
    title: 'Protein Powerhouse Plan',
    description: 'Support muscle recovery with high protein chicken and salmon options.',
    price_weekly: 899,
    price_monthly: 3199,
    price_pack: 500,
    pack_name: '10 Pack',
    salad_ids: ['s2', 's3']
  },
  {
    id: 'p3',
    title: 'Keto Balance Plan',
    description: 'Ultra-low carb plan syncing our healthy Keto Smoked Salmon and Garden Greens salads.',
    price_weekly: 849,
    price_monthly: 2999,
    price_pack: 450,
    pack_name: '10 Pack',
    salad_ids: ['s1', 's3']
  }
];

export const ContentProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
  const [salads, setSalads] = useState(defaultSalads);
  const [saladPlans, setSaladPlans] = useState(defaultPlans);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState(null);

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

  // Update a single setting
  const updateSiteSetting = async (key, value) => {
    setSiteSettings(prev => {
      const updated = { ...prev, [key]: value };
      if (isDemoMode) {
        localStorage.setItem('nutribox_settings', JSON.stringify(updated));
      }
      return updated;
    });

    if (supabaseClient && !isDemoMode) {
      const { error } = await supabaseClient
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() });
      
      if (error) {
        console.error(`Failed to update setting ${key} in Supabase:`, error);
        throw error;
      }
    }
  };

  // Update multiple settings at once
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
          price: parseFloat(newSalad.price) || 0,
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
          price: parseFloat(updatedSalad.price) || 0,
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

    // Also remove from any plans containing this salad
    setSaladPlans(prevPlans => {
      const updatedPlans = prevPlans.map(plan => ({
        ...plan,
        salad_ids: plan.salad_ids ? plan.salad_ids.filter(sid => sid !== id) : []
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
  // SALAD PLANS CRUD OPERATIONS
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
          price_weekly: parseFloat(newPlan.price_weekly),
          price_monthly: parseFloat(newPlan.price_monthly),
          price_pack: parseFloat(newPlan.price_pack) || 0,
          pack_name: newPlan.pack_name || '10 Pack',
          salad_ids: newPlan.salad_ids || []
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
          price_weekly: parseFloat(updatedPlan.price_weekly),
          price_monthly: parseFloat(updatedPlan.price_monthly),
          price_pack: parseFloat(updatedPlan.price_pack) || 0,
          pack_name: updatedPlan.pack_name || '10 Pack',
          salad_ids: updatedPlan.salad_ids || []
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
      updateSiteSetting,
      updateMultipleSettings,
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

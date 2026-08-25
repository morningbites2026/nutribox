import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const ContentContext = createContext();

// Mock Initial Data for LocalStorage fallback
const defaultSettings = {
  business_name: 'Nutribox',
  hero_title: 'Fresh, Chef-Crafted Salad Plans Delivered to Your Door',
  hero_subtitle: 'Premium subscription-based healthy meal plans made with 100% organic ingredients, tailored to your dietary goals.',
  contact_email: 'hello@nutribox.com',
  contact_phone: '+1 (555) 123-4567',
  contact_address: '123 Green Avenue, Fresh Meadows, CA 90210',
  business_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
  admin_passcode: 'admin123'
};

const defaultPlans = [
  {
    id: '1',
    title: 'Lean & Green',
    description: 'Designed for weight loss and detoxification. High in fiber, low in carbs, and packed with fresh leafy greens.',
    price_weekly: 39.99,
    price_monthly: 149.99,
    calories: 320,
    ingredients: ['Baby Spinach', 'Arugula', 'Cucumber', 'Cherry Tomatoes', 'Avocado', 'Pumpkin Seeds', 'Lemon Vinaigrette'],
    tags: ['Low Carb', 'Weight Loss', 'Vegan'],
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Protein Powerhouse',
    description: 'Rich in clean proteins to support muscle growth and recovery. Balanced with wholesome grains and nuts.',
    price_weekly: 49.99,
    price_monthly: 189.99,
    calories: 540,
    ingredients: ['Grilled Chicken Breast', 'Quinoa', 'Mixed Greens', 'Broccoli Florets', 'Feta Cheese', 'Almonds', 'Tahini Dressing'],
    tags: ['High Protein', 'Gluten Free', 'Active Lifestyle'],
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Keto Balance',
    description: 'High healthy fats, moderate protein, and ultra-low carbs. Kept delicious with premium cheeses and dressings.',
    price_weekly: 45.99,
    price_monthly: 169.99,
    calories: 480,
    ingredients: ['Smoked Salmon', 'Hard Boiled Egg', 'Spinach', 'Kale', 'Avocado', 'Walnuts', 'Olive Oil & Herbs'],
    tags: ['Keto', 'High Fat', 'Gluten Free'],
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
  }
];

export const ContentProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(defaultSettings);
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

  // Fetch all settings and plans
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
          // If Supabase fetch fails, fallback to local storage
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
    const savedPlans = localStorage.getItem('nutribox_plans');

    if (savedSettings) {
      setSiteSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem('nutribox_settings', JSON.stringify(defaultSettings));
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

  // Add a salad plan
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
          calories: parseInt(newPlan.calories) || 0,
          ingredients: newPlan.ingredients,
          tags: newPlan.tags,
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

  // Update an existing salad plan
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
          calories: parseInt(updatedPlan.calories) || 0,
          ingredients: updatedPlan.ingredients,
          tags: updatedPlan.tags,
          image_url: updatedPlan.image_url
        })
        .eq('id', id);

      if (error) {
        console.error(`Failed to update salad plan ${id} in Supabase:`, error);
        throw error;
      }
    }
  };

  // Delete a salad plan
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
      saladPlans,
      loading,
      isDemoMode,
      updateSiteSetting,
      updateMultipleSettings,
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

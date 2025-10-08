import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FieldSetting {
  field_name: string;
  visible: boolean;
  disabled: boolean;
  tab_name: string;
}

interface FieldConfig {
  [fieldName: string]: {
    visible: boolean;
    disabled: boolean;
    tab: string;
  };
}

const COMPANY_ID = '00000000-0000-0000-0000-000000000001';
const settingsCache = new Map<string, { data: FieldConfig; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const ALL_TABS = ['basis', 'inkoop', 'voorraad', 'categorie', 'dranken', 'wijn', 'verkoop', 'extra'];

export function useFieldSettings(category: string | undefined) {
  const [fieldConfig, setFieldConfig] = useState<FieldConfig>({});
  const [loading, setLoading] = useState(true);
  const [availableTabs, setAvailableTabs] = useState<string[]>(ALL_TABS);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      setAvailableTabs(ALL_TABS);
      return;
    }

    loadFieldSettings(category);
  }, [category]);

  const loadFieldSettings = async (cat: string) => {
    setLoading(true);

    const cached = settingsCache.get(cat);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setFieldConfig(cached.data);
      setAvailableTabs(ALL_TABS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('article_field_settings')
        .select('field_name, visible, disabled, tab_name')
        .eq('company_id', COMPANY_ID)
        .eq('category', cat);

      if (error) throw error;

      const config: FieldConfig = {};
      data?.forEach((setting: FieldSetting) => {
        config[setting.field_name] = {
          visible: setting.visible,
          disabled: setting.disabled,
          tab: setting.tab_name,
        };
      });

      settingsCache.set(cat, { data: config, timestamp: Date.now() });
      setFieldConfig(config);
      setAvailableTabs(ALL_TABS);
    } catch (err) {
      console.error('Error loading field settings:', err);
      setFieldConfig({});
      setAvailableTabs(ALL_TABS);
    } finally {
      setLoading(false);
    }
  };

  const shouldShowField = (fieldName: string): boolean => {
    return true;
  };

  const isFieldDisabled = (fieldName: string): boolean => {
    const setting = fieldConfig[fieldName];
    if (!setting) return false;
    return !setting.visible || setting.disabled;
  };

  const getFieldTab = (fieldName: string, defaultTab: string = 'basis'): string => {
    const setting = fieldConfig[fieldName];
    if (!setting) return defaultTab;
    return setting.tab;
  };

  const invalidateCache = () => {
    if (category) {
      settingsCache.delete(category);
      loadFieldSettings(category);
    }
  };

  return {
    fieldConfig,
    loading,
    availableTabs,
    shouldShowField,
    isFieldDisabled,
    getFieldTab,
    invalidateCache,
  };
}

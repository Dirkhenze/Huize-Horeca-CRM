import { supabase } from './supabase';

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

export async function getFieldConfig(category: string): Promise<FieldConfig> {
  try {
    const { data, error } = await supabase
      .from('article_field_settings')
      .select('field_name, visible, disabled, tab_name')
      .eq('company_id', COMPANY_ID)
      .eq('category', category);

    if (error) {
      console.error('Error fetching field settings:', error);
      return {};
    }

    const config: FieldConfig = {};
    data?.forEach((setting: FieldSetting) => {
      config[setting.field_name] = {
        visible: setting.visible,
        disabled: setting.disabled,
        tab: setting.tab_name,
      };
    });

    return config;
  } catch (err) {
    console.error('Exception fetching field settings:', err);
    return {};
  }
}

export function shouldShowField(fieldName: string, config: FieldConfig): boolean {
  const setting = config[fieldName];
  if (!setting) return true;
  return setting.visible;
}

export function isFieldDisabled(fieldName: string, config: FieldConfig): boolean {
  const setting = config[fieldName];
  if (!setting) return false;
  return setting.disabled;
}

export function getFieldTab(fieldName: string, config: FieldConfig, defaultTab: string): string {
  const setting = config[fieldName];
  if (!setting) return defaultTab;
  return setting.tab;
}

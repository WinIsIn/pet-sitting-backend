import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback to Chinese if translation not found
        let fallbackValue = translations.zh;
        for (const fk of keys) {
          if (fallbackValue && fallbackValue[fk] !== undefined) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key; // Return key if translation not found
          }
        }
        return fallbackValue;
      }
    }
    
    return value || key;
  };

  return { t, language };
};


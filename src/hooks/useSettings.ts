import { useSettingsStore } from '../store/settingsStore';
import { MODELS, ModelId } from '../types/models';

export function useSettings() {
  const { keys, setKey, removeKey } = useSettingsStore();

  const resolvedKeys = {
    openai: keys.openai || (import.meta.env.VITE_OPENAI_API_KEY as string) || '',
    anthropic: keys.anthropic || (import.meta.env.VITE_ANTHROPIC_API_KEY as string) || '',
    google: keys.google || (import.meta.env.VITE_GOOGLE_AI_API_KEY as string) || '',
    serper: keys.serper || (import.meta.env.VITE_SERPER_API_KEY as string) || '',
    judge0: keys.judge0 || (import.meta.env.VITE_JUDGE0_API_KEY as string) || '',
  };

  const hasRequiredKeys = (modelId: ModelId): boolean => {
    const model = MODELS.find(m => m.id === modelId);
    if (!model) return false;

    if (model.provider === 'openai') return !!resolvedKeys.openai;
    if (model.provider === 'anthropic') return !!resolvedKeys.anthropic;
    if (model.provider === 'google') return !!resolvedKeys.google;
    
    return false;
  };

  const getApiKeysForRouting = () => {
    return {
      openai: resolvedKeys.openai,
      anthropic: resolvedKeys.anthropic,
      google: resolvedKeys.google,
    };
  };

  const hasToolKeys = () => {
    return {
      serper: !!resolvedKeys.serper,
      judge0: !!resolvedKeys.judge0,
    };
  };

  return { 
    keys: resolvedKeys,
    userEnteredKeys: keys,
    setKey, 
    removeKey, 
    hasRequiredKeys, 
    getApiKeysForRouting, 
    hasToolKeys 
  };
}

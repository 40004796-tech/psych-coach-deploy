import { useState, useEffect } from 'react';
import { ConfigItem } from '@/lib/base-storage';

interface UseConfigState {
  configs: ConfigItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useConfig(type?: ConfigItem['type']): UseConfigState {
  const [state, setState] = useState<Omit<UseConfigState, 'refetch'>>({
    configs: [],
    loading: false, // 初始设为false，避免水合错误
    error: null
  });

  const fetchConfigs = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const url = type ? `/api/config?type=${type}` : '/api/config';
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setState({ 
          configs: data.data?.configs || [], 
          loading: false, 
          error: null 
        });
      } else {
        const errorData = await response.json();
        setState({ 
          configs: [], 
          loading: false, 
          error: errorData.message || '获取配置失败' 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "获取配置失败";
      setState({ 
        configs: [], 
        loading: false, 
        error: errorMessage 
      });
    }
  };

  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    fetchConfigs();
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, refetch: fetchConfigs };
}

export function useConfigActions() {
  const createConfig = async (configData: Omit<ConfigItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '创建配置失败');
    }

    return response.json();
  };

  const updateConfig = async (id: string, updates: Partial<Omit<ConfigItem, 'id' | 'createdAt'>>) => {
    const response = await fetch(`/api/config/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '更新配置失败');
    }

    return response.json();
  };

  const deleteConfig = async (id: string) => {
    const response = await fetch(`/api/config/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '删除配置失败');
    }

    return response.json();
  };

  return {
    createConfig,
    updateConfig,
    deleteConfig
  };
}

/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    query: (sql: string, params?: any[]) => Promise<any[]>;
    run: (sql: string, params?: any[]) => Promise<any>;
    login: (username: string, password: string) => Promise<{
      success: boolean;
      user?: {
        id: number;
        username: string;
        full_name: string;
        role: string;
        gym_id: number;
        gym_name: string;
        gym_type: 'male' | 'female';
      };
      message?: string;
    }>;
    debugUsers: () => Promise<{
      users?: any[];
      gyms?: any[];
      error?: string;
    }>;
    debugPasswords: () => Promise<{
      users?: any[];
      error?: string;
    }>;
    debugLogin: (username: string, password: string) => Promise<{
      success: boolean;
      user?: any;
      message?: string;
      error?: string;
    }>;
    platform: string;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
}

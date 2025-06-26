import React, { createContext, useContext, useState, ReactNode } from 'react';

interface School {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  settings: {
    logo?: string;
    theme?: string;
    language?: string;
  };
}

interface TenantContextType {
  school: School | null;
  setSchool: (school: School) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [school, setSchool] = useState<School | null>({
    id: 'school-1',
    name: 'École Exemple',
    subdomain: 'ecole-exemple',
    plan: 'professional',
    settings: {
      theme: 'default',
      language: 'fr'
    }
  });

  const value = {
    school,
    setSchool
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
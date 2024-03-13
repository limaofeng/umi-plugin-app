import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({ loading: true, setLoading: (loading: boolean) => {} });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const value = { loading, setLoading };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  return useContext(LoadingContext);
};

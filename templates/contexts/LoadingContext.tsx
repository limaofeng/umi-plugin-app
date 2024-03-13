import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({ loading: true, setLoading: (loading: boolean) => {} });

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  return useContext(LoadingContext);
};

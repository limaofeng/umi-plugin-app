import React, { createContext, useEffect, useState, useContext } from 'react';

const LoadingContext = createContext({ loading: true, setLoading: (loading: boolean) => {} });

class EventBus {
  private events: { [key: string]: ((data: any) => void)[] };
  private loadingState: boolean;

  constructor() {
    this.events = {};
    this.loadingState = false;
  }

  on(event: string, listener: (data: boolean) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listenerToRemove?: (data: any) => void) {
    if (!this.events[event]) {
      return;
    }
    this.events[event] = this.events[event].filter((listener) => listener !== listenerToRemove);
  }

  emit(event: string, data: any) {
    if (event === 'LOADING_START') {
      this.loadingState = true;
    } else if (event === 'LOADING_END') {
      this.loadingState = false;
    }
    if (!this.events[event]) {
      return;
    }
    this.events[event].forEach((listener) => listener(data));
  }

  getValue() {
    return this.loadingState;
  }
}

const eventBus = new EventBus();

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const value = { loading, setLoading };

  useEffect(() => {
    eventBus.on('LOADING_START', () => setLoading(true));
    eventBus.on('LOADING_END', () => setLoading(false));

    return () => {
      eventBus.off('LOADING_START');
      eventBus.off('LOADING_END');
    };
  }, []);

  useEffect(() => {
    if (loading == eventBus.getValue()) {
      return;
    }
    if (loading) {
      eventBus.emit('LOADING_START', loading);
    } else {
      eventBus.emit('LOADING_END', loading);
    }
  }, [loading]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const useLoadingControls = () => {
  return {
    value: eventBus.getValue(),
    start: () => eventBus.emit('LOADING_START', true),
    end: () => eventBus.emit('LOADING_END', false),
    on: (event: 'LOADING_START' | 'LOADING_END', listener: (data: boolean) => void) => eventBus.on(event, listener),
  };
};

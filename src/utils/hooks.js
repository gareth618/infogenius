import React from 'react';

export function useLocalStorage(key, initValue) {
  const [state, setState] = React.useState(initValue);
  React.useEffect(() => {
    const storedState = localStorage.getItem(key);
    if (storedState != null) setState(
      typeof initValue === 'object' ? JSON.parse(storedState) : storedState
    );
  }, [key, initValue]);
  React.useEffect(() => {
    if (typeof initValue === 'object') {
      if (state == null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(state));
    }
    else {
      if (state === '') localStorage.removeItem(key);
      else localStorage.setItem(key, state);
    }
  }, [key, initValue, state]);
  return [state, setState];
};

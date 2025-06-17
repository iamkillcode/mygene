'use client';

import { useState, useEffect } from 'react';

interface GeolocationState {
  country: string | null;
  loading: boolean;
  error: GeolocationPositionError | Error | null;
}

// This is a very basic mock. A real app would use a GeoIP service or more precise navigator.geolocation.
// For this demo, it will randomly pick a country or return null.
const mockCountryDetection = (): Promise<string | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call or complex logic
      // For demo, just return a fixed country or null.
      // const countries = ['GH', 'US', 'GB', 'NG', null];
      // const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      // resolve(randomCountry);
      
      // To make it more predictable for testing, let's ask the user via prompt if in dev
      // In a real app, this would be navigator.geolocation and then a reverse geocoding API.
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const country = window.prompt("Dev Mode: Enter mock country code (e.g., GH, US) or leave blank for none:");
        resolve(country ? country.toUpperCase() : null);
      } else {
         resolve(null); // Default to null in non-dev or if prompt not supported/cancelled
      }
    }, 500);
  });
};


export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    country: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    setState(s => ({ ...s, loading: true }));

    mockCountryDetection()
      .then(countryCode => {
        if (isMounted) {
          setState({ country: countryCode, loading: false, error: null });
        }
      })
      .catch(err => {
        if (isMounted) {
          setState({ country: null, loading: false, error: err instanceof Error ? err : new Error("Geolocation failed") });
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

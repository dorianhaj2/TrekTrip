import { useEffect } from 'react';

const useLoadGoogleMaps = (callback) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => callback();
    
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [callback]);
};

export default useLoadGoogleMaps;

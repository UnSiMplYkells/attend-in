"use client";
import { useEffect, useState } from "react";

export function useGeo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function run() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setData({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            setLoading(false)
          },
          (err) => {
            setError(err.message)
            setLoading(false)
          }
        );
        
        setLoading(false);
        return;
      } else {
        alert("Geolocation is not supported by your browser");
      }
    }

    run();
  }, []);

  return { data, loading, error };
}
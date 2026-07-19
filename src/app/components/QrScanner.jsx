"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner({ onScan }) {
  useEffect(() => {
    let isCleared = false;

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    async function success(result) {
      if (isCleared) return;
      isCleared = true;
      
      try {
        await scanner.clear();
        if (onScan) {
          onScan(result);
        }
      } catch (error) {
        console.error("Error clearing scanner after success:", error);
      }
    }

    function error(err) {
      // This is noisy, only log if verbose debugging is needed
      // console.warn(err);
    }

    scanner.render(success, error);

    return () => {
      if (!isCleared) {
        isCleared = true;
        scanner.clear().catch(err => {
          console.warn("Cleanup clear failed, may be benign on fast unmounts:", err);
        });
      }
    };
  }, [onScan]);

  return (
    <div id="reader" className="w-full h-full overflow-hidden rounded-lg"></div>
  );
}

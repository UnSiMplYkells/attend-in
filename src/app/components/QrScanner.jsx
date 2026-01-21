"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      if (onScan) {
        onScan(result);
      }
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      try {
        scanner.clear();
      } catch (error) {
        console.error("Failed to clear scanner", error);
      }
    };
  }, [onScan]);

  return (
    <div id="reader" className="w-full h-full overflow-hidden rounded-lg"></div>
  );
}

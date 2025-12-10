"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrScanner() {
  const [scanResult, setScanResult] = useState(null);

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
      setScanResult(result);

      console.log("Qrcode read successfully!");
    }

    function error(err) {
      console.warn(err);
      console.log("No Qrcode found");
    }
  }, []);

  return (
    <div>
      {scanResult ? (
        <div>
          Success: <a href={"http://" + scanResult}>{scanResult}</a>
        </div>
      ) : (
        <div>
          <div
            id="reader"
            style={{ width: "400px", height: "500px", margin: "auto" }}
          ></div>
          <style>
            {`
              #reader img[alt="Info icon"], 
              span:nth-of-type(1) {
                display: none !important;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}

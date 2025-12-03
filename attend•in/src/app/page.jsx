"use client"
import QrGenerator from "./components/QrGenerator";
import QrScanner from "./components/QrScanner";

export default function Home() {

  return (
    <div>
      <div>
        <h2>Behold, the qrcode reader</h2>
        <QrScanner />
      </div>
      <div>
        <QrGenerator />
      </div>
    </div>
  );
}

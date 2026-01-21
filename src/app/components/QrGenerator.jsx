"use client";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { MdDownload, MdCheck } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

export default function QrGenerator({ value }) {
  const svgRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    const svg = svgRef.current;

    if (!svg) {
      setIsDownloading(false);
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const size = 1000;
      canvas.width = size;
      canvas.height = size;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      //triggers Download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Attendance_QR_${
        new Date().toISOString().split("T")[0]
      }`;
      downloadLink.href = pngFile;
      downloadLink.click();

      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="bg-white p-4 rounded-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] w-fit mx-auto">
        <div
          className="w-[250px] aspect-square"
          style={{ background: "white" }}
        >
          <QRCode
            ref={svgRef}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={value}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border
          ${
            isDownloaded
              ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isDownloading ? (
          <CgSpinner className="animate-spin text-lg" />
        ) : isDownloaded ? (
          <MdCheck className="text-lg" />
        ) : (
          <MdDownload className="text-lg" />
        )}
        {isDownloading
          ? "Generating..."
          : isDownloaded
          ? "Saved!"
          : "Download QR"}
      </button>
    </div>
  );
}

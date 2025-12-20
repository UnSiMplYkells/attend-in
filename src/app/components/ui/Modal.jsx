"use client";

import ModalPortal from "../ModalPortal";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div
        className="text-white backdrop-blur-xs fixed inset-0 bg-black/30 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-[#0c2241]/80 px-5 py-4 max-w-lg sm:w-full w-[90%] flex gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
}

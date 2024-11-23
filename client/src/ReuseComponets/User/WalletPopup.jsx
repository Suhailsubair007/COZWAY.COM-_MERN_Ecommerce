import { useState } from "react";
import { X } from "lucide-react";

export default function WalletPopup({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Funds</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

import React from "react";

type PopupBackgroundProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export default function PopupBackground({ children, onClose }: PopupBackgroundProps) {
  return (
    <div
    style={{marginTop:0}}  
    className="absolute inset-0 h-full w-full z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* stop propagation so popup click doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

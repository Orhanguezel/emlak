import React from 'react';
import { Button } from '../ui/button';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function ModalWrapper({ isOpen, onClose, title, children, maxWidth = "max-w-6xl" }: ModalWrapperProps) {
  console.log('🚪 ModalWrapper render - isOpen:', isOpen, 'title:', title);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => {
          console.log('🎭 Modal backdrop clicked');
          onClose();
        }}
      />

      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-2xl ${maxWidth} w-full mx-4 max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('🎭 Modal close button clicked');
              onClose();
            }}
            className="text-white hover:bg-teal-600 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
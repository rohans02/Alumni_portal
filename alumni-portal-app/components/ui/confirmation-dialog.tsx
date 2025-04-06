"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  type?: "success" | "warning" | "danger" | "info";
  showCancel?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-orange-600 hover:bg-orange-700",
  type = "info",
  showCancel = true
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  // Different styles based on dialog type
  const iconColor = {
    success: "text-green-500",
    warning: "text-yellow-500",
    danger: "text-red-500",
    info: "text-blue-500"
  }[type];

  const borderColor = {
    success: "border-green-100",
    warning: "border-yellow-100",
    danger: "border-red-100",
    info: "border-blue-100"
  }[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full border ${borderColor}`}>
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className={`text-xl font-semibold ${iconColor}`}>{title}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {typeof message === "string" ? (
            <p className="text-gray-700">{message}</p>
          ) : (
            message
          )}
        </div>
        
        <div className="border-t px-6 py-4 flex justify-end space-x-2">
          {showCancel && (
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          
          <Button 
            className={confirmButtonClass}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
} 
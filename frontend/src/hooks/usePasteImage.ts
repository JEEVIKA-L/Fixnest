import React from 'react';

/**
 * Hook to handle image pasting from clipboard and converting it to base64
 */
export const usePasteImage = (onImagePasted: (base64: string) => void) => {
 const handlePaste = React.useCallback(
 async (event: React.ClipboardEvent) => {
 const items = event.clipboardData.items;

 for (let i = 0; i < items.length; i++) {
 const item = items[i];

 if (item.type.indexOf('image') !== -1) {
 const file = item.getAsFile();
 if (!file) continue;

 const reader = new FileReader();
 reader.onload = (e) => {
 const base64 = e.target?.result as string;
 if (base64) {
 onImagePasted(base64);
 }
 };
 reader.readAsDataURL(file);
 
 // Prevent default if we found an image (optional, depends on if we want to keep text too)
 // For now, we allow the default if there's also text in the clipboard
 }
 }
 },
 [onImagePasted]
 );

 return { handlePaste };
};

/**
 * Calculates the contrast color (either white or a dark gray) for a given background hex color.
 * Uses the HSP color model to determine perceived brightness.
 */
export const getContrastColor = (hex: string | undefined): string => {
 if (!hex || hex === 'transparent') return '#1F2937'; // Default text color (Slate 800)

 // Remove the hash if it exists
 const color = hex.startsWith('#') ? hex.slice(1) : hex;

 // Convert hex to RGB
 const r = parseInt(color.slice(0, 2), 16);
 const g = parseInt(color.slice(2, 4), 16);
 const b = parseInt(color.slice(4, 6), 16);

 // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
 const hsp = Math.sqrt(
 0.299 * (r * r) +
 0.587 * (g * g) +
 0.114 * (b * b)
 );

 // If hsp is greater than 150, it's a light color, use dark text.
 // Otherwise, use light text.
 return hsp > 150 ? '#1F2937' : '#FFFFFF';
};

/**
 * Returns a variant of the color that is slightly darker or lighter for borders/accents.
 */
export const getAccentColor = (hex: string | undefined, amount: number = -20): string => {
 if (!hex || hex === 'transparent') return '#E5E7EB';

 const color = hex.startsWith('#') ? hex.slice(1) : hex;
 const num = parseInt(color, 16);

 let r = (num >> 16) + amount;
 let g = ((num >> 8) & 0x00FF) + amount;
 let b = (num & 0x0000FF) + amount;

 r = Math.max(0, Math.min(255, r));
 g = Math.max(0, Math.min(255, g));
 b = Math.max(0, Math.min(255, b));

 return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

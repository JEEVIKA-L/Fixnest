export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateError = () => {
 // Disabling simulated errors for a more stable experience
 /*
 if (Math.random() < 0.1) {
 throw new Error('Simulated API Error: Please try again.');
 }
 */
};

export const getStorageData = <T,>(key: string, defaultValue: T): T => {
 if (typeof window === 'undefined') return defaultValue;
 const data = localStorage.getItem(`fixnest_${key}`);
 return data ? JSON.parse(data) : defaultValue;
};

export const setStorageData = <T,>(key: string, data: T): void => {
 if (typeof window === 'undefined') return;
 localStorage.setItem(`fixnest_${key}`, JSON.stringify(data));
};

export const formatDate = (date: string | Date): string => {
 const d = new Date(date);
 return d.toLocaleDateString(undefined, { 
 month: 'short', 
 day: 'numeric',
 year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
 });
};

export const formatRelativeTime = (date: string | Date): string => {
 const d = new Date(date);
 const now = new Date();
 const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
 
 if (diffInSeconds < 60) return 'Just now';
 if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
 if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
 return formatDate(date);
};

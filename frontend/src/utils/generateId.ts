export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 11)}`;
};

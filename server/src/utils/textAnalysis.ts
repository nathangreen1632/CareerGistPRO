export const getKeywordsFromText = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // basic stopword + noise filter
};

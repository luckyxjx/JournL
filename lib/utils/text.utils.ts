export const stripHtml = (html: string): string => {
  if (typeof window === 'undefined' || !html) return html || '';
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || doc.body.innerText || '';
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return html.replace(/<[^>]*>/g, '');
  }
};

export const countWords = (text: string): number => {
  return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
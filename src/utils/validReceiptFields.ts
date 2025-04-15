import { Item } from '../types/Item.js';

// Check retailer
export const isValidRetailer = (retailer: string): boolean => {
  return typeof retailer === 'string' && retailer.trim().length > 0;
};
// Check purchaseDate
export const isValidPurchaseDate = (date: string): boolean => {
  // Check format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Check purchaseTime
export const isValidPurchaseTime = (time: string): boolean => {
  // Time format HH:MM
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
};

// Check items list
export const isValidItems = (items: Item[]): boolean => {
  if (!Array.isArray(items) || items.length === 0) return false;
  const priceRegex = /^\d+\.\d{2}$/;

  return items.every(
    item =>
      typeof item === 'object' &&
      typeof item.shortDescription === 'string' &&
      item.shortDescription.trim().length > 0 &&
      typeof item.price === 'string' &&
      priceRegex.test(item.price)
  );
};

// Check total
export const isValidTotal = (total: string): boolean => {
  const totalRegex = /^\d+\.\d{2}$/;
  // Check if total is in a valid format (number with two decimal places)
  if (typeof total !== 'string' || !totalRegex.test(total)) {
    return false;
  } else {
    return true;
  }
};

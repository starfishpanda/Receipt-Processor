import { Item } from '../types/Item.js';
// +1 Every alphanumeric character in the retailer name.
export const alphanumericPoints = (retailer: string): number => {
  const matches: Array<any> | null = retailer.match(/[a-zA-Z0-9]/g);

  return matches ? matches.length : 0;
};

// +50 points if the total is a round dollar amount with no cents.
export const noCentsPoints = (total: string): number => {
  const totalNum = parseFloat(total);
  if (totalNum % 1 === 0) {
    return 50;
  } else {
    return 0;
  }
};

// +25 points if the total is a multiple of 0.25.
export const pointTwentyFiveMultiplePoints = (total: string): number => {
  const totalNum = parseFloat(total);
  if (totalNum % 0.25 === 0) {
    return 25;
  } else {
    return 0;
  }
};

// +5 points for every two items on the receipt.
export const everyTwoItemsPoints = (items: Item[]): number => {
  let pointsMultiple = Math.floor(items.length / 2) * 5;

  return pointsMultiple ? pointsMultiple : 0;
};

// If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
export const trimDescPoints = (items: Item[]): number => {
  let points = 0;
  items.forEach(item => {
    const { shortDescription, price } = item;
    const trimmedLength = shortDescription.trim().length;
    if (trimmedLength % 3 === 0) {
      points += Math.ceil(parseFloat(price) * 0.2);
    }
  });

  return points;
};

// +6 points if the day in the purchase date is odd.
export const oddDayPoints = (purchaseDate: string): number => {
  const purchaseDay = parseInt(purchaseDate.split('-')[2]);
  if (purchaseDay % 2 === 1) {
    return 6;
  } else {
    return 0;
  }
};

// +10 points if the time of purchase is after 2:00pm and before 4:00pm.
export const timeWindowPoints = (purchaseTime: string): number => {
  const [purchaseHours, purchaseMinutes] = purchaseTime.split(':');
  const startTimeMinutes = 14 * 60;
  const endTimeMinutes = 16 * 60;

  const purchaseTimeTotalMinutes = parseInt(purchaseHours) * 60 + parseInt(purchaseMinutes);

  return purchaseTimeTotalMinutes > startTimeMinutes && purchaseTimeTotalMinutes < endTimeMinutes
    ? 10
    : 0;
};

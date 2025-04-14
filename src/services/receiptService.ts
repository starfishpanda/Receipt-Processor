import { ReceiptWithPoints } from '../types/ReceiptWithPoints.js';
import { Receipt } from '../types/Receipt.js';
import { ReceiptId } from '../types/ReceiptId.js';
import { PointsResponse } from '../types/PointsResponse.js';
import { v4 as uuidv4 } from 'uuid';
import {
  alphanumericPoints,
  noCentsPoints,
  pointTwentyFiveMultiplePoints,
  everyTwoItemsPoints,
  trimDescPoints,
  oddDayPoints,
  timeWindowPoints,
} from '../utils/pointsCalculator.js';
// In-Memory Store of IDs and points
const receiptDatabase: Map<string, ReceiptWithPoints> = new Map();

// Generate and store id with receipt
export const processReceiptId = (receipt: Receipt): ReceiptId => {
  const id: string = uuidv4();
  const receiptId: ReceiptId = { id: id };

  receiptDatabase.set(id, { receipt, points: 0 });

  return receiptId;
};

// Calculate points and store with associated id
export const calculatePoints = (receiptId: ReceiptId): PointsResponse => {
  const { id } = receiptId;
  const receiptWithPoints: ReceiptWithPoints | undefined = receiptDatabase.get(id);

  if (!receiptWithPoints) {
    console.error('Unable to calculate points without receipt record.');
    throw new Error('Id and associated receipt not found');
  }

  let { points, receipt } = receiptWithPoints;
  const { retailer, purchaseDate, purchaseTime, items, total } = receipt;

  // +1 Every alphanumeric character in the retailer name.
  points += alphanumericPoints(retailer);

  // +50 points if the total is a round dollar amount with no cents.
  points += noCentsPoints(total);

  // +25 points if the total is a multiple of 0.25.
  points += pointTwentyFiveMultiplePoints(total);

  // +5 points for every two items on the receipt.
  points += everyTwoItemsPoints(items);

  // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
  points += trimDescPoints(items);

  // +6 points if the day in the purchase date is odd.
  points += oddDayPoints(purchaseDate);

  // +10 points if the time of purchase is after 2:00pm and before 4:00pm.
  points += timeWindowPoints(purchaseTime);

  receiptWithPoints.points = points;
  receiptDatabase.set(id, receiptWithPoints);

  return { points };
};

export const getStoredPoints = (receiptId: ReceiptId): PointsResponse => {
  const { id } = receiptId;
  // console.log('Receipt Service: Received ID:', id)

  const receiptWithPoints: ReceiptWithPoints | undefined = receiptDatabase.get(id);

  if (!receiptWithPoints || !receiptWithPoints.points) {
    console.error('Unable to calculate points without receipt record.');
    throw new Error('Id and associated receipt not found');
  }

  const { points } = receiptWithPoints;

  return { points };
};

//

import { Request, Response } from 'express';
import { Receipt } from '../types/Receipt.js';
import { ReceiptId } from '../types/ReceiptId.js';
import { processReceiptId, calculatePoints, getStoredPoints } from '../services/receiptService.js';

const receiptController = {
  // Store receipt, calculate and store points with generated receiptId, and return id
  processReceipt: async (req: Request, res: Response) => {
    try {
      const receipt: Receipt = req.body;
      if (
        !receipt.retailer ||
        !receipt.purchaseDate ||
        !receipt.purchaseTime ||
        !receipt.items ||
        !receipt.total
      ) {
        console.error('Bad request. The receipt is invalid.');
        return res.status(400).json({ message: 'The receipt is invalid.' });
      }

      const receiptId: ReceiptId = processReceiptId(receipt);

      const points = calculatePoints(receiptId);
      console.log(points);
      return res.status(200).json(receiptId);
    } catch (error) {
      console.error('Error creating receipt ID');
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // Get points from receiptService database
  getPoints: async (req: Request, res: Response) => {
    try {
      const receiptId: ReceiptId = { id: req.params.id };
      // console.log('Controller: Received ID:', req.params.id)

      if (!receiptId) {
        console.error('Missing or invalid receipt ID.');
        return res.status(400).json({ message: 'Bad request. Missing or invalid receipt ID.' });
      }

      const points = getStoredPoints(receiptId);
      if (!points) {
        console.error('No receipt found for that id.');
        return res.status(404).json({ message: 'No receipt found for that ID.' });
      }

      return res.status(200).json(points);
    } catch (error) {
      console.error('Error getting points.');
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default receiptController;

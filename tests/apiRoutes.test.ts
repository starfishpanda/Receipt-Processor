import request from 'supertest';
import express from 'express';
import apiRouter from '../src/routes/apiRoutes.js';
import * as receiptService from '../src/services/receiptService.js';

jest.mock('../src/services/receiptService.js', () => ({
  processReceiptId: jest.fn(),
  calculatePoints: jest.fn(),
  getStoredPoints: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use(apiRouter);

describe('Receipt API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // mock receipt
  const validReceipt = {
    retailer: 'M&M Corner Market',
    purchaseDate: '2022-03-20',
    purchaseTime: '14:33',
    items: [
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
      {
        shortDescription: 'Gatorade',
        price: '2.25',
      },
    ],
    total: '9.00',
  };
  describe('POST /receipts/process', () => {
    let receiptId: string;
    // 200 - valid receipt
    it('should process a valid receipt and return an ID', async () => {
      const response = await request(app).post('/receipts/process').send(validReceipt).expect(200);
      expect(response.body).toHaveProperty('id');
      receiptId = response.body.id;
    });
    // 400 - invalid receipt - missing retailer
    it('should return 400 when an invalid receipt is sent', async () => {
      const { retailer, ...invalidReceipt } = validReceipt;

      const response = await request(app)
        .post('/receipts/process')
        .send(invalidReceipt)
        .expect(400);
      expect(response.body).toHaveProperty('message', 'The receipt is invalid.');
    });

    // Could expand tests to other missing fields, or checking each field for formatting based on example receipt
  });

  describe('GET /receipts/:id/process', () => {
    // 200
    it('should return points object for a valid receipt ID', async () => {
      const mockPoints = { points: 25 };
      (receiptService.getStoredPoints as jest.Mock).mockReturnValue(mockPoints);

      const response = await request(app).get('/receipts/test-id-123/points').expect(200);

      expect(response.body).toEqual(mockPoints);
      expect(receiptService.getStoredPoints).toHaveBeenCalledWith({
        id: 'test-id-123',
      });
    });

    // 404
    it('should return 404 when receipt ID is not found', async () => {
      (receiptService.getStoredPoints as jest.Mock).mockReturnValue(null);

      const response = await request(app).get('/receipts/nonexistent-id/points').expect(404);

      expect(response.body).toHaveProperty('message', 'No receipt found for that ID.');
    });
  });
});

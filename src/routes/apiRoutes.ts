import express from 'express';
import receiptController from '../controllers/receiptController.js';

const apiRouter = express.Router();

apiRouter.post('/receipts/process', receiptController.processReceipt);

apiRouter.get('/receipts/:id/points', receiptController.getPoints);

export default apiRouter;

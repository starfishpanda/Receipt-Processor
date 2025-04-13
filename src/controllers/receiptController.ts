import { Request, Response, NextFunction } from 'express'
import axios from 'axios'

const receiptController = {
  processReceipts: async (req: Request, res: Response, next: NextFunction) => {
    try{
      const receipt: Receipt = req.body

      // Validate receipt

      const receiptId = 1234
  
      req.receiptId = receiptId
      next();
    } catch(error: any){
      console.error("Error creating receipt ID")
      return res.status(500).json( {message: "Server error."})
    }

  },

  // getPoints
}

export default receiptController
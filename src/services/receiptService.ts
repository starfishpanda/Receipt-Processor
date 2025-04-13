import { ReceiptWithPoints } from "@/types/ReceiptWithPoints.js"
import { Receipt } from "@/types/Receipt.js"
import { PointsResponse } from "@/types/PointsResponse.js"
// In-Memory Store of IDs and points
const receiptDatabase: Map<string, ReceiptWithPoints> = new Map()

// Generate and store id
export const processReceipt = (receipt: Receipt): PointsResponse => {
  const points: PointsResponse = 0

  // 

}

// Calculate points and store with id


// 
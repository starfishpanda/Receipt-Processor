import { Item } from './Item.js';

export interface Receipt {
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  items: Item[];
  total: string;
}

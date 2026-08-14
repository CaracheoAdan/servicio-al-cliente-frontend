import { describe, it, expect } from 'vitest';
import { calculateFulfillmentForOrder, calculateDecimalTime } from './useReports';
import { CombinedOrder, OrderStatus } from '../../../shared/api/orderService';

describe('useReports pure calculations', () => {
  describe('calculateDecimalTime', () => {
    it('should convert an ISO string time to a decimal number', () => {
      // 11:30 AM should be 11.5
      const date = new Date('2023-01-01T11:30:00.000');
      const result = calculateDecimalTime(date.toISOString());
      expect(result).toBe(11.5);
    });

    it('should return null for invalid date strings', () => {
      expect(calculateDecimalTime('invalid-date')).toBeNull();
      expect(calculateDecimalTime('')).toBeNull();
    });
  });

  describe('calculateFulfillmentForOrder', () => {
    it('should calculate perfect 100% fulfillment when ordered equals delivered', () => {
      const order: CombinedOrder = {
        id: 1,
        key: 'ORD-1',
        status: OrderStatus.DELIVERED,
        detail: null,
        items: [
          { id: 1, productId: 1, productName: 'A', orderedQuantity: 50, deliveredQuantity: 50 },
          { id: 2, productId: 2, productName: 'B', orderedQuantity: 25, deliveredQuantity: 25 }
        ]
      };
      const result = calculateFulfillmentForOrder(order);
      expect(result).not.toBeNull();
      expect(result?.fulfillment).toBe(100);
      expect(result?.totalOrdered).toBe(75);
      expect(result?.totalDelivered).toBe(75);
    });

    it('should calculate partial fulfillment correctly (rounded)', () => {
      const order: CombinedOrder = {
        id: 1,
        key: 'ORD-2',
        status: OrderStatus.DELIVERED,
        detail: null,
        items: [
          { id: 1, productId: 1, productName: 'A', orderedQuantity: 100, deliveredQuantity: 33 } // 33%
        ]
      };
      const result = calculateFulfillmentForOrder(order);
      expect(result?.fulfillment).toBe(33);
    });

    it('should return null if order has no items', () => {
      const order: CombinedOrder = {
        id: 1,
        key: 'ORD-3',
        status: OrderStatus.OPEN,
        detail: null,
        items: []
      };
      expect(calculateFulfillmentForOrder(order)).toBeNull();
    });
  });
});

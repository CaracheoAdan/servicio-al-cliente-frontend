import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService, OrderStatus } from './orderService';
import { api } from './axiosInstance';

// Mock axios instance
vi.mock('./axiosInstance', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get all combined orders with hydrated data and normalized uppercase status', async () => {
    // Mock the 3 parallel requests
    (api.get as any)
      .mockResolvedValueOnce({
        data: [{ id: 1, key: 'ORD-001', status: 'in_delivery' }] // The backend returns lowercase
      }) // /orders
      .mockResolvedValueOnce({
        data: [{ id: 10, orderId: 1, scheduledDeliveryDate: '2023-01-01T12:00:00Z', shippingDate: '2023-01-01T14:00:00Z' }]
      }) // /orderDetails
      .mockResolvedValueOnce({
        data: [{ id: 100, orderId: 1, productId: 5, orderedQuantity: 10, deliveredQuantity: 8, product: { name: 'Item A' } }]
      }); // /order_items

    const result = await orderService.getAllCombinedOrders();

    expect(api.get).toHaveBeenCalledTimes(3);
    
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('ORD-001');
    // Important: check normalisation to uppercase
    expect(result[0].status).toBe(OrderStatus.IN_DELIVERY);
    
    // Check hydrated detail
    expect(result[0].detail?.id).toBe(10);
    expect(result[0].detail?.shippingDate).toBe('2023-01-01T14:00:00Z');

    // Check hydrated items
    expect(result[0].items).toHaveLength(1);
    expect(result[0].items[0].productName).toBe('Item A');
    expect(result[0].items[0].deliveredQuantity).toBe(8);
  });

  it('should send UPPERCASE status and remove ID from body when updating order (Anti-Corruption Layer)', async () => {
    // Mock existing details and items for the update process
    (api.get as any)
      .mockResolvedValueOnce({ data: [] }) // get orderDetails
      .mockResolvedValueOnce({ data: [] }); // get order_items

    const payload = {
      key: 'ORD-002',
      status: OrderStatus.OPEN, // We send uppercase from UI
      items: []
    };

    await orderService.updateOrder(2, payload);

    // Verify order PUT request
    expect(api.put).toHaveBeenCalledWith('/orders/2', {
      key: 'ORD-002',
      status: 'OPEN' // Must be uppercase, and notice NO "id" in body
    });

    // Verify it created a new detail since none existed
    expect(api.post).toHaveBeenCalledWith('/order_details', expect.objectContaining({
      orderId: 2
    }));
  });
});

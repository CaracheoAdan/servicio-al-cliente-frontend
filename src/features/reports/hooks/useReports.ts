import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService, CombinedOrder, OrderStatus } from '../../../shared/api/orderService';

export interface TransportDataPoint {
  time: number;
  label: string;
}

export interface FulfillmentDataPoint {
  order: string;
  fulfillment: number;
  totalOrdered: number;
  totalDelivered: number;
}

export interface GeneralMetrics {
  onTimePct: number;
  fulfillPct: number;
  general: number;
}

/**
 * Pure function to calculate fulfillment from a combined order
 */
export const calculateFulfillmentForOrder = (order: CombinedOrder): FulfillmentDataPoint | null => {
  if (!order.items || order.items.length === 0) return null;

  let totalOrdered = 0;
  let totalDelivered = 0;

  order.items.forEach(item => {
    totalOrdered += item.orderedQuantity || 0;
    totalDelivered += item.deliveredQuantity || 0;
  });

  if (totalOrdered <= 0) return null;

  const percentage = Math.round((totalDelivered / totalOrdered) * 100);
  
  return {
    order: order.key,
    fulfillment: percentage,
    totalOrdered,
    totalDelivered
  };
};

/**
 * Pure function to calculate transport decimal time
 */
export const calculateDecimalTime = (dateString: string): number | null => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const h = d.getHours();
  const m = d.getMinutes();
  return h + m / 60;
};

/**
 * Hook to fetch and compute reports data
 */
export const useReports = () => {
  const { data: orders = [], isLoading: loading, error } = useQuery<CombinedOrder[], Error>({
    queryKey: ['combinedOrders'],
    queryFn: () => orderService.getAllCombinedOrders()
  });

  // useMemo used to optimize heavy client-side processing
  const { transportData, fulfillmentData, latestOrder, generalMetrics } = useMemo(() => {
    const transport: TransportDataPoint[] = [];
    const fulfillment: FulfillmentDataPoint[] = [];
    let mostRecentOrder: any = null;

    orders.forEach(order => {
      // Logic for transport (only delivered or in_delivery)
      if ((order.status === OrderStatus.DELIVERED || order.status === OrderStatus.IN_DELIVERY) && order.detail?.shippingDate) {
        const decimalTime = calculateDecimalTime(order.detail.shippingDate);
        if (decimalTime !== null) {
          transport.push({
            time: decimalTime,
            label: `${Math.floor(decimalTime)}:${Math.round((decimalTime % 1) * 60).toString().padStart(2, '0')}`
          });
        }

        const currentShippingTime = new Date(order.detail.shippingDate).getTime();
        if (!mostRecentOrder || currentShippingTime > mostRecentOrder.shippingTime) {
          const orderFulfillment = calculateFulfillmentForOrder(order);
          mostRecentOrder = {
            key: order.key,
            status: order.status,
            shippingDate: new Date(order.detail.shippingDate),
            shippingTime: currentShippingTime,
            fulfillment: orderFulfillment?.fulfillment || 0,
            totalOrdered: orderFulfillment?.totalOrdered || 0,
            totalDelivered: orderFulfillment?.totalDelivered || 0
          };
        }
      }

      // Logic for fulfillment (orders with items)
      const orderFulfillment = calculateFulfillmentForOrder(order);
      if (orderFulfillment) {
        fulfillment.push(orderFulfillment);
      }
    });

    // Compute General Metrics
    let onTimePct = 0;
    let fulfillPct = 0;
    let general = 0;

    if (transport.length > 0 && fulfillment.length > 0) {
      // 11.5 decimal represents 11:30 AM
      const onTimeCount = transport.filter(t => t.time <= 11.5).length;
      onTimePct = Math.round((onTimeCount / transport.length) * 100);
      
      const sumFulfillment = fulfillment.reduce((acc, curr) => acc + curr.fulfillment, 0);
      fulfillPct = Math.round(sumFulfillment / fulfillment.length);
      
      general = Math.round((onTimePct * fulfillPct) / 100);
    }

    return {
      transportData: transport,
      fulfillmentData: fulfillment,
      latestOrder: mostRecentOrder,
      generalMetrics: { onTimePct, fulfillPct, general }
    };
  }, [orders]);

  return { loading, error, transportData, fulfillmentData, latestOrder, generalMetrics };
};

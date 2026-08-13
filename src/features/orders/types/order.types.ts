export interface ProductionOrder {
  id: string;
  orderNumber: string;
  commitmentDate: string;
  status: string;
  isProduced: boolean;
  isTransported: boolean;
  items: ProductionOrderItem[];
}

export interface ProductionOrderItem {
  id?: string;
  productId: string;
  productName?: string;
  requestedQuantity: number;
  suppliedQuantity: number;
}

export interface CreateProductionOrderCommand {
  orderNumber: string;
  commitmentDate: string;
  items: Omit<ProductionOrderItem, 'id' | 'productName'>[];
}

export interface UpdateOrderStatusCommand {
  status: string; // e.g., 'PRODUCED', 'TRANSPORTED'
  lossCauseId?: string;
  timeOutCauseId?: string;
}

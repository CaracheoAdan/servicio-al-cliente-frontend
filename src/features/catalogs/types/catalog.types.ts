export interface Product {
  id: number;
  key: string;
  isActive: boolean;
}

export interface CreateProductCommand {
  key: string;
  isActive?: boolean;
}

// Nota: Eliminamos las referencias estáticas antiguas como 'name' o 'description'
// para apegarnos estrictamente a la tabla 'product' de tu DB.

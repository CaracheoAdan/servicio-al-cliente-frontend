export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateProductCommand {
  code: string;
  name: string;
  description?: string;
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface CreateMachineCommand {
  code: string;
  name: string;
}

export interface Responsable {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  isActive: boolean;
}

export interface CreateResponsableCommand {
  firstName: string;
  lastName: string;
  employeeId: string;
}

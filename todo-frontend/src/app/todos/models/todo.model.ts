export interface Todo {
  id: number;
  name: string;
  price: number;
  limitDate: string;
  reOrder: number;
}

export interface CreateTodoRequest {
  name: string;
  price: number;
  limitDate: string;
}

export interface UpdateTodoRequest {
  name?: string;
  price?: number;
  limitDate?: string;
  reOrder?: number;
}

export interface ReorderRequest {
  id: number;
  orderIndex: number;
}

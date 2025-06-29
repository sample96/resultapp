export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  name: string;
  details: string;
}

export interface Result {
  _id: string;
  category: Category;
  eventName: string;
  eventDate: string;
  individual: {
    first: Position;
    second: Position;
    third: Position;
  };
  group: {
    first: Position;
    second: Position;
    third: Position;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultRequest {
  category: string;
  eventName: string;
  eventDate: string;
  individual: {
    first: Position;
    second: Position;
    third: Position;
  };
  group: {
    first: Position;
    second: Position;
    third: Position;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}
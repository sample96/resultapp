export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  memberCount: number;
  totalPoints: number;
  achievements: Array<{
    eventName: string;
    position: string;
    points: number;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  name: string;
  details: string;
}

export interface GroupPosition {
  groupId: string;
  name: string;
  details: string;
  points: number;
}

export interface Result {
  _id: string;
  category: Category;
  eventName?: string;
  eventDate?: string;
  individual: {
    first?: Position;
    second?: Position;
    third?: Position;
  } | null;
  group: {
    positions: GroupPosition[];
    totalGroups: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultRequest {
  category: string;
  individual?: {
    first?: Position;
    second?: Position;
    third?: Position;
  };
  group?: {
    positions: GroupPosition[];
    totalGroups: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface GroupPointsSummary {
  name: string;
  totalPoints: number;
  events: Array<{
    eventName: string;
    category: string;
    points: number;
    position: string;
    date: string;
  }>;
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

export interface UpdateGroupPointsRequest {
  position: 'first' | 'second' | 'third';
  points: number;
}
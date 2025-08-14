export interface Item {
  order: number;
  name: string;
}

export interface GetAllStatusesResponse {
  submission: Item[];
  review: Item[];
}

export interface GetStudentStatusResponse extends Item {
  group: string;
}

export type StatusType = 'complete' | 'active' | 'not done';

export interface EnhancedStatus extends Item {
  status: StatusType;
}

export interface Profession {
  id: number;
  name: string;
  summary: string;
  market: string;
  salary: {
    initial: string;
    senior: string;
  };
}

export interface CardState {
  id: number;
  professionId: number;
  professionName: string;
  status: 'down' | 'up' | 'matched';
}
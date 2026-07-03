export interface User {
  id?: number;
  username: string;
  password?: string;
  createdAt?: string;
}

export interface Dashboard {
  id: number;
  name: string;
  category: string;
  powerBiUrl: string;
  lastUpdated: string;
}

export interface Analytics {
  id: number;
  category: string;
  metricName: string;
  metricValue: number;
}

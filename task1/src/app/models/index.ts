export enum ChartType {
  Bar = 'bar',
  Line = 'line',
}

export interface ChartData {
  type: string;
  date: string;
  value: number;
}

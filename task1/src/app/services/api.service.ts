import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChartData } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  getChartData(start: Date, end: Date): Observable<ChartData[]> {
    return of(this._generateChartData(start, end));
  }

  private _generateChartData(startDate: Date, endDate: Date): ChartData[] {
    const chartData: ChartData[] = [];
    const sensors: string[] = Array.from({ length: 6 }, (_, i) => `Sensor ${i + 1}`);
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let dateVal = start; dateVal <= end; dateVal.setDate(dateVal.getDate() + 1)) {
      sensors.forEach((type) => {
        const date = this._sanitizeDate(dateVal);
        const value = this._generateRandomNumber({ min: 0, max: 100 });
        chartData.push({ date, value, type });
      });
    }

    return chartData;
  }

  private _sanitizeDate(date: Date): string {
    const convertedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return convertedDate.toISOString().split('T')[0];
  }

  private _generateRandomNumber(values: { min: number; max: number }): number {
    return Math.floor(Math.random() * (values.max - values.min + 1)) + values.min;
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { ChartData } from '../models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  chartData: ChartData[] = [];

  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _api: ApiService,
    private _cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
    this.range.setValue({ start: monthAgo, end: new Date() });
    this.getData(monthAgo, new Date());

    this.range.valueChanges.pipe(debounceTime(300), takeUntil(this._destroy$)).subscribe((data) => {
      if (data.start && data.end) {
        this.getData(data.start, data.end);
      }
    });
  }

  getData(start: Date, end: Date) {
    this._api
      .getChartData(start, end)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        this.chartData = data;
        this._cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }
}

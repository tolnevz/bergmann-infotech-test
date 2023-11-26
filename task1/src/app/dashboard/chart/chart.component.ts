import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { ChartData, ChartType } from 'src/app/models';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  private _chartData: ChartData[] = [];
  @Input() set chartData(value: ChartData[]) {
    this.reset();
    this._chartData = value;
    this.chartOption = this.generateChartOptions();
    this.chartSeries = this.generateChartSeries();
  }
  get chartData(): ChartData[] {
    return this._chartData;
  }

  chartOption: EChartsOption = {};
  chartSeries: SeriesOption[] = [];
  selectedChartSeries: SeriesOption[] = [];
  selectedChartType: ChartType = ChartType.Line;

  constructor(private _cd: ChangeDetectorRef) {}

  onCheckSerie(serie: SeriesOption) {
    const find = this.selectedChartSeries.find((s) => s.name === serie.name);
    if (find) {
      this.selectedChartSeries = this.selectedChartSeries.filter((s) => s.name !== serie.name);
    } else {
      this.selectedChartSeries.push(serie);
    }
    this.chartOption = this.generateChartOptions();
  }

  onSelectbarType(event: ChartType | undefined) {
    this.reset();
    if (event) {
      this.chartSeries = this.generateChartSeries(event);
    }
  }

  reset() {
    this.chartOption = {};
    this.chartSeries = [];
    this.selectedChartSeries = [];
  }

  generateChartOptions(): EChartsOption {
    return {
      grid: {
        top: 40,
        left: 40,
        right: 40,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          restore: {},
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
        {
          start: 0,
          end: 100,
        },
      ],
      xAxis: {
        type: 'category',
        data: this.sanitizeDates(),
      },
      yAxis: {
        type: 'value',
      },
      series: this.selectedChartSeries,
    };
  }

  generateChartSeries(chartType: 'line' | 'bar' = 'line'): any[] {
    const mapData = new Map<string, SeriesOption>();

    this.chartData.forEach((el) => {
      const { type, value } = el;
      const seriesOption = mapData.get(type);

      if (seriesOption) {
        (seriesOption.data as any[]).push(value);
      } else {
        mapData.set(type, {
          name: type,
          type: chartType,
          data: [value],
        });
      }
    });

    return Array.from(mapData.values());
  }

  sanitizeDates(): string[] {
    const dates = this.chartData.map((item) => item.date);
    return [...new Set(dates)];
  }

  getChartTitle(): string {
    return this.chartData.length ? this.chartData[0].type : '';
  }
}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  faCircle = faCircle;
  code;
  rows = [];
  newRow: any = { name: '', ammount: '', code: '', grid: '' };
  line = 1;
  sub: Subscription[] = [];
  isDisabled = true;

  constructor(private service: DataService) {
    this.code = this.service.getVarCode();
    this.rows = this.service.getRows();

    this.sub.push(
      this.service.getCode().subscribe((code) => {
        this.code = code;
        this.isDisabled = false;
      })
    );
    this.sub.push(
      this.service.getObservableRows().subscribe((rows) => {
        this.rows = rows;
      })
    );

    this.sub.push(
      this.service.getObservableMatrix().subscribe((matrix) => {
        this.newRow.grid = matrix;
      })
    );
  }

  ngOnInit(): void {}

  addRow() {
    this.newRow.grid = this.service.getMatrix();
    this.newRow.code = this.code;
    this.rows.push(this.newRow);
    this.service.saveRows(this.rows);
    this.newRow = { name: '', ammount: '', code: '', grid: '' };
  }

  ngOnDestroy() {
    this.sub.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

import { Component } from '@angular/core';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-dispatch',
  imports: [Shared],
  templateUrl: './wtg-dispatch.html',
  styleUrl: './wtg-dispatch.css',
})
export class WtgDispatch {
  wtgDispatchPlanList = [
    {
      slNo: 1,
      planDate: '2026-04-05',
      projectCode: 'P-8001',
      wtgCount: 3
    },
    {
      slNo: 2,
      planDate: '2026-04-07',
      projectCode: 'P-8002',
      wtgCount: 5
    },
    {
      slNo: 3,
      planDate: '2026-04-10',
      projectCode: 'P-8003',
      wtgCount: 2
    },
    {
      slNo: 4,
      planDate: '2026-04-12',
      projectCode: 'P-8004',
      wtgCount: 4
    }
  ];
}

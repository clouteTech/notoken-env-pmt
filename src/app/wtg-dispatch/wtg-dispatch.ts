import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-dispatch',
  imports: [Shared],
  templateUrl: './wtg-dispatch.html',
  styleUrl: './wtg-dispatch.css',
})
export class WtgDispatch {
  items: MenuItem[] = [];

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
    },
    {
      slNo: 5,
      planDate: '2026-04-14',
      projectCode: 'P-8005',
      wtgCount: 6
    },
    {
      slNo: 6,
      planDate: '2026-04-16',
      projectCode: 'P-8006',
      wtgCount: 3
    },
    {
      slNo: 7,
      planDate: '2026-04-18',
      projectCode: 'P-8007',
      wtgCount: 5
    },
    {
      slNo: 8,
      planDate: '2026-04-20',
      projectCode: 'P-8008',
      wtgCount: 2
    },
    {
      slNo: 9,
      planDate: '2026-04-22',
      projectCode: 'P-8009',
      wtgCount: 4
    },
    {
      slNo: 10,
      planDate: '2026-04-24',
      projectCode: 'P-8010',
      wtgCount: 7
    }
  ];

  // Stub handlers — wire to real edit/delete APIs once dispatch plan CRUD is available.
  dispatchMenu(event: Event, menu: any, dispatch: any) {
    this.items = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', dispatch) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', dispatch) }
    ];
    menu.toggle(event);
  }
}
import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { MenuItem, MessageService } from 'primeng/api';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_YEARLY_DEMAND_PLAN: any[] = [
  { yearlyDemandPlanId: 1, planYear: 2026, customer: { customerId: 1, customerName: 'ReNew Power' } },
  { yearlyDemandPlanId: 2, planYear: 2026, customer: { customerId: 2, customerName: 'Adani Green Energy' } },
  { yearlyDemandPlanId: 3, planYear: 2027, customer: { customerId: 3, customerName: 'Suzlon Energy' } },
  { yearlyDemandPlanId: 4, planYear: 2026, customer: { customerId: 4, customerName: 'Greenko' } },
  { yearlyDemandPlanId: 5, planYear: 2027, customer: { customerId: 5, customerName: 'Tata Power Renewable' } },
  { yearlyDemandPlanId: 6, planYear: 2026, customer: { customerId: 1, customerName: 'ReNew Power' } },
  { yearlyDemandPlanId: 7, planYear: 2025, customer: { customerId: 2, customerName: 'Adani Green Energy' } },
  { yearlyDemandPlanId: 8, planYear: 2027, customer: { customerId: 3, customerName: 'Suzlon Energy' } },
  { yearlyDemandPlanId: 9, planYear: 2026, customer: { customerId: 4, customerName: 'Greenko' } },
  { yearlyDemandPlanId: 10, planYear: 2027, customer: { customerId: 5, customerName: 'Tata Power Renewable' } },
];

@Component({
  selector: 'app-yearly-demand-plans',
  imports: [Shared],
  templateUrl: './yearly-demand-plans.html',
  styleUrl: './yearly-demand-plans.css',
})
export class YearlyDemandPlans implements OnInit {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  yearlyDemandPlanList: any[] = [];

  items: MenuItem[] = [];

  constructor(private apiService: Apiservice, private messageService: MessageService){}

  ngOnInit(): void {
      this.fetchAllYearlyDemandPlan();
  }

  fetchAllYearlyDemandPlan(){
    try {
      const data = {
        customerId: null,
        planYear: null,
        projectId: null,
        spvId: null,
        status: null,
        page: 0,
        size: 10,
        sortBy: "createdOn",
        sortDirection: "asc"
      }

      console.log(data);

      this.apiService.fetchAllYearlyDemandPlan(data).subscribe({
        next: val => {
          console.log(val);
          this.yearlyDemandPlanList = val.data.content;

          this.totalRecords = val.data.totalElements ?? 0;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.yearlyDemandPlanList = MOCK_YEARLY_DEMAND_PLAN;
            this.totalRecords = MOCK_YEARLY_DEMAND_PLAN.length;
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.yearlyDemandPlanList = MOCK_YEARLY_DEMAND_PLAN;
      this.totalRecords = MOCK_YEARLY_DEMAND_PLAN.length;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  loadYearlyPlan(event: any){
    console.log(event);
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllYearlyDemandPlan();
  }

  // Stub handlers — wire to real edit/delete APIs once yearly demand plan CRUD is available.
  yearlyPlanMenu(event: Event, menu: any, yearlyPlan: any) {
    this.items = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => console.log('edit', yearlyPlan) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('delete', yearlyPlan) }
    ];
    menu.toggle(event);
  }
}

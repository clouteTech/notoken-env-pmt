import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { MessageService } from 'primeng/api';

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
          }
        }
      })
    } catch (error) {
      console.log(error);

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
}

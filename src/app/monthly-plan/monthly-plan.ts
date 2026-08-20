import { Component, inject, OnInit } from '@angular/core';
import { TableModule }  from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Apiservice } from '../service/apiservice';
import { Shared } from '../shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_MONTHLY_DEMAND_PLAN: any[] = [
  { monthlyDemandPlanId: 1, planMonth: 'Apr 2026', projectCode: 'P-8001', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'ReNew Wind SPV 3', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 8, status: 'ACTIVE', createdOn: '2026-03-01T10:15:00', createdByName: 'Ravi Kumar' },
  { monthlyDemandPlanId: 2, planMonth: 'Apr 2026', projectCode: 'P-8002', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'Adani Renewable SPV 1', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.3, wtgCount: 5, status: 'DRAFT', createdOn: '2026-03-02T09:30:00', createdByName: 'Sunita Sharma' },
  { monthlyDemandPlanId: 3, planMonth: 'May 2026', projectCode: 'P-8003', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'Suzlon SPV 2', towerType: '130HH-420T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.5, wtgCount: 12, status: 'ACTIVE', createdOn: '2026-03-05T11:00:00', createdByName: 'Ajay Patel' },
  { monthlyDemandPlanId: 4, planMonth: 'May 2026', projectCode: 'P-8004', customerCode: 'C-104', customerName: 'Greenko', spvName: 'Greenko SPV 4', towerType: '140HH-353T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.5, wtgCount: 6, status: 'ON_HOLD', createdOn: '2026-03-06T14:45:00', createdByName: 'Meena Joshi' },
  { monthlyDemandPlanId: 5, planMonth: 'Jun 2026', projectCode: 'P-8005', customerCode: 'C-105', customerName: 'Tata Power Renewable', spvName: 'Tata Power SPV 1', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN182', capMw: 5.0, wtgCount: 4, status: 'COMPLETED', createdOn: '2026-03-07T08:20:00', createdByName: 'Vikram Singh' },
  { monthlyDemandPlanId: 6, planMonth: 'Jun 2026', projectCode: 'P-8006', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'ReNew Wind SPV 5', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.3, wtgCount: 10, status: 'ACTIVE', createdOn: '2026-03-08T13:10:00', createdByName: 'Ravi Kumar' },
  { monthlyDemandPlanId: 7, planMonth: 'Jul 2026', projectCode: 'P-8007', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'Adani Renewable SPV 3', towerType: '130HH-420T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 7, status: 'DRAFT', createdOn: '2026-03-09T10:00:00', createdByName: 'Sunita Sharma' },
  { monthlyDemandPlanId: 8, planMonth: 'Jul 2026', projectCode: 'P-8008', customerCode: 'C-106', customerName: 'JSW Energy', spvName: 'JSW SPV 2', towerType: '140HH-353T', bladeType: 'Big', wtgType: 'EN182', capMw: 5.5, wtgCount: 3, status: 'CANCELLED', createdOn: '2026-03-10T16:30:00', createdByName: 'Meena Joshi' },
  { monthlyDemandPlanId: 9, planMonth: 'Aug 2026', projectCode: 'P-8009', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'Suzlon SPV 5', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.5, wtgCount: 9, status: 'ACTIVE', createdOn: '2026-03-11T09:45:00', createdByName: 'Ajay Patel' },
  { monthlyDemandPlanId: 10, planMonth: 'Aug 2026', projectCode: 'P-8010', customerCode: 'C-104', customerName: 'Greenko', spvName: 'Greenko SPV 6', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.5, wtgCount: 11, status: 'ON_HOLD', createdOn: '2026-03-12T15:00:00', createdByName: 'Vikram Singh' },
];

@Component({
  selector: 'app-monthly-plan',
  imports: [TableModule, MenuModule, ButtonModule, DialogModule, DatePickerModule, FluidModule, Shared],
  templateUrl: './monthly-plan.html',
  styleUrl: './monthly-plan.css',
})
export class MonthlyPlan implements OnInit {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  items: MenuItem[] = [];
  actionItems: MenuItem[] = [];

  showComponentSerialModal = false;
  showComponentDetails = false;

  selectedMonthlyPlan: any;

  monthlyDemandPlanList: any[] = [];

  private router = inject(Router);
  private apiService = inject(Apiservice);
  
  constructor(private messageService: MessageService, private sanitizer: DomSanitizer){}

  ngOnInit(){
    this.items = this.getMenuItems();
    this.actionItems = this.getActionItems();

    this.fetchAllMonthlyDemandPlan();
  }

  fetchAllMonthlyDemandPlan(){
    try {
      const data = {
        customerId: null,
        planMonth: null,
        planYear: null,
        projectId: null,
        spvId: null,
        status: null,
        searchText: null,
        page: 0,
        size: 10,
        sortBy: "createdOn",
        sortDirection: "asc"
      }

      console.log(data);

      this.apiService.fetchAllMonthlyDemandPlan(data).subscribe({
        next: val => {
          console.log(val);
          this.monthlyDemandPlanList = val?.data?.data?.content;

          this.totalRecords = val?.data?.data?.totalElements ?? 0;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.monthlyDemandPlanList = MOCK_MONTHLY_DEMAND_PLAN;
            this.totalRecords = MOCK_MONTHLY_DEMAND_PLAN.length;
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.monthlyDemandPlanList = MOCK_MONTHLY_DEMAND_PLAN;
      this.totalRecords = MOCK_MONTHLY_DEMAND_PLAN.length;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });

    }
  }

  getMenuItems(){
    return [
      {
        label: 'View Component Serial',
        svgIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="currentColor" d="M21.92 11.6C19.9 6.91 16.1 4 12 4s-7.9 2.91-9.92 7.6a1 1 0 0 0 0 .8C4.1 17.09 7.9 20 12 20s7.9-2.91 9.92-7.6a1 1 0 0 0 0-.8M12 18c-3.17 0-6.17-2.29-7.9-6C5.83 8.29 8.83 6 12 6s6.17 2.29 7.9 6c-1.73 3.71-4.73 6-7.9 6m0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2" />
          </svg>
        `,
        command: () => this.router.navigate(['/plan', this.selectedMonthlyPlan.monthlyDemandPlanId, 'component-serial'])
      }
    ]
  }

  getActionItems(){
    return [
      {
        label: 'Create Component Serial',
        icon: 'pi pi-plus',
        command: () => this.openComponentSerial()
      }
    ]
  }

  getSeverity(status: string){
    switch(status){
      case 'DRAFT':
        return 'info';
        
      case 'ACTIVE':
        return 'success';
      
      case 'ON_HOLD':
        return 'warn';

      case 'COMPLETED':
        return 'success';

      case 'CANCELLED':
        return 'danger';

      default:
        return 'info';
    }
  }

  breakdownList = [
    {
      towerType: '120HH-474T',
      bladeType: 'Small',
      wtgCount: '2',
      wtgComponentCount: '30'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    },
    {
      towerType: '-',
      bladeType: 'Small',
      wtgCount: '5',
      wtgComponentCount: '50'
    },
    {
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: '2',
      wtgComponentCount: '32'
    }
  ]

  selectedMonth(month: any){
    this.showComponentDetails = true;
  }

  openComponentSerial(){
    try {
      this.showComponentSerialModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  monthlyMenu(event: Event, menu: any, monthlyPlan: any){
    this.selectedMonthlyPlan = monthlyPlan;
    console.log(this.selectedMonthlyPlan);
    menu.toggle(event);
  }

  loadMonthlyPlan(event: any){
    console.log(event);
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllMonthlyDemandPlan();
  }
}

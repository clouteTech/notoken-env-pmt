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

@Component({
  selector: 'app-monthly-plan',
  imports: [TableModule, MenuModule, ButtonModule, DialogModule, DatePickerModule, FluidModule, Shared],
  templateUrl: './monthly-plan.html',
  styleUrl: './monthly-plan.css',
})
export class MonthlyPlan implements OnInit {
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
          this.monthlyDemandPlanList = val.data.data;
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
}

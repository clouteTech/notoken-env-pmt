import { Component, inject } from '@angular/core';
import { TableModule }  from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-monthly-plan',
  imports: [TableModule, MenuModule, ButtonModule, DialogModule, DatePickerModule, FluidModule],
  templateUrl: './monthly-plan.html',
  styleUrl: './monthly-plan.css',
})
export class MonthlyPlan {
  items: MenuItem[] = [];
  actionItems: MenuItem[] = [];

  showComponentSerialModal = false;
  showComponentDetails = false;

  private router = inject(Router);
  
  constructor(private sanitizer: DomSanitizer){}
  
  planList = [
    {
      slNo: 1,
      createdOn: '2026-03-01',
      createdBy: 'Ravi Kumar',
      planMonth: '03/2026',
      towerType: '120HH-474T',
      bladeType: 'Small',
      wtgCount: 2,
      projectCode: 'P-1854',
      customerName: 'Adani'
    },
    {
      slNo: 2,
      createdOn: '2026-03-02',
      createdBy: 'Anita Sharma',
      planMonth: '03/2026',
      towerType: '-',
      bladeType: 'Small',
      wtgCount: 5,
      projectCode: 'P-1719',
      customerName: 'JSW'
    },
    {
      slNo: 3,
      createdOn: '2026-03-03',
      createdBy: 'Suresh Reddy',
      planMonth: '03/2026',
      towerType: '140HH-520T',
      bladeType: 'Big',
      wtgCount: 2,
      projectCode: 'P-2001',
      customerName: 'ReNew'
    },
    // {
    //   slNo: 4,
    //   createdOn: '2026-03-04',
    //   createdBy: 'Priya Nair',
    //   planMonth: '03/2026',
    //   towerType: 'T-110',
    //   bladeType: 'B-48',
    //   wtgCount: 12
    // },
    // {
    //   slNo: 5,
    //   createdOn: '2026-03-05',
    //   createdBy: 'Kiran Patel',
    //   planMonth: '03/2026',
    //   towerType: 'T-130',
    //   bladeType: 'B-52',
    //   wtgCount: 18
    // },
    // {
    //   slNo: 6,
    //   createdOn: '2026-03-06',
    //   createdBy: 'Arjun Singh',
    //   planMonth: '03/2026',
    //   towerType: 'T-95',
    //   bladeType: 'B-42',
    //   wtgCount: 6
    // },
    // {
    //   slNo: 7,
    //   createdOn: '2026-03-07',
    //   createdBy: 'Meera Iyer',
    //   planMonth: '03/2026',
    //   towerType: 'T-105',
    //   bladeType: 'B-46',
    //   wtgCount: 11
    // },
    // {
    //   slNo: 8,
    //   createdOn: '2026-03-08',
    //   createdBy: 'Vikram Rao',
    //   planMonth: '03/2026',
    //   towerType: 'T-125',
    //   bladeType: 'B-51',
    //   wtgCount: 14
    // },
    // {
    //   slNo: 9,
    //   createdOn: '2026-03-09',
    //   createdBy: 'Deepak Verma',
    //   planMonth: '03/2026',
    //   towerType: 'T-115',
    //   bladeType: 'B-49',
    //   wtgCount: 13
    // },
    // {
    //   slNo: 10,
    //   createdOn: '2026-03-10',
    //   createdBy: 'Sneha Joshi',
    //   planMonth: '03/2026',
    //   towerType: 'T-140',
    //   bladeType: 'B-55',
    //   wtgCount: 20
    // }
  ];

  ngOnInit(){
    this.items = this.getMenuItems();
    this.actionItems = this.getActionItems();
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
        command: () => this.router.navigate(['/component-serial'])
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
}

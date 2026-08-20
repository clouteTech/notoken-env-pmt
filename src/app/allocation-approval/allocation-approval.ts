import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { SelectModule }    from 'primeng/select';
import { DatePickerModule }from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MenuItem, MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-allocation-approval',
  imports: [CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule, RouterModule, MenuModule],
  templateUrl: './allocation-approval.html',
  styleUrl: './allocation-approval.css',
})
export class AllocationApproval {
  items: MenuItem[] = [];
  
  showAllocatedComponents = false;
  showRejectModal = false;

  selectedAllocation: any;

 allocationApprovalList = [
    {
      initiatedBy: 'Ravi Kumar',
      initiatedOn: '2026-03-25',
      planMonth: 'Apr 2026',
      plantName: 'Chennai',
      plantManager: 'Suresh Reddy',
      status: 'Created'
    },
    {
      initiatedBy: 'Meena Iyer',
      initiatedOn: '2026-03-20',
      planMonth: 'Apr 2026',
      plantName: 'Chennai',
      plantManager: 'Lakshmi Devi',
      status: 'Created'
    },
    {
      initiatedBy: 'Arjun Naik',
      initiatedOn: '2026-03-18',
      planMonth: 'May 2026',
      plantName: 'Trichy',
      plantManager: 'Manjunath H',
      status: 'Reviewed',
      reviewedBy: 'Ajith Kumar',
      reviewedOn: '2026-03-19'
    },
    {
      initiatedBy: 'Kiran Patel',
      initiatedOn: '2026-03-22',
      planMonth: 'Apr 2026',
      plantName: 'Pune',
      plantManager: 'Anitha Rao',
      status: 'Created'
    },
    {
      initiatedBy: 'Divya Menon',
      initiatedOn: '2026-03-15',
      planMonth: 'May 2026',
      plantName: 'Chennai',
      plantManager: 'Suresh Reddy',
      status: 'Reviewed',
      reviewedBy: 'Mohan',
      reviewedOn: '2026-03-16'
    },
    {
      initiatedBy: 'Ravi Kumar',
      initiatedOn: '2026-03-27',
      planMonth: 'May 2026',
      plantName: 'Trichy',
      plantManager: 'Manjunath H',
      status: 'Created'
    },
    {
      initiatedBy: 'Suresh Reddy',
      initiatedOn: '2026-03-12',
      planMonth: 'Mar 2026',
      plantName: 'Pune',
      plantManager: 'Anitha Rao',
      status: 'Reviewed',
      reviewedBy: 'Ajith Kumar',
      reviewedOn: '2026-03-13'
    },
    {
      initiatedBy: 'Meena Iyer',
      initiatedOn: '2026-03-28',
      planMonth: 'Jun 2026',
      plantName: 'Chennai',
      plantManager: 'Lakshmi Devi',
      status: 'Created'
    },
    {
      initiatedBy: 'Arjun Naik',
      initiatedOn: '2026-03-08',
      planMonth: 'Mar 2026',
      plantName: 'Trichy',
      plantManager: 'Manjunath H',
      status: 'Reviewed',
      reviewedBy: 'Mohan',
      reviewedOn: '2026-03-09'
    }
  ];

  allocatedComponentList = [
    {
      componentName: 'Nacelle',
      qty: '30',
    },
    {
      componentName: 'Hub',
      qty: '2',
    },
    {
      componentName: 'Tower',
      qty: '2',
    }
  ]

  productionManagerList = [
    {
      label: 'Ajith Kumar',
      value: 'Ajith Kumar'
    },
    {
      label: 'Surya',
      value: 'Surya'
    },
    {
      label: 'Karan',
      value: 'Karan'
    },
    {
      label: 'Siva',
      value: 'Siva'
    },
  ]

  getSeverity(status: string){
    switch(status){
      case 'Created':
        return 'info';
      
      case 'Reviewed':
        return 'success';
      
      case 'In_Progress':
        return 'warn';

      case 'Completed':
        return 'success';

      default:
        return 'info';
    }
  }

  review(item: any){
    console.log(item);
    item.status = 'Reviewed';
    item.reviewedBy = this.getCurrentUser();
    item.reviewedOn = this.getToday();

    // item.menuItems = this.getMenuItems(item);

    // this.allocationApprovalList = [...this.allocationApprovalList];

    console.log(this.allocationApprovalList);
  }

  getMenuItems() {
    if (this.selectedAllocation?.status === 'Created') {
      return [
        {
          label: 'Review',
          icon: 'pi pi-eye',
          command: () => this.review(this.selectedAllocation),
        }
      ];
    }

    if (this.selectedAllocation?.status === 'Reviewed') {
      return [
        {
          label: 'Accept',
          icon: 'pi pi-check',
          command: () => this.showAllocatedComponents = true
        },
        {
          label: 'Reject',
          icon: 'pi pi-times',
          command: () => this.showRejectModal = true
        }
      ]
    }

    return [];
  }

  getCurrentUser() {
    return 'Mohan';
  }

  getToday() {
    return new Date().toLocaleDateString('en-GB');
  }

  openMenu(menu: any, event: any, allocation: any) {
    this.selectedAllocation = allocation;
    console.log(this.selectedAllocation);
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}

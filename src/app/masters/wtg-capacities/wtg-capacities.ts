import { Component } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-wtg-capacities',
  imports: [Shared],
  templateUrl: './wtg-capacities.html',
  styleUrl: './wtg-capacities.css',
})
export class WtgCapacities {
  showWtgCapacityModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  wtgCapacityList = [
    {
      capacity: 2.5,
      unit: 'MW'
    },
    {
      capacity: 3.3,
      unit: 'MW'
    },
    {
      capacity: 5,
      unit: 'MW'
    }
  ]

  unitList = [
    {
      label: 'MW',
      value: 'MW'
    },
    {
      label: 'KW',
      value: 'KW'
    },
    {
      label: 'GW',
      value: 'GW'
    },
  ]

  openWTGCapacityModal(){
    try {
      this.showWtgCapacityModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil'
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCapacity()
      }
    ]
  }

  deleteCapacity(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete WTG Capacity`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger'
      },
      accept: () => {
          
      }
    });
  }
}

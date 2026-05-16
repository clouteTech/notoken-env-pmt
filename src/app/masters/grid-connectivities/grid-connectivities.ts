import { Component } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-grid-connectivities',
  imports: [Shared],
  templateUrl: './grid-connectivities.html',
  styleUrl: './grid-connectivities.css',
})
export class GridConnectivities {
  showConnectivityModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  gridConnectivityList = [
    {
      gridConnectivityName: 'STU'
    },
    {
      gridConnectivityName: 'CTU'
    }
  ]

  openGridConnectivityModal(){
    try {
      this.showConnectivityModal = true;
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
        command: () => this.deleteGridConnectivity()
      }
    ]
  }

  deleteGridConnectivity(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Grid Connectivities`,
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

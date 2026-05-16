import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-plants',
  imports: [Shared],
  templateUrl: './plants.html',
  styleUrl: './plants.css',
})
export class Plants {
  showPlantModal = false;

  items: MenuItem[] = [];

  private router = inject(Router);

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  plantList = [
    {
      plantName: 'Plant A',
      plantManager: 'Sanjay',
      location: 'Chennai'
    },
    {
      plantName: 'Plant B',
      plantManager: 'Anand',
      location: 'Pune'
    },
    {
      plantName: 'Plant C',
      plantManager: 'Sivam',
      location: 'Trichy'
    },
    {
      plantName: 'Warehouse',
      plantManager: 'Kayal',
      location: 'Tuticorin'
    }
  ]

  plantManagerList = [
    {
      label: 'Sanjay',
      value: 'Sanjay'
    },
    {
      label: 'Anand',
      value: 'Anand'
    },
    {
      label: 'Kayal',
      value: 'Kayal'
    }
  ]

  openPlantModal(){
    try {
      this.showPlantModal = true;
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
        label: 'Plant Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/plants/production-config'])
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePlant()
      }
    ]
  }

  deletePlant(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Plant`,
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

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-tower-types',
  imports: [Shared],
  templateUrl: './tower-types.html',
  styleUrl: './tower-types.css',
})
export class TowerTypes implements OnInit {
  showTowerTypeModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  towerTypeList = [
    {
      towerType: '120HH-474T',
      sectionCount: '5'
    },
    {
      towerType: '140HH-520T',
      sectionCount: '6'
    }
  ]

  openTowerTypeModal(){
    try {
      this.showTowerTypeModal = true;
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
        command: () => this.deleteTowerType()
      }
    ]
  }

  deleteTowerType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Tower Type`,
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

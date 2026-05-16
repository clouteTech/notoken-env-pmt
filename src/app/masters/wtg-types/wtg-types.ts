import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-wtg-types',
  imports: [Shared],
  templateUrl: './wtg-types.html',
  styleUrl: './wtg-types.css',
})
export class WtgTypes implements OnInit {
  showWTGTypeModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  wtgTypeList = [
    {
      wtgTypeName: 'EN132',
      isNearShore: 'Yes',
    },
    {
      wtgTypeName: 'EN158',
      isNearShore: 'No',
    },
    {
      wtgTypeName: 'EN176',
      isNearShore: 'Yes',
    }
  ]

  nearShoreList = [
    {
      label: 'Yes',
      value: true
    },
    {
      label: 'No',
      value: false
    }
  ]

  openWtgTypeModal(){
    try {
      this.showWTGTypeModal = true;
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
        command: () => this.deleteWTGType()
      }
    ]
  }

  deleteWTGType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete WTG Type`,
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

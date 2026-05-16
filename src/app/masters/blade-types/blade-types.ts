import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-blade-types',
  imports: [Shared],
  templateUrl: './blade-types.html',
  styleUrl: './blade-types.css',
})
export class BladeTypes implements OnInit {
  showBladeTypeModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  bladeTypeList = [
    {
      bladeType: 'Small'
    },
    {
      bladeType: 'Big'
    }
  ]

  openBladeTypeModal(){
    try {
      this.showBladeTypeModal = true;
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
        command: () => this.deleteBladeType()
      }
    ]
  }

  deleteBladeType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Blade Type`,
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

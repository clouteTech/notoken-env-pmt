import { Component } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-ppa-types',
  imports: [Shared],
  templateUrl: './ppa-types.html',
  styleUrl: './ppa-types.css',
})
export class PpaTypes {
  showPpaModal = false;

  items: MenuItem[] = [];

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  ppaTypeList = [
    {
      ppaTypeName: 'Auction'
    },
    {
      ppaTypeName: 'C&I'
    }
  ]

  openPpaModal(){
    try {
      this.showPpaModal = true;
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
        command: () => this.deletePpaType()
      }
    ]
  }

  deletePpaType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete PPA Type`,
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

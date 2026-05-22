import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-zones',
  imports: [Shared],
  templateUrl: './zones.html',
  styleUrl: './zones.css',
})
export class Zones implements OnInit {
  showZoneModal = false;

  zoneList: any[] = [];

  selectedZone: any;

  actionName = 'Create';

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private apiService: Apiservice, 
    private messageService: MessageService, private confirmationService: ConfirmationService){} 

  zoneForm = this.fb.group({
    zoneId: [0],
    zone: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllZones();
  }

  fetchAllZones(){
    try {
      this.apiService.fetchAllZones('').subscribe({
        next: val => {
          console.log(val);
          this.zoneList = val.data;
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
    }
  }

  submitZoneForm(){
    try {
      if (!this.selectedZone) {
        const data = this.zoneForm.value;
        console.log(data);

        this.apiService.createZone(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Zone' });
            this.showZoneModal = false;
            this.fetchAllZones();
          },
          error: err => {
            console.log(err);
  
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.zoneForm.value;
        console.log(data);

        this.apiService.updateZone(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Zone' });
            this.showZoneModal = false;
            this.fetchAllZones();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  editZone(){
    try {
      this.showZoneModal = true;
      this.actionName = 'Update';
      this.zoneForm.patchValue(this.selectedZone);
    } catch (error) {
      console.log(error);
    }
  }

  deleteZone(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Zone`,
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
          const data = {
            zoneId: this.selectedZone.zoneId
          }

          console.log(data);

          this.apiService.deleteZone(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Zone' });
              this.fetchAllZones();
            },
            error: err => {
              console.log(err);

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
      }
    });
  }

  openZoneModal(){
    try {
      this.showZoneModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editZone()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteZone()
      }
    ]
  }

  zoneMenu(event: Event, menu: any, zone: any){
    this.selectedZone = zone;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedZone = null;
    this.actionName = 'Create';
    this.zoneForm.reset();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-wtg-capacities',
  imports: [Shared],
  templateUrl: './wtg-capacities.html',
  styleUrl: './wtg-capacities.css',
})
export class WtgCapacities implements OnInit {
  showWtgCapacityModal = false;

  selectedCapacity: any;

  wtgCapacityList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  wtgCapacityForm = this.fb.group({
    capacityId: [0],
    capacity: [null, Validators.required],
    unit: ['', Validators.required],
    status: [false]
  })

  get capacity(){
    return this.wtgCapacityForm.get('capacity');
  }

  get unit(){
    return this.wtgCapacityForm.get('unit');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCapacities();
  }

  fetchAllCapacities(){
    try {
      this.apiService.fetchAllCapacities('').subscribe({
        next: val => {
          console.log(val);
          this.wtgCapacityList = val.data;
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

  submitCapacityForm(){
    try {
      if (this.wtgCapacityForm.valid) {
        if (!this.selectedCapacity) {  
          const data = this.wtgCapacityForm.value;
          console.log(data);
    
          this.apiService.createCapacity(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Capacity' });
              this.showWtgCapacityModal = false;
              this.fetchAllCapacities();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.wtgCapacityForm.value;
    
          console.log(data);
  
          this.apiService.updateCapacity(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Capacity' });
              this.showWtgCapacityModal = false;
              this.fetchAllCapacities();
            },
            error: err => {
              console.log(err);
  
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        }       
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  editCapacity(){
    try {
      this.showWtgCapacityModal = true;
      this.wtgCapacityForm.patchValue(this.selectedCapacity);
    } catch (error) {
      console.log(error);
    }
  }

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
        icon: 'pi pi-pencil',
        command: () => this.editCapacity()
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
          const data = {
            capacityId: this.selectedCapacity.capacityId
          }

          console.log(data);

          this.apiService.deleteCapacity(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Capacity' });
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

  capacityMenu(event: Event, menu: any, capacity: any){
    this.selectedCapacity = capacity;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCapacity = null;
    this.wtgCapacityForm.reset();
  }
}

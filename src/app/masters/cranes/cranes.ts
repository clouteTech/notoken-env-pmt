import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-cranes',
  imports: [Shared],
  templateUrl: './cranes.html',
  styleUrl: './cranes.css',
})
export class Cranes implements OnInit {
  items: MenuItem[] = [];

  craneList: any[] = [];

  actionName = 'Create';

  selectedCrane: any;

  showCraneModal = false;

  private fb = inject(FormBuilder);
  
  constructor(private messageService: MessageService, private apiService: Apiservice,
    private confirmationService: ConfirmationService
  ){}

  craneForm = this.fb.group({
    craneId: [0],
    craneType: [''],
    craneModel: [''],
    craneMake: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCranes();
  }

  fetchAllCranes(){
    try {
      this.apiService.fetchAllCranes('').subscribe({
        next: val => {
          console.log(val);
          this.craneList = val.data;
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitCraneForm(){
    try {
      if (!this.selectedCrane) {
        const data = this.craneForm.value;
        console.log(data);
  
        this.apiService.createCrane(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane' });
            this.showCraneModal = false;
            this.fetchAllCranes();
          },
          error: err => {
            console.log(err);
  
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.craneForm.value;
        console.log(data);

        this.apiService.updateCrane(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane' });
            this.showCraneModal = false;
            this.fetchAllCranes();
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCrane(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Crane`,
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
        try {
          const data = {
            craneId: this.selectedCrane.craneId
          }
          console.log(data);

          this.apiService.deleteCrane(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane' });
              this.fetchAllCranes();
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  openCraneModal(){
    try {
      this.showCraneModal = true;
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCrane(){
    try {
      this.showCraneModal = true;
      this.actionName = 'Update';
      this.craneForm.patchValue(this.selectedCrane);
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCrane()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCrane()
      }
    ]
  }

  craneMenu(event: Event, menu: any, crane: any){
    this.selectedCrane = crane;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCrane = null;
    this.actionName = 'Create';
    this.craneForm.reset();
  }
}

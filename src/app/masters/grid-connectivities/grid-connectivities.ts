import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-grid-connectivities',
  imports: [Shared],
  templateUrl: './grid-connectivities.html',
  styleUrl: './grid-connectivities.css',
})
export class GridConnectivities {
  showConnectivityModal = false;

  selectedGridConnectivity: any;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  gridConnectivityForm = this.fb.group({
    gridConnectivityId: [0],
    gridConnectivity: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllGridConnectivities();

  }

  fetchAllGridConnectivities(){
    try {
      this.apiService.fetchAllGridConnectivities('').subscribe({
        next: val => {
          console.log(val);
          this.gridConnectivityList = val.data;
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

  submitGridConnectivityForm(){
    try {
      if (!this.selectedGridConnectivity) { 
        const data = this.gridConnectivityForm.value;
        console.log(data);
  
        this.apiService.createGridConnectivity(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Grid Connectivity' });
            this.showConnectivityModal = false;
            this.fetchAllGridConnectivities();
          },
          error: err => {
            console.log(err);
  
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.gridConnectivityForm.value;
        console.log(data);
  
        this.apiService.updateGridConnectivity(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Grid Connectivity' });
            this.showConnectivityModal = false;
            this.fetchAllGridConnectivities();
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

  editGridConnectivity(){
    try {
      this.showConnectivityModal = true;
      this.gridConnectivityForm.patchValue(this.selectedGridConnectivity);
    } catch (error) {
      console.log(error);
    }
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
        icon: 'pi pi-pencil',
        command: () => this.editGridConnectivity()
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
        const data = {
          gridConnectivityId: this.selectedGridConnectivity.gridConnectivityId
        }

        console.log(data);

        this.apiService.deleteGridConnectivity(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Grid Connectivity' });
            this.fetchAllGridConnectivities();
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

  gridConnectivityMenu(event: Event, menu: any, gridConnectivity: any){
    this.selectedGridConnectivity = gridConnectivity;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedGridConnectivity = null;
    this.gridConnectivityForm.reset();
  }
}

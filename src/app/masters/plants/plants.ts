import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-plants',
  imports: [Shared],
  templateUrl: './plants.html',
  styleUrl: './plants.css',
})
export class Plants implements OnInit {
  showPlantModal = false;

  selectedPlant: any;

  actionName = 'Create';

  plantList: any[] = [];
  userList: any[] = [];

  items: MenuItem[] = [];

  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService,
    private apiService: Apiservice
  ){}

  plantForm = this.fb.group({
    plantId: [''],
    plant: [''],
    location: [''],
    plantManager: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchPlantList();
  }

  fetchPlantList(){
    try {
      const data = {
        page: 0,
        size: 10,
        search: null
      }

      console.log(data);

      this.apiService.fetchAllPlants(data).subscribe({
        next: val => {
          console.log(val);
          this.plantList = val.data.content;
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

  // plantList = [
  //   {
  //     plantName: 'Plant A',
  //     plantManager: 'Sanjay',
  //     location: 'Chennai'
  //   },
  //   {
  //     plantName: 'Plant B',
  //     plantManager: 'Anand',
  //     location: 'Pune'
  //   },
  //   {
  //     plantName: 'Plant C',
  //     plantManager: 'Sivam',
  //     location: 'Trichy'
  //   },
  //   {
  //     plantName: 'Warehouse',
  //     plantManager: 'Kayal',
  //     location: 'Tuticorin'
  //   }
  // ]

  submitPlantForm(){
    try {
      if (!this.selectedPlant) {
        const data = this.plantForm.value;
        console.log(data);
        
        this.apiService.createPlant(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Plant' });
            this.showPlantModal = false;
            this.fetchPlantList();
          },
          error: err => {
            console.log(err);
  
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.plantForm.value;
        console.log(data);

        this.apiService.updatePlant(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Plant' });
            this.showPlantModal = false;
            this.fetchPlantList();
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

  fetchUsersByUsergroup(){
    try {
      const data = {
        userGroupId: 5
      }

      console.log(data);

      this.apiService.fetchUsersByUserGroup(data).subscribe({
        next: val => {
          console.log(val);
          this.userList = val.data;
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

  openPlantModal(){
    try {
      this.showPlantModal = true;
      this.fetchUsersByUsergroup();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editPlant(){
    try {
      this.showPlantModal = true;
      this.actionName = 'Update';
      this.plantForm.patchValue({
        ...this.selectedPlant,
        plantId: this.selectedPlant?.id
      });
      this.fetchUsersByUsergroup();
      // console.log(this.plantForm.value);
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editPlant()
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
        try {
          const data = {
            plantId: this.selectedPlant.id
          }
          console.log(data);

          this.apiService.deletePlant(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Plant' });
              this.fetchPlantList();
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

  plantMenu(event: Event, menu: any, plant: any){
    this.selectedPlant = plant;
    console.log(this.selectedPlant);
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedPlant = null;
    this.actionName = 'Create';
    this.plantForm.reset();
  }
}

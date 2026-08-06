import { Component, inject, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-wtg-location-details',
  imports: [Shared],
  templateUrl: './project-wtg-location-details.html',
  styleUrl: './project-wtg-location-details.css',
})
export class ProjectWtgLocationDetails implements OnInit {
  projectId = 0;

  showLocationModal = false;

  actionName = 'Assign';

  selectPrjWTG: any;
  selectedProject: any;

  prjWTGDetails: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder); 

  constructor(private apiService: Apiservice, private messageService: MessageService, 
    private route: ActivatedRoute, private confirmationService: ConfirmationService, 
    private router: Router){}

  locationForm = this.fb.group({
    projectId: [0],
    projectWtgId: [0],
    locationId: [0],
    maximoId: ['', Validators.maxLength(100)],
    locationCode: ['', [Validators.required, Validators.maxLength(100)]],
    village: ['', Validators.maxLength(100)],
    latitude: [null],
    longitude: [null],
    status: [false]
  })

  get locationCode(){
    return this.locationForm.get('locationCode');
  }

  get maximoId(){
    return this.locationForm.get('maximoId');
  }

  get village(){
    return this.locationForm.get('village');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();

    this.route.paramMap.subscribe((param) => {
      const id = param.get('projectId');
      console.log(id);

      if (id) {
        this.projectId = Number(id);
        this.fetchPrjWTGDetails();
      }
    });

    this.selectedProject = history.state.project;
    console.log(this.selectedProject);
  }

  fetchPrjWTGDetails(){
    try {
      const data = {
        projectId: this.projectId
      }
      console.log(data);

      this.apiService.fetchPrjWTGDetails(data).subscribe({
        next: val => {
          console.log(val);
          this.prjWTGDetails = val.data;
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

  submitLocationForm(){
    try {
      if (this.locationForm.valid) {   
        if (this.selectPrjWTG?.location?.locationId) {
          const data = this.locationForm.value;
          console.log(data);
  
          this.apiService.updatePrjWTGLocation(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', 
                detail: 'Successfully Updated Project WTG Location' });
              this.showLocationModal = false;
              this.fetchPrjWTGDetails();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {       
          const data = {
            ...this.locationForm.value,
            projectId: this.projectId,
            projectWtgId: this.selectPrjWTG?.projectWtg?.projectWtgId
          };
          console.log(data);
    
          this.apiService.createPrjWTGLocation(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', 
                detail: `Successfully Location Assigned to ${this.selectPrjWTG?.projectWtg?.wtgCode} Project WTG` });
              this.showLocationModal = false;
              this.fetchPrjWTGDetails();
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openLocationModal(){
    try {
      this.showLocationModal = true;
      if (this.selectPrjWTG?.location?.locationId) {
        this.locationForm.patchValue({
          projectId: this.projectId,
          projectWtgId: this.selectPrjWTG.projectWtg.projectWtgId,
          locationId: this.selectPrjWTG.location.locationId,
          maximoId: this.selectPrjWTG.location.maximoId,
          locationCode: this.selectPrjWTG.location.locationCode,
          village: this.selectPrjWTG.location.village,
          latitude: this.selectPrjWTG.location.latitude,
          longitude: this.selectPrjWTG.location.longitude,
          status: this.selectPrjWTG.location.status
        });
        this.actionName = 'Update';
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteLocation(){
    try {
      this.confirmationService.confirm({
        message: `Do you want to delete this record?`,
        header: `Delete Location ${this.selectPrjWTG?.location?.locationCode}`,
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
              locationId: this.selectPrjWTG?.location?.locationId
            }
            console.log(data);

            this.apiService.deletePrjWTGLocation(data).subscribe({
              next: val => {
                console.log(val);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Project WTG Location' });
                this.fetchPrjWTGDetails();
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
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getSeverity(status: string){
    switch(status){
      case 'NOT_STARTED':
        return 'info';
        
      case 'FDN_IN_PROGRESS':
        return 'warn';

      case 'FDN_COMPLETED':
        return 'success';
      
      case 'INS_IN_PROGRESS':
        return 'warn';

      case 'INS_COMPLETED':
        return 'success';

      case 'COMM_IN_PROGRESS':
        return 'warn';

      case 'COMM_COMPLETED':
        return 'success';

      case 'HOLD':
        return 'warn';

      case 'CANCELLED':
        return 'danger';

      default:
        return 'info';
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Update Location',
        icon: 'pi pi-link',
        command: () => this.openLocationModal()
      },
      {
        label: 'Delete Location',
        icon: 'pi pi-trash',
        command: () => this.deleteLocation()
      }
    ]
  }

  wtgLocationMenu(event: Event, menu: any, wtg: any){
    this.selectPrjWTG = wtg;
    console.log(this.selectPrjWTG);
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectPrjWTG = null;
    this.actionName = 'Assign';
    this.locationForm.reset();
  }
}

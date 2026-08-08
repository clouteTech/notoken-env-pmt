import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shared } from '../shared/services/shared';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from '../service/apiservice';
import { FormBuilder } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export const craneRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const craneId = control.get('craneId')?.value;
  // Fails validation if craneId is null, undefined, or 0
  return craneId && craneId !== 0 ? null : { craneRequired: true };
};

@Component({
  selector: 'app-assign-project-crane-details',
  imports: [Shared],
  templateUrl: './assign-project-crane-details.html',
  styleUrl: './assign-project-crane-details.css',
})

export class AssignProjectCraneDetails implements OnInit {
  projectId = 0;

  showPrjCraneDetail = false;

  actionName = 'Assign';

  projectCraneList: any[] = [];
  craneInfoList: any[] = [];
  supplierList: any[] = [];

  selectedPrjCrane: any;
  selectedProject: any;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute, private messageService: MessageService, 
    private apiService: Apiservice, private confirmationService: ConfirmationService){}

  prjCraneForm = this.fb.group({
    craneType: [null as number | null],
    craneModel: [null as number | null],
    craneMake: [null as number | null],
    
    projectId: [0],
    projectCraneDetailId: [0],
    craneId: [0],
    supplierId: [0, Validators.required],
    registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
    status: [false]
  }, { validators: craneRequiredValidator })

  get isCraneInvalid(): boolean {
    const craneType = this.prjCraneForm.get('craneType');
    const craneModel = this.prjCraneForm.get('craneModel');
    const craneMake = this.prjCraneForm.get('craneMake');

    const isTouched = craneType?.touched || craneModel?.touched || craneMake?.touched || craneType?.dirty;
    
    return this.prjCraneForm.hasError('craneRequired') && Boolean(isTouched);
  }

  get supplierId(){
    return this.prjCraneForm.get('supplierId');
  }

  get registrationNumber(){
    return this.prjCraneForm.get('registrationNumber');
  }

  ngOnInit(){
    this.items = this.getMenuItems();
    
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      console.log(id);

      if (id) {
        this.projectId = Number(id);
        this.fetchAllProjectCraneDetails();
      }
    });

    this.selectedProject = history.state.project;
    console.log(this.selectedProject);
  }

  fetchAllProjectCraneDetails(){
    try {
      this.apiService.fetchAllProjectCraneDetails('').subscribe({
        next: val => {
          console.log(val);
          this.projectCraneList = val.data;
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

  fetchCraneInfo(){
    try {
      this.apiService.fetchCraneInfo('').subscribe({
        next: val => {
          console.log(val);
          this.craneInfoList = val.data;
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

  selectedCrane(craneId: number | null){
    if (!craneId) {
    // Reset all crane controls if clear button is clicked
    this.prjCraneForm.patchValue({
      craneType: null,
      craneModel: null,
      craneMake: null,
      craneId: 0,
      supplierId: 0
    });
      this.supplierList = [];
      return;
    }

    this.prjCraneForm.patchValue({
      craneType: craneId,
      craneModel: craneId,
      craneMake: craneId,
      craneId: craneId
    });

    try {
      const data = {
        craneId: craneId
      }

      console.log(data);

      this.apiService.fetchCraneSuppliers(data).subscribe({
        next: val => {
          console.log(val);
          this.supplierList = val.data.suppliers;
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

  submitPrjCraneForm(){
    try {
      if (!this.selectedPrjCrane) {
        
        const formValue = this.prjCraneForm.value;
  
        const data = {
          projectId: this.projectId,
          craneId: formValue.craneId,
          supplierId: formValue.supplierId,
          registrationNumber: formValue.registrationNumber
        };
        console.log(data);
  
        this.apiService.assignPrjCraneDetail(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', 
                  detail: `Successfully Crane Detail Assigned` });
            this.showPrjCraneDetail = false;
            this.fetchAllProjectCraneDetails();
          },
          error: err => {
            console.log(err);
      
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const formValue = this.prjCraneForm.value;
  
        const data = {
          projectCraneDetailId: formValue.projectCraneDetailId,
          craneId: formValue.craneId,
          supplierId: formValue.supplierId,
          registrationNumber: formValue.registrationNumber,
          status: formValue.status
        };
        console.log(data);
  
        this.apiService.updatePrjCraneDetail(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', 
                  detail: `Successfully Crane Detail Updated` });
            this.showPrjCraneDetail = false;
            this.fetchAllProjectCraneDetails();
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

  deleteCraneDetail(){
    try {
      this.confirmationService.confirm({
        message: `Do you want to delete this record?`,
        header: `Delete Crane Detail`,
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
              projectCraneDetailId: this.selectedPrjCrane.projectCraneDetailId
            }

            console.log(data);

            this.apiService.deletePrjCraneDetail(data).subscribe({
              next: val => {
                console.log(val);
                this.messageService.add({ severity: 'success', summary: 'Success', 
                      detail: `Successfully Deleted Crane Detail` });
                this.fetchAllProjectCraneDetails();
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

  openCraneDetail(){
    try {
      this.showPrjCraneDetail = true;
      this.fetchCraneInfo();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCraneDetail(){
    try {
      this.showPrjCraneDetail = true;
      this.fetchCraneInfo();

      this.selectedCrane(this.selectedPrjCrane?.crane?.craneId);

      this.prjCraneForm.patchValue({
        projectCraneDetailId: this.selectedPrjCrane?.projectCraneDetailId,
        craneId: this.selectedPrjCrane?.crane?.craneId,
        supplierId: this.selectedPrjCrane?.supplier?.supplierId,
        registrationNumber: this.selectedPrjCrane?.registrationNumber,
        status: this.selectedPrjCrane?.status
      })

      this.actionName = 'Update';
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Update Crane Detail',
        icon: 'pi pi-link',
        command: () => this.editCraneDetail()
      },
      {
        label: 'Delete Crane Detail',
        icon: 'pi pi-trash',
        command: () => this.deleteCraneDetail()
      }
    ]
  }

  prjCraneMenu(event: Event, menu: any, crane: any){
    this.selectedPrjCrane = crane;
    console.log(this.selectedPrjCrane);
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedPrjCrane = null;
    this.actionName = 'Assign';
    this.prjCraneForm.reset();
  }
}

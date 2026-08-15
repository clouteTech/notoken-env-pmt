import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-crane-suppliers',
  imports: [Shared],
  templateUrl: './crane-suppliers.html',
  styleUrl: './crane-suppliers.css',
})
export class CraneSuppliers {
  items: MenuItem[] = [];

  showSupplierModal = false;

  actionName = 'Create';

  selectedCraneSupplier: any;
  
  craneSupplierList: any[] = [];

  private fb = inject(FormBuilder);

  craneSupplierForm = this.fb.group({
    supplierId: [0],
    supplierName: ['', [Validators.required, Validators.maxLength(150)]],
    contactPerson: ['', Validators.maxLength(100)],
    mobileNo: ['', Validators.maxLength(15)],
    email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/), Validators.maxLength(100)]],
    status: [false]
  })

  get supplierName(){
    return this.craneSupplierForm.get('supplierName');
  }

  get contactPerson(){
    return this.craneSupplierForm.get('contactPerson');
  }

  get mobileNo(){
    return this.craneSupplierForm.get('mobileNo');
  }

  get email(){
    return this.craneSupplierForm.get('email');
  }

  constructor(private apiService: Apiservice, private messageService: MessageService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(){
    this.fetchAllCraneSuppliers();
    this.items = this.getMenuItems();
  }

  fetchAllCraneSuppliers(){
    try {
      this.apiService.fetchAllCraneSuppliers('').subscribe({
        next: val => {
          console.log(val);
          this.craneSupplierList = val.data;
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

  submitCraneSupplierForm(){
    try {
      if (this.craneSupplierForm.valid) {
        if (!this.selectedCraneSupplier) {
          const data = this.craneSupplierForm.value;
          console.log(data);
    
          this.apiService.createCraneSupplier(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Crane Supplier' });
              this.showSupplierModal = false;
              this.fetchAllCraneSuppliers();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })     
        } else {
          const data = this.craneSupplierForm.value;
          console.log(data);
  
          this.apiService.updateCraneSupplier(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Crane Supplier' });
              this.showSupplierModal = false;
              this.fetchAllCraneSuppliers();
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

  editCraneSupplier(){
    try {
      this.showSupplierModal = true;
      this.actionName = 'Update';
      this.craneSupplierForm.patchValue(this.selectedCraneSupplier);
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCraneSupplier(){
    try {
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: `Delete Crane Supplier`,
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
              supplierId: this.selectedCraneSupplier.supplierId
            }
            console.log(data);

            this.apiService.deleteCraneSupplier(data).subscribe({
              next: val => {
                console.log(val);
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Crane Supplier' });
                this.fetchAllCraneSuppliers();
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
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openSupplierModal(){
    try {
      this.showSupplierModal = true;
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
        command: () => this.editCraneSupplier()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCraneSupplier()
      }
    ]
  }

  supplierMenu(event: Event, menu: any, supplier: any){
    this.selectedCraneSupplier = supplier;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCraneSupplier = null;
    this.actionName = 'Create';
    this.craneSupplierForm.reset();
  }
}

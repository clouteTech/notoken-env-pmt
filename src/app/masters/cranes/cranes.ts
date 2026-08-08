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
  supplierList: any[] = [];
  assignedSuppliers: any[] = [];
  supplierSearchQuery = '';
  supplierModalLoading = false;

  actionName = 'Create';

  selectedCrane: any;

  showCraneModal = false;
  showSupplierModal = false;

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


  isSupplierAssigned(supplierId: number){
    return this.assignedSuppliers.some(
      supplier => supplier.supplierId === supplierId
    )
  }

  toggleSupplier(supplier: any){
    try {
      if (this.isSupplierAssigned(supplier.supplierId)) {
        this.removeSuppliersFromCrane(supplier);
      } else {
        this.assignSuppliersToCrane(supplier);
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getSupplierMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedSuppliers(){
    const query = this.supplierSearchQuery.trim().toLowerCase();
    return this.supplierList.filter(s =>
      this.isSupplierAssigned(s.supplierId) &&
      (!query || s.supplierName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableSuppliers(){
    const query = this.supplierSearchQuery.trim().toLowerCase();
    return this.supplierList.filter(s =>
      !this.isSupplierAssigned(s.supplierId) &&
      (!query || s.supplierName?.toLowerCase().includes(query))
    );
  }


  assignSuppliersToCrane(supplier: any){
     try {
      const data = {
        craneId: this.selectedCrane.craneId,
        supplierId: supplier.supplierId
      }
      console.log(data);

      this.apiService.assignSuppliersToCrane(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Assigned Successfully' });
          this.fetchCraneSuppliers();
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

  removeSuppliersFromCrane(supplier: any){
    try {
      const data = {
        craneId: this.selectedCrane.craneId,
        supplierId: supplier.supplierId
      }
      console.log(data);

      this.apiService.removeSuppliersFromCrane(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier Removed Successfully' });
          this.fetchCraneSuppliers();
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

  fetchCraneSuppliers(){
    try {
      const data = {
        craneId: this.selectedCrane.craneId
      }
      console.log(data);

      this.apiService.fetchCraneSuppliers(data).subscribe({
        next: val => {
          console.log(val);
          this.assignedSuppliers = val.data.suppliers;
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

  fetchSupplierInfo(){
    try {
      this.supplierModalLoading = true;
      this.apiService.fetchSupplierInfo('').subscribe({
        next: val => {
          console.log(val);
          this.supplierList = val.data;
          this.supplierModalLoading = false;
        },
        error: err => {
          console.log(err);
          this.supplierModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.supplierModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
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

  openSupplierModal(){
    try {
      this.showSupplierModal = true;
      this.supplierSearchQuery = '';
      this.fetchSupplierInfo();
      this.fetchCraneSuppliers();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove Suppliers',
        icon: 'pi pi-user-plus',
        command: () => this.openSupplierModal()
      },
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

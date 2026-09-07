import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-customers',
  imports: [Shared],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  showCustomerModal = false;

  items: MenuItem[] = [];

  customerList:any;
  selectedCustomer: any;

  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService){}

  editCustomerForm = this.fb.group({
    customerId: [0],
    customerCode: ['', [Validators.required, Validators.maxLength(10)]],
    customerName: ['', [Validators.required, Validators.maxLength(150)]],
    status: [false]
  })

  get customerCode(){
    return this.editCustomerForm.get('customerCode');
  }

  get customerName(){
    return this.editCustomerForm.get('customerName');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems("");
    this.getCustomerList();
  }

  getCustomerList(){
    try{
      let data = {
        "search": null,
        "status": null,
        "page": 0,
        "size": 10,
        "sortBy": "createdOn",
        "sortDirection": "asc"
      }
       this.apiService.customerSearch(data).subscribe({
        next: val => {
          this.customerList = val.data.content;

          this.totalRecords = val.data.totalElements ?? 0;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitCustomerForm(){
    try {
      const data = this.editCustomerForm.value;

      this.apiService.updateCustomer(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Customer' });
          this.showCustomerModal = false;
          this.getCustomerList();
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editCustomer(){
    try {
      this.showCustomerModal = true;
      this.editCustomerForm.patchValue(this.selectedCustomer);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
  
  getMenuItems(row: any){
    return [
      {
        label: 'Edit Customer',
        icon: 'pi pi-pencil',
        command: () => this.editCustomer()
      },
      {
        label: 'View Customer SPV Details',
        icon: 'pi pi-eye',
        command: () => this.viewSPV(row)
        
      },
      {
        label: 'Quality Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/customers/quality-config'])
      },
      {
        label: 'Delete Customer',
        icon: 'pi pi-trash',
        // command: () => this.deletePpaType()
      }
    ]
  }

  viewSPV(val:any){
    try{
    this.router.navigate(['/customers/spv']);
    sessionStorage.setItem("CustomerId",val.customerId)
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  loadCustomer(event: any){
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.getCustomerList();
  }

  customerMenu(event: Event, menu: any, customer: any){
    this.selectedCustomer = customer;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCustomer = null;
    this.editCustomerForm.reset();
  }
}

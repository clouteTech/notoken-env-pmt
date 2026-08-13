import { Component, inject } from '@angular/core';
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

  items: MenuItem[] = [];
  customerList:any;
  private router = inject(Router);

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService){}

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
          console.log(val);
          console.log(val.data);
          this.customerList = val.data.content;

          this.totalRecords = val.data.totalElements ?? 0;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
  
  getMenuItems(row: any){
    return [
      {
        label: 'View Customer SPV Details',
        icon: 'pi pi-eye',
        command: () => this.viewSPV(row)
        
      },
      {
        label: 'Quality Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/customers/quality-config'])
      }
    ]
  }

  viewSPV(val:any){
    try{
    this.router.navigate(['/customers/spv']);
    sessionStorage.setItem("CustomerId",val.customerId)
    }catch(e){

    }
  }

  loadCustomer(event: any){
    console.log(event);
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.getCustomerList();
  }
}

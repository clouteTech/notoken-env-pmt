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
        "customerId": 1
      }
       this.apiService.customer(data).subscribe({
        next: val => {
          console.log(val);
          console.log(val.data);
          this.customerList = [val.data];
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

/*   customerList = [
    {
      customerCode: 'CUST001',
      customerName: 'Reliance Power Ltd'
    },
    {
      customerCode: 'CUST002',
      customerName: 'Adani Green Energy'
    },
    {
      customerCode: 'CUST003',
      customerName: 'Tata Power Renewable'
    },
    {
      customerCode: 'CUST004',
      customerName: 'Suzlon Energy'
    },
    {
      customerCode: 'CUST005',
      customerName: 'ReNew Power'
    },
    {
      customerCode: 'CUST006',
      customerName: 'JSW Energy'
    }
  ]; */

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
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_CUSTOMERS: any[] = [
  { customerId: 1, customerCode: 'CUST001', customerName: 'ReNew Power Pvt Ltd' },
  { customerId: 2, customerCode: 'CUST002', customerName: 'Adani Green Energy Ltd' },
  { customerId: 3, customerCode: 'CUST003', customerName: 'Suzlon Energy Ltd' },
  { customerId: 4, customerCode: 'CUST004', customerName: 'Greenko Energies Pvt Ltd' },
  { customerId: 5, customerCode: 'CUST005', customerName: 'Tata Power Renewable Energy Ltd' },
  { customerId: 6, customerCode: 'CUST006', customerName: 'CleanMax Enviro Energy Solutions' },
  { customerId: 7, customerCode: 'CUST007', customerName: 'Continuum Green Energy Ltd' },
  { customerId: 8, customerCode: 'CUST008', customerName: 'Hero Future Energies Pvt Ltd' },
  { customerId: 9, customerCode: 'CUST009', customerName: 'Ayana Renewable Power Pvt Ltd' },
  { customerId: 10, customerCode: 'CUST010', customerName: 'JSW Energy Ltd' },
];

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
          } else {
            this.customerList = MOCK_CUSTOMERS;
            this.totalRecords = MOCK_CUSTOMERS.length;
          }
        }
      })

    }catch(e){
      this.customerList = MOCK_CUSTOMERS;
      this.totalRecords = MOCK_CUSTOMERS.length;
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

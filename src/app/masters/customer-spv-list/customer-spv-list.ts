import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-customer-spv-list',
  imports: [Shared],
  templateUrl: './customer-spv-list.html',
  styleUrl: './customer-spv-list.css',
})
export class CustomerSpvList {

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService){}

  spvList:any; /* [
  {
    spvName: 'Chennai Wind Farm Pvt Ltd',
    spvGst: '33ABCDE1234F1Z5',
    gstAddressLine: 'No. 12, Industrial Estate, Guindy',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600032',
    country: 'India'
  },
  {
    spvName: 'Pune Renewable Energy Pvt Ltd',
    spvGst: '27ABCDE5678G1Z2',
    gstAddressLine: 'Plot 45, MIDC Area, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411057',
    country: 'India'
  },
  {
    spvName: 'Gujarat Wind Power Ltd',
    spvGst: '24ABCDE9101H1Z8',
    gstAddressLine: 'Survey No. 89, Industrial Zone, Kutch',
    city: 'Bhuj',
    state: 'Gujarat',
    postalCode: '370001',
    country: 'India'
  },
  {
    spvName: 'Rajasthan Green Energy Pvt Ltd',
    spvGst: '08ABCDE1122J1Z3',
    gstAddressLine: 'Sector 5, RIICO Industrial Area',
    city: 'Jodhpur',
    state: 'Rajasthan',
    postalCode: '342005',
    country: 'India'
  },
  {
    spvName: 'Karnataka Wind Solutions Pvt Ltd',
    spvGst: '29ABCDE3344K1Z6',
    gstAddressLine: 'Plot 21, Peenya Industrial Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560058',
    country: 'India'
  }
]; */
customerDetail:any = "";

 ngOnInit(): void {
    this.getCustomerList();
  }

  getCustomerList(){
    try{
      var val = sessionStorage.getItem('CustomerId')
      let data = {
        "customerId": val
      }
       this.apiService.customerGet(data).subscribe({
        next: val => {
          console.log(val.data.spvDetails);
          this.customerDetail = val.data;
          this.spvList = val.data.spvDetails;
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
}

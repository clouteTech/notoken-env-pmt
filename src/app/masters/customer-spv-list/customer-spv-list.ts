import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-customer-spv-list',
  imports: [Shared],
  templateUrl: './customer-spv-list.html',
  styleUrl: './customer-spv-list.css',
})
export class CustomerSpvList {

  constructor(private confirmationService: ConfirmationService,private apiService:Apiservice,private messageService: MessageService,
    private formbuilder:FormBuilder
  ){}

  addSPVPopup = false;
  spvForm:any;
  selectedSPV:any;

  spvList:any = []; /* [
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
items: MenuItem[] = [];
SubmitBtnName:any = 'Submit';


 ngOnInit(): void {
   this.spvForm = this.formbuilder.group({
     spvName:['', Validators.required],
      spvGstNumber:['', Validators.required],
      address1:['', Validators.required],
      city:['', Validators.required],
      state:['', Validators.required],
      pinCode:['', Validators.required],
      country:['', Validators.required],
    })
    this.getCustomerList();
    this.items = this.getMenuItems();

  }

    getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
         command: () => this.editSPV()
      },
     
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteSPV()
      }
    ]
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

  addSPVDialog(){
    try{
      this.addSPVPopup = true;
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitSPVForm(){
    try{
      if (this.SubmitBtnName == 'Submit') {
        if (this.spvForm.valid) {
          var cusId = sessionStorage.getItem('CustomerId');
          var formValue = this.spvForm.value
          let data = {
            "customerId": cusId,
            "spvName": formValue.spvName,
            "spvGstNumber": formValue.spvGstNumber,
            "address1": formValue.address1,
            "address2": null,
            "city": formValue.city,
            "state": formValue.state,
            "pinCode": formValue.pinCode,
            "country": formValue.country
          }
          this.apiService.spvAdd(data)
            .subscribe({
              next: val => {
                this.addSPVPopup = false;
                this.spvForm.reset();
                this.getCustomerList();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
              }, error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
              }
            })

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
        }
      }else if(this.SubmitBtnName == 'Update'){
        if (this.spvForm.valid) {
          var formValue = this.spvForm.value
          let data = {
            "customerSpvId": this.selectedSPV.customerSpvId,
            "spvName": formValue.spvName,
            "spvGstNumber": formValue.spvGstNumber,
            "address1": formValue.address1,
            "address2": null,
            "city": formValue.city,
            "state": formValue.state,
            "pinCode": formValue.pinCode,
            "country": formValue.country
          }
          this.apiService.spvUpdate(data)
            .subscribe({
              next: val => {
                this.addSPVPopup = false;
                this.spvForm.reset();
                this.getCustomerList();
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SPV Added Successfully' });
              }, error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
              }
            })

        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
        }
      }
     
    }catch(e){

    }
  }

    SPVMenu(event: Event, menu: any, spv: any){
    this.selectedSPV = spv;
    menu.toggle(event);
  }

  editSPV(){
    try{
      this.addSPVPopup = true;
      this.spvForm.patchValue(this.selectedSPV);
      this.SubmitBtnName = 'Update'
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Enter All Fields' });
    }
  }

  deleteSPV(){
    try{
       this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete SPV`,
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
      var val = sessionStorage.getItem('CustomerId')

        const data = {
            "customerId": val,
            "customerSpvId": this.selectedSPV.customerSpvId
        }
        
        console.log(data);

         this.apiService.spvDelete(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted PPA Type' });
            this.getCustomerList();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } 
    })
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_PPA_TYPES: any[] = [
  { ppaTypeId: 1, ppaType: 'Fixed Tariff PPA', status: true },
  { ppaTypeId: 2, ppaType: 'Group Captive PPA', status: true },
  { ppaTypeId: 3, ppaType: 'Merchant PPA', status: false },
  { ppaTypeId: 4, ppaType: 'Wheeling PPA', status: true },
  { ppaTypeId: 5, ppaType: 'Third Party Sale PPA', status: true },
  { ppaTypeId: 6, ppaType: 'Open Access PPA', status: true },
  { ppaTypeId: 7, ppaType: 'Hybrid PPA', status: false },
  { ppaTypeId: 8, ppaType: 'Banking PPA', status: true },
  { ppaTypeId: 9, ppaType: 'Feed-in Tariff PPA', status: true },
  { ppaTypeId: 10, ppaType: 'Corporate PPA', status: true },
];

@Component({
  selector: 'app-ppa-types',
  imports: [Shared],
  templateUrl: './ppa-types.html',
  styleUrl: './ppa-types.css',
})
export class PpaTypes implements OnInit {
  showPpaModal = false;

  selectedPpaType: any;

  ppaTypeList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, private apiService: Apiservice,
    private messageService: MessageService
  ){}

  ppaTypeForm = this.fb.group({
    ppaTypeId: [0],
    ppaType: ['', [Validators.required, Validators.maxLength(50)]],
    status: [false]
  })

  get ppaType(){
    return this.ppaTypeForm.get('ppaType');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllPpaTypes();
  }

  fetchAllPpaTypes(){
    try {
      this.apiService.fetchAllPpaTypes('').subscribe({
        next: val => {
          console.log(val);
          this.ppaTypeList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.ppaTypeList = MOCK_PPA_TYPES;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.ppaTypeList = MOCK_PPA_TYPES;
    }
  }

  submitPpaTypeForm(){
    try {
      if (this.ppaTypeForm.valid) {
        if (!this.selectedPpaType) { 
          const data = this.ppaTypeForm.value;
          console.log(data);
    
          this.apiService.createPpaType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Zone' });
              this.showPpaModal = false;
              this.fetchAllPpaTypes();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.ppaTypeForm.value;
          console.log(data);
  
          this.apiService.updatePpaType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Zone' });
              this.showPpaModal = false;
              this.fetchAllPpaTypes();
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
    }
  }

  editPpaType(){
    try {
      this.showPpaModal = true;
      this.ppaTypeForm.patchValue(this.selectedPpaType);
    } catch (error) {
      console.log(error);
    }
  }

  openPpaModal(){
    try {
      this.showPpaModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editPpaType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deletePpaType()
      }
    ]
  }

  deletePpaType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete PPA Type`,
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
        const data = {
          ppaTypeId: this.selectedPpaType.ppaTypeId
        }
        console.log(data);

        this.apiService.deletePpaType(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted PPA Type' });
            this.fetchAllPpaTypes();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      }
    });
  }

  ppaMenu(event: Event, menu: any, ppaType: any){
    this.selectedPpaType = ppaType;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedPpaType = null;
    this.ppaTypeForm.reset();
  }
}

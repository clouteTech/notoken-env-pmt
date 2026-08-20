import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_WTG_TYPES: any[] = [
  { wtgTypeId: 1, wtgType: 'EN-141', isNearShore: false, status: true },
  { wtgTypeId: 2, wtgType: 'EN-156', isNearShore: true, status: true },
  { wtgTypeId: 3, wtgType: 'EN-132', isNearShore: false, status: true },
  { wtgTypeId: 4, wtgType: 'EN-158', isNearShore: true, status: false },
  { wtgTypeId: 5, wtgType: 'EN-176', isNearShore: true, status: true },
  { wtgTypeId: 6, wtgType: 'EN-120', isNearShore: false, status: true },
  { wtgTypeId: 7, wtgType: 'EN-148', isNearShore: false, status: false },
  { wtgTypeId: 8, wtgType: 'EN-165', isNearShore: true, status: true },
  { wtgTypeId: 9, wtgType: 'EN-172', isNearShore: true, status: true },
  { wtgTypeId: 10, wtgType: 'EN-184', isNearShore: true, status: true },
];

@Component({
  selector: 'app-wtg-types',
  imports: [Shared],
  templateUrl: './wtg-types.html',
  styleUrl: './wtg-types.css',
})
export class WtgTypes implements OnInit {
  showWTGTypeModal = false;

  selectedWTGType: any;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  wtgTypeForm = this.fb.group({
    wtgTypeId: [0],
    wtgType: ['', [Validators.required, Validators.maxLength(10)]],
    isNearShore: [false],
    status: [false]
  })

  get wtgType(){
    return this.wtgTypeForm.get('wtgType');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllWTGTypes();
  }

  fetchAllWTGTypes(){
    try {
      this.apiService.fetchAllWTGTypes('').subscribe({
        next: val => {
          console.log(val);
          this.wtgTypeList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.wtgTypeList = MOCK_WTG_TYPES;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.wtgTypeList = MOCK_WTG_TYPES;
    }
  }

  submitWtgTypeForm(){
    try {
      if (this.wtgTypeForm.valid) {
        if (!this.selectedWTGType) { 
          const data = this.wtgTypeForm.value;
          console.log(data);
    
          this.apiService.createWTGTypes(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created WTG Type' });
              this.showWTGTypeModal = false;
              this.fetchAllWTGTypes();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.wtgTypeForm.value;
          console.log(data);
  
          this.apiService.updateWTGType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated WTG Type' });
              this.showWTGTypeModal = false;
              this.fetchAllWTGTypes();
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

  editWTGType(){
    try {
      this.showWTGTypeModal = true;
      this.wtgTypeForm.patchValue(this.selectedWTGType);
    } catch (error) {
      console.log(error);
    }
  }

  wtgTypeList = [
    {
      wtgTypeName: 'EN132',
      isNearShore: 'Yes',
    },
    {
      wtgTypeName: 'EN158',
      isNearShore: 'No',
    },
    {
      wtgTypeName: 'EN176',
      isNearShore: 'Yes',
    }
  ]

  nearShoreList = [
    {
      label: 'Yes',
      value: true
    },
    {
      label: 'No',
      value: false
    }
  ]

  openWtgTypeModal(){
    try {
      this.showWTGTypeModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editWTGType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteWTGType()
      }
    ]
  }

  deleteWTGType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete WTG Type`,
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
          wtgTypeId: this.selectedWTGType.wtgTypeId
        }

        console.log(data);

        this.apiService.deleteWTGType(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted WTG Type' });
            this.fetchAllWTGTypes();
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

  wtgTypeMenu(event: Event, menu: any, wtgTypes: any){
    this.selectedWTGType = wtgTypes;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedWTGType = null;
    this.wtgTypeForm.reset();
  }
}

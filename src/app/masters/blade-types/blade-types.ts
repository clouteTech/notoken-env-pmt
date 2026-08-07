import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-blade-types',
  imports: [Shared],
  templateUrl: './blade-types.html',
  styleUrl: './blade-types.css',
})
export class BladeTypes implements OnInit {
  showBladeTypeModal = false;

  actionName = 'Create';

  selectedBladeType: any;

  bladeTypeList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  bladeTypeForm = this.fb.group({
    bladeTypeId: [0],
    bladeType: ['', [Validators.required, Validators.maxLength(50)]],
    countPerWtg: [null, [Validators.required, Validators.min(1)]],
    status: [false]
  })

  get bladeType(){
    return this.bladeTypeForm.get('bladeType');
  }

  get countPerWtg(){
    return this.bladeTypeForm.get('countPerWtg');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllBladeTypes();
  }

  fetchAllBladeTypes(){
    try {
      this.apiService.fetchAllBladeTypes('').subscribe({
        next: val => {
          console.log(val);
          this.bladeTypeList = val.data;
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
    }
  }

  createBladeType(){
    try {
      if (this.bladeTypeForm.valid) {
        if (!this.selectedBladeType) {
          const data = this.bladeTypeForm.value;
          console.log(data);
    
          this.apiService.createBladeType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Blade Type' });
              this.showBladeTypeModal = false;
              this.fetchAllBladeTypes();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.bladeTypeForm.value;
          console.log(data);
  
          this.apiService.updateBladeType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Blade Type' });
              this.showBladeTypeModal = false;
              this.fetchAllBladeTypes();
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

  editBladeType(){
    try {
      this.showBladeTypeModal = true;
      this.actionName = 'Update';
      this.bladeTypeForm.patchValue(this.selectedBladeType);
    } catch (error) {
      console.log(error);
    }
  }

  openBladeTypeModal(){
    try {
      this.showBladeTypeModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editBladeType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteBladeType()
      }
    ]
  }

  bladeTypeMenu(event: Event, menu: any, bladeTypes: any){
    this.selectedBladeType = bladeTypes;

    this.items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editBladeType()
      },

      ...(bladeTypes.status ? [{
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteBladeType()
      }] : [])
    ];

    menu.toggle(event);
  }

  deleteBladeType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Blade Type`,
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
            bladeTypeId: this.selectedBladeType.bladeTypeId
          }

          console.log(data);

          this.apiService.deleteBladeType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Blade Type' });
              this.fetchAllBladeTypes();
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

  onDialogClose() {
    this.selectedBladeType = null;
    this.actionName = 'Create';
    this.bladeTypeForm.reset();
  }
}

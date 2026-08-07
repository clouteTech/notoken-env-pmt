import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-tower-types',
  imports: [Shared],
  templateUrl: './tower-types.html',
  styleUrl: './tower-types.css',
})
export class TowerTypes implements OnInit {
  showTowerTypeModal = false;

  items: MenuItem[] = [];

  selectedTowerType: any;

  actionName = 'Create';

  private fb = inject(FormBuilder);

  constructor(private apiService: Apiservice, 
    private messageService: MessageService, private confirmationService: ConfirmationService){} 

  towerTypeForm = this.fb.group({
    towerTypeId: [0],
    towerType: ['', [Validators.required, Validators.maxLength(50)]],
    sectionCount: [null, [Validators.required, Validators.min(1)]],
    status: [false]
  })

  get towerType(){
    return this.towerTypeForm.get('towerType');
  }

  get sectionCount(){
    return this.towerTypeForm.get('sectionCount');
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllTowerType();
  }

  fetchAllTowerType(){
    try {
      this.apiService.fetchAllTowerTypes('').subscribe({
        next: val => {
          console.log(val);
          this.towerTypeList = val.data;
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

  submitTowerTypeForm(){
    try {
      if (this.towerTypeForm.valid) {   
        if (!this.selectedTowerType) {     
          const data = this.towerTypeForm.value;
          console.log(data);
    
          this.apiService.createTowerType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Tower Type' });
              this.showTowerTypeModal = false;
              this.fetchAllTowerType();
            },
            error: err => {
              console.log(err);
    
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.towerTypeForm.value;
          console.log(data);
  
          this.apiService.updateTowerType(data).subscribe({
            next: val => {
              console.log(val);
  
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Tower Type' });
              this.showTowerTypeModal = false;
              this.fetchAllTowerType();
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

  editTowerType(){
    try {
      this.showTowerTypeModal = true;
      this.actionName = 'Update';
      this.towerTypeForm.patchValue(this.selectedTowerType);
    } catch (error) {
      console.log(error);
    }
  }

  towerTypeList = [
    {
      towerType: '120HH-474T',
      sectionCount: '5'
    },
    {
      towerType: '140HH-520T',
      sectionCount: '6'
    }
  ]

  openTowerTypeModal(){
    try {
      this.showTowerTypeModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editTowerType()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteTowerType()
      }
    ]
  }

  deleteTowerType(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Tower Type`,
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
            towerTypeId: this.selectedTowerType.towerTypeId
          }

          console.log(data);

          this.apiService.deleteTowerType(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Tower Type' });
              this.fetchAllTowerType();
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

  towerTypeMenu(event: Event, menu: any, towerTypes: any){
    this.selectedTowerType = towerTypes;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedTowerType = null;
    this.actionName = 'Create';
    this.towerTypeForm.reset();
  }
}

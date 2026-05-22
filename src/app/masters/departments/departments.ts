import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-departments',
  imports: [Shared],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  showDepartmentModal = false;

  selectedDepartment: any;

  departmentList: any[] = [];
  userGroupInfoList: any[] = [];
  departmentHeadList: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}
  
  departmentForm = this.fb.group({
    departmentId: [0],
    departmentName: [''],
    departmentHeadId: [0],
    userGroupId: [0],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllDepartments();
  }

  fetchAllDepartments(){
    try {
      this.apiService.fetchAllDepartments('').subscribe({
        next: val => {
          console.log(val);
          this.departmentList = val.data;
        },
        error: err => {
          console.log(err);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  fetchUserGroupInfo(){
    try {
      this.apiService.fetchUserGroupInfo('').subscribe({
        next: val => {
          console.log("user group info:", val);
          this.userGroupInfoList = val.data;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully fetched User Group' });
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

  selectedUserGroup(userGroupId: number){
    try {
      const data = {
        userGroupId: userGroupId
      }

      console.log(data);

      this.apiService.fetchUsersByUserGroup(data).subscribe({
        next: val => {
          console.log(val);
          this.departmentHeadList = val.data;
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

  submitDepartmentForm(){
    try {
      if (!this.selectedDepartment) {
        const data = this.departmentForm.value;
        console.log(data);

        this.apiService.createDepartments(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Department' });
            this.showDepartmentModal = false;
            this.fetchAllDepartments();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.departmentForm.value;
        console.log(data);

        this.apiService.updateDepartments(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Department' });
            this.showDepartmentModal = false;
            this.fetchAllDepartments();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  editDepartment(){
    try {
      this.showDepartmentModal = true;

      this.fetchUserGroupInfo();

      this.departmentForm.patchValue({
        departmentId: this.selectedDepartment.departmentId,
        departmentName: this.selectedDepartment.departmentName,
        departmentHeadId: this.selectedDepartment.departmentHead.userId,
        userGroupId: this.selectedDepartment.userGroupId,
        status: this.selectedDepartment.status
      });

      console.log("department form:", this.departmentForm.value);

      this.selectedUserGroup(this.selectedDepartment.userGroupId);
    } catch (error) {
      console.log(error);
    }
  }

  deleteDepartment(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Department`,
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
          departmentId: this.selectedDepartment.departmentId
        }

        console.log(data);

        this.apiService.deleteDepartments(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Department' });
            this.fetchAllDepartments();
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

  openDepartmentModal(){
    try {
      this.showDepartmentModal = true;
      this.fetchUserGroupInfo();
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editDepartment()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteDepartment()
      }
    ]
  }

  departmentMenu(event: Event, menu: any, department: any){
    this.selectedDepartment = department;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedDepartment = null;
    this.departmentForm.reset();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-company-users',
  imports: [Shared],
  templateUrl: './company-users.html',
  styleUrl: './company-users.css',
})
export class CompanyUsers implements OnInit {
  showCompanyUserModal = false;
  assignUserGroupModal = false;

  items: MenuItem[] = [];

  selectedCompanyUser: any;

  companyUserList: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  companyUserForm = this.fb.group({
    userId: [0],
    userName: [''],
    email: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllCompanyUser();
  }

  fetchAllCompanyUser(){
    try {
      const data = {
        search: null,
        status: null,
        page: 0,
        size: 10,
        sortBy: 'createdOn',
        sortDirection: 'asc'
      }

      console.log(data);

      this.apiService.fetchAllCompanyUsers(data).subscribe({
        next: val => {
          console.log(val);
          this.companyUserList = val.data.content;
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

  submitCompanyUserForm(){
    try {
      if (!this.selectedCompanyUser) {   
        const data = this.companyUserForm.value;
        console.log(data);
  
        this.apiService.createCompanyUsers(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Company User' });
            this.showCompanyUserModal = false;
            this.fetchAllCompanyUser();
          },
          error: err => {
            console.log(err);
  
            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.companyUserForm.value;
        console.log(data);

        this.apiService.updateCompanyUsers(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Company User' });
            this.showCompanyUserModal = false;
            this.fetchAllCompanyUser();
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

  assignUserGroups(){
    try {
      this.assignUserGroupModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  editCompanyUser(){
    try {
      this.showCompanyUserModal = true;
      this.companyUserForm.patchValue(this.selectedCompanyUser);
    } catch (error) {
      console.log(error);
    }
  }

  deleteCompanyUser(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Company User`,
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
          userId: this.selectedCompanyUser.userId
        }

        console.log(data);

        this.apiService.deleteCompanyUsers(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Company User' });
            this.fetchAllCompanyUser();
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

  openCompanyUserModal(){
    try {
      this.showCompanyUserModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign',
        icon: 'pi pi-user-plus',
        command: () => this.assignUserGroups()
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCompanyUser()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCompanyUser()
      }
    ]
  }

  companyUserMenu(event: Event, menu: any, companyUser: any){
    this.selectedCompanyUser = companyUser;
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedCompanyUser = null;
    this.companyUserForm.reset();
  }
}

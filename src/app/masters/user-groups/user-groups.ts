import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-user-groups',
  imports: [Shared],
  templateUrl: './user-groups.html',
  styleUrl: './user-groups.css',
})
export class UserGroups implements OnInit {
  showUserGroupModal = false;

  items: MenuItem[] = [];

  userGroupList: any[] = [];

  selectedUsergroup: any;

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  userGroupForm = this.fb.group({
    userGroupId: [0],
    groupName: [''],
    description: [''],
    status: [false]
  })
    
  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllUserGroups();
  }

  fetchAllUserGroups(){
    try {
      const data = {
        search: null,
        status: null,
        isDefault: null,
        page: 0,
        size: 10,
        sortBy: 'createdOn',
        sortDirection: 'asc'
      }

      console.log(data);

      this.apiService.fetchAllUserGroups(data).subscribe({
        next: val => {
          console.log(val);
          this.userGroupList = val.data.content;
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

  submitUserGroupForm(){
    try {
      if (!this.selectedUsergroup) {
        const data = this.userGroupForm.value;
        console.log(data);

        this.apiService.createUserGroup(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created User Group' });
            this.showUserGroupModal = false;
            this.fetchAllUserGroups();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.userGroupForm.value;
        console.log(data);

        this.apiService.updateUserGroup(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated User Group' });
            this.showUserGroupModal = false;
            this.fetchAllUserGroups();
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

  editUserGroup(){
    try {
      this.showUserGroupModal = true;
      this.userGroupForm.patchValue(this.selectedUsergroup);
    } catch (error) {
      console.log(error);
    }
  }

  deleteUserGroup(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete User Group`,
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
            userGroupId: this.selectedUsergroup.userGroupId
          }

          console.log(data);

          this.apiService.deleteUserGroup(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted User Group' });
              this.fetchAllUserGroups();
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

  openUserGroupModal(){
    try {
      this.showUserGroupModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editUserGroup()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteUserGroup()
      }
    ]
  }

  usergroupMenu(event: Event, menu: any, usergroup: any){
    this.selectedUsergroup = usergroup;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedUsergroup = null;
    this.userGroupForm.reset();
  }
}

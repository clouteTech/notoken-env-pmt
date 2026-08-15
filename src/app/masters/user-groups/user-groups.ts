import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  showRoleModal = false;

  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  items: MenuItem[] = [];

  userGroupList: any[] = [];
  roleInfoList: any[] = [];
  assignedRoles: any[] = [];
  roleSearchQuery = '';
  roleModalLoading = false;

  selectedUsergroup: any;

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  userGroupForm = this.fb.group({
    userGroupId: [0],
    groupName: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(255)],
    status: [false]
  })

  get groupName(){
    return this.userGroupForm.get('groupName');
  }

  get description(){
    return this.userGroupForm.get('description');
  }
    
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

          this.totalRecords = val.data.totalElements ?? 0;
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
      if(this.userGroupForm.valid){
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
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
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

  isRoleAssigned(roleId: number): boolean{
    return this.assignedRoles.some(
      role => role.roleId === roleId
    );
  }

  toggleRole(role: any){
    if (this.isRoleAssigned(role.roleId)) {
      this.removeRole(role);
    } else {
      this.assignRole(role);
    }
  }

  getRoleMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedRoles(){
    const query = this.roleSearchQuery.trim().toLowerCase();
    return this.roleInfoList.filter(r =>
      this.isRoleAssigned(r.roleId) &&
      (!query || r.roleKey?.toLowerCase().includes(query) || r.description?.toLowerCase().includes(query))
    );
  }

  filteredAvailableRoles(){
    const query = this.roleSearchQuery.trim().toLowerCase();
    return this.roleInfoList.filter(r =>
      !this.isRoleAssigned(r.roleId) &&
      (!query || r.roleKey?.toLowerCase().includes(query) || r.description?.toLowerCase().includes(query))
    );
  }

  assignRole(role: any){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId,
        roleId: role.roleId
      }

      console.log(data);

      this.apiService.assignRolesToUsergroup(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Assigned Successfully' });
          this.fetchUsergroup();
          this.fetchAllUserGroups();
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeRole(role: any){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId,
        roleId: role.roleId
      }

      console.log(data);

      this.apiService.removeRolesToUsergroup(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Removed Successfully' });
          this.fetchUsergroup();
          this.fetchAllUserGroups();
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchRoleInfo(){
    try {
      this.roleModalLoading = true;
      this.apiService.fetchRoleInfo('').subscribe({
        next: val => {
          console.log(val);
          this.roleInfoList = val.data;
          this.roleModalLoading = false;
        },
        error: err => {
          console.log(err);
          this.roleModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.roleModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchUsergroup(){
    try {
      const data = {
        userGroupId: this.selectedUsergroup.userGroupId
      }

      console.log(data);

      this.apiService.fetchUserGroup(data).subscribe({
        next: val => {
          console.log(val);
          this.assignedRoles = val.data.roles ?? [];
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openRoleModal(){
    try {
      this.showRoleModal = true;
      this.roleSearchQuery = '';
      this.fetchRoleInfo();
      this.fetchUsergroup();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
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
        label: 'Assign/Remove Role',
        icon: 'pi pi-user-plus',
        command: () => this.openRoleModal(),
      },
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

  loadUser(event: any) {
    console.log(event);
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllUserGroups();
  }
}

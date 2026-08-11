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
  showPlantMappingModal = false;
  showClusterModal = false;
  showDepartmentModal = false;
  showComponentModal = false;

  items: MenuItem[] = [];

  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  selectedCompanyUser: any;

  companyUserList: any[] = [];
  userGroupList:any[] = [];
  assignedUserGroups: any[] = [];
  userGroupSearchQuery = '';
  userGroupModalLoading = false;
  plantInfoList: any[] = [];
  assignedPlant: any | null = null;
  clusterInfoList: any[] = [];
  departmentInfoList: any[] = [];
  assignedActiveClusters: any[] = [];
  assignedActiveDepartments: any[] = [];
  componentList: any[] = [];
  assignedActiveComponents: any[] = [];
  plantSearchQuery = '';
  plantModalLoading = false;
  clusterSearchQuery = '';
  clusterModalLoading = false;
  departmentSearchQuery = '';
  departmentModalLoading = false;
  componentSearchQuery = '';
  componentModalLoading = false;

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
        page: this.page,
        size: this.size,
        sortBy: 'createdOn',
        sortDirection: 'asc'
      }

      console.log(data);

      this.apiService.fetchAllCompanyUsers(data).subscribe({
        next: val => {
          console.log(val);
          this.companyUserList = val.data.content;
          this.totalRecords = val.data.totalElements;
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

  isUserGroupAssigned(userGroupId: number): boolean{
    return this.assignedUserGroups.some(
      group => group.userGroupId === userGroupId
    )
  }

  toggleUserGroup(usergroup: any){
    if (this.isUserGroupAssigned(usergroup.userGroupId)) {
      this.removeUserGroups(usergroup);
    } else {
      this.assignUserGroups(usergroup);
    }
  }

  getUserGroupInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedUserGroups(){
    const query = this.userGroupSearchQuery.trim().toLowerCase();
    return this.userGroupList.filter(g =>
      this.isUserGroupAssigned(g.userGroupId) &&
      (!query || g.groupName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableUserGroups(){
    const query = this.userGroupSearchQuery.trim().toLowerCase();
    return this.userGroupList.filter(g =>
      !this.isUserGroupAssigned(g.userGroupId) &&
      (!query || g.groupName?.toLowerCase().includes(query))
    );
  }

  isPlantAssigned(plantId: number): boolean {
    return this.assignedPlant?.plantId === plantId;
  }

  isAssignDisabled(plantId: number): boolean {
    return this.assignedPlant !== null &&
          this.assignedPlant?.plantId !== plantId;
  }

  togglePlant(plant: any){
    try {
      if (this.isPlantAssigned(plant.id)) {
        this.removePlantFromUser(plant);
      } else {
        this.assignPlantToUser(plant);
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAvailablePlants(){
    const query = this.plantSearchQuery.trim().toLowerCase();
    return this.plantInfoList.filter(p =>
      !this.isPlantAssigned(p.id) &&
      (!query || p.plant?.toLowerCase().includes(query))
    );
  }

  getPlantHint(plant: any): string {
    return [plant?.location, plant?.plantManager].filter(v => v).join(' · ');
  }

  isClusterAssigned(clusterId: number){
    return this.assignedActiveClusters.some(
      cluster => cluster.clusterId === clusterId
    )
  }

  toggleCluster(cluster: any){
    try {
      if (this.isClusterAssigned(cluster.clusterId)) {
        this.removeClustersFromUser(cluster);
      } else {
        this.assignClustersToUser(cluster);
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedClusters(){
    const query = this.clusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  filteredAvailableClusters(){
    const query = this.clusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      !this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  fetchActiveClustersFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }
      console.log(data);

      this.apiService.fetchActiveClustersFromUser(data).subscribe({
        next: val => {
          console.log("assignedActiveClusters", val);
          this.assignedActiveClusters = val.data;
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

  assignClustersToUser(cluster: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        clusterId: cluster.clusterId
      }
      console.log(data);

      this.apiService.assignClustersToUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Assigned Successfully' });
          this.fetchActiveClustersFromUser();
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

  removeClustersFromUser(cluster: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        clusterId: cluster.clusterId
      }
      console.log(data);

      this.apiService.removeClustersFromUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Removed Successfully' });
          this.fetchActiveClustersFromUser();
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

  isDepartmentAssigned(departmentId: number){
    return this.assignedActiveDepartments.some(
      department => department.departmentId === departmentId
    )
  }

  toggleDepartment(department: any){
    try {
      if (this.isDepartmentAssigned(department.departmentId)) {
        this.removeDepartmentsFromUser(department);
      } else {
        this.assignDepartmentsToUser(department);
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedDepartments(){
    const query = this.departmentSearchQuery.trim().toLowerCase();
    return this.departmentInfoList.filter(d =>
      this.isDepartmentAssigned(d.departmentId) &&
      (!query || d.departmentName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableDepartments(){
    const query = this.departmentSearchQuery.trim().toLowerCase();
    return this.departmentInfoList.filter(d =>
      !this.isDepartmentAssigned(d.departmentId) &&
      (!query || d.departmentName?.toLowerCase().includes(query))
    );
  }

  fetchActiveDepartmentsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }
      console.log(data);

      this.apiService.fetchActiveDepartmentsFromUser(data).subscribe({
        next: val => {
          console.log("assignedActiveDepartments", val);
          this.assignedActiveDepartments = val.data;
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

  assignDepartmentsToUser(department: any){
     try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        departmentId: department.departmentId
      }
      console.log(data);

      this.apiService.assignDepartmentsToUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department Assigned Successfully' });
          this.fetchActiveDepartmentsFromUser();
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

  removeDepartmentsFromUser(department: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        departmentId: department.departmentId
      }
      console.log(data);

      this.apiService.removeDepartmentsFromUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department Removed Successfully' });
          this.fetchActiveDepartmentsFromUser();
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

  isComponentAssigned(componentId: number){
    return this.assignedActiveComponents.some(
      component => component.componentId === componentId
    )
  }

  toggleComponent(component: any){
    try {
      if (this.isComponentAssigned(component.componentId)) {
        this.removeComponentsFromUser(component);
      } else {
        this.assignComponentsToUser(component);
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  filteredAssignedComponents(){
    const query = this.componentSearchQuery.trim().toLowerCase();
    return this.componentList.filter(c =>
      this.isComponentAssigned(c.componentId) &&
      (!query || c.componentName?.toLowerCase().includes(query))
    );
  }

  filteredAvailableComponents(){
    const query = this.componentSearchQuery.trim().toLowerCase();
    return this.componentList.filter(c =>
      !this.isComponentAssigned(c.componentId) &&
      (!query || c.componentName?.toLowerCase().includes(query))
    );
  }

  fetchActiveComponentsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }
      console.log(data);

      this.apiService.fetchActiveComponentsFromUser(data).subscribe({
        next: val => {
          console.log("assignedActiveComponents", val);
          this.assignedActiveComponents = val.data;
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


  assignComponentsToUser(component: any){
     try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        componentId: component.componentId
      }
      console.log(data);

      this.apiService.assignComponentsToUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Component Assigned Successfully' });
          this.fetchActiveComponentsFromUser();
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

  removeComponentsFromUser(component: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        componentId: component.componentId
      }
      console.log(data);

      this.apiService.removeComponentsFromUser(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Component Removed Successfully' });
          this.fetchActiveComponentsFromUser();
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

  fetchUserGroupInfo(){
    try {
      this.userGroupModalLoading = true;
      this.apiService.userGroupInfo('')
      .subscribe({
        next:val=>{
          console.log(val);
          this.userGroupList = val.data;
          this.userGroupModalLoading = false;
        },error:(err)=>{
          console.log(err);
          this.userGroupModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.userGroupModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchCompanyUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }
      console.log(data);

      this.apiService.fetchCompanyUser(data).subscribe({
        next: val => {
          console.log(val);
          this.assignedUserGroups = val.data?.userGroups ?? [];

          console.log('Assigned Groups:', this.assignedUserGroups);
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

  fetchPlantInfo(){
    try {
      this.plantModalLoading = true;
      this.apiService.fetchPlantInfo('').subscribe({
        next: val => {
          console.log("plantInfoList", val);
          this.plantInfoList = val.data;
          this.plantModalLoading = false;
        },
        error: err => {
          console.log(err);
          this.plantModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.plantModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignPlantToUser(plant: any){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId,
        plantId: plant.id
      }

      console.log(data);

      this.apiService.assignPlantToUser(data).subscribe({
        next: val => {
          console.log("Plant Assigned Successfully:", val);   
          this.assignedPlant = plant.id;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Assigned Successfully' });
          this.fetchActivePlantsFromUser();
          // this.showPlantMappingModal = false;
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

  removePlantFromUser(plant: any){
    this.confirmationService.confirm({
      message: 'Do you want to remove this plant?',
      header: 'Remove Plant',
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
        try {
          const data = {
            userId: this.selectedCompanyUser.userId,
            plantId: plant.id
          }

          console.log(data);

          this.apiService.removePlantFromUser(data).subscribe({
            next: val => {
              console.log("Plant Removed Successfully:", val);
              this.assignedPlant = null;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plant Removed Successfully' });
              this.fetchActivePlantsFromUser();
              // this.showPlantMappingModal = false;
            },
            error: err => {
              console.log(err);

              // if (err.status === 400) {
              //   this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              // }

              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.data });
              }
            }
          })
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      }
    });
  }

  fetchActivePlantsFromUser(){
    try {
      const data = {
        userId: this.selectedCompanyUser.userId
      }

      console.log(data);

      this.apiService.fetchActivePlantsFromUser(data).subscribe({
        next: val => {
          console.log(val);
          console.log('ACTIVE PLANTS:', val.data);

          const list = val.data ?? [];
          this.assignedPlant = list.length ? list[0] : null;

          console.log('UPDATED assignedPlant:', this.assignedPlant);
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

  openAssignUserGroupsModal(){
    try {
      this.assignUserGroupModal = true;
      this.userGroupSearchQuery = '';

      this.fetchUserGroupInfo();
      this.fetchCompanyUser();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openPlantMappingModal(){
    try {
      this.showPlantMappingModal = true;
      this.plantSearchQuery = '';
      this.fetchPlantInfo();
      this.fetchCompanyUser();
      this.fetchActivePlantsFromUser();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
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

  assignUserGroups(usergroup: any){
    try{
      console.log(usergroup);

      const data = {
        userId: this.selectedCompanyUser.userId,
        userGroupId: usergroup?.userGroupId
      }

      console.log(data);

      this.apiService.assignGroup(data)
      .subscribe({
        next:(val)=>{
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Group Assigned Successfully' });
          this.fetchCompanyUser();
          this.fetchAllCompanyUser();
        },error:(err)=>{
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

  removeUserGroups(usergroup: any){
    try {
      console.log(usergroup);

      const data = {
        userId: this.selectedCompanyUser.userId,
        userGroupId: usergroup?.userGroupId
      }

      console.log(data);
      
      this.apiService.removeUserGroup(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Group Removed Successfully' });
          this.fetchCompanyUser();
          this.fetchAllCompanyUser();
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

  fetchClusterInfo(){
    try {
      this.clusterModalLoading = true;
      this.apiService.fetchClusterInfo('').subscribe({
        next: val => {
          console.log(val);
          this.clusterInfoList = val.data;
          this.clusterModalLoading = false;
        },
        error: err => {
          this.clusterModalLoading = false;
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.clusterModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchDepartmentInfo(){
    try {
      this.departmentModalLoading = true;
      this.apiService.fetchDepartmentInfo('').subscribe({
        next: val => {
          console.log(val);
          this.departmentInfoList = val.data;
          this.departmentModalLoading = false;
        },
        error: err => {
          this.departmentModalLoading = false;
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.departmentModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchAllComponents(){
    try {
      this.componentModalLoading = true;
      this.apiService.fetchAllComponents('').subscribe({
        next: val => {
          console.log(val);
          this.componentList = val.data;
          this.componentModalLoading = false;
        },
        error: err => {
          console.log(err);
          this.componentModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.componentModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  deleteCompanyUser(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete ${this.selectedCompanyUser?.userName}`,
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

  openClusterMappingModal(){
    try {
      this.showClusterModal = true;
      this.clusterSearchQuery = '';
      this.fetchClusterInfo();
      this.fetchActiveClustersFromUser();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openDepartmentMappingModal(){
    try {
      this.showDepartmentModal = true;
      this.departmentSearchQuery = '';
      this.fetchDepartmentInfo();
      this.fetchActiveDepartmentsFromUser();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openComponentMappingModel(){
    try {
      this.showComponentModal = true;
      this.componentSearchQuery = '';
      this.fetchAllComponents();
      this.fetchActiveComponentsFromUser();
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove User Group',
        icon: 'pi pi-user-plus',
        command: () => this.openAssignUserGroupsModal(),
      },
      {
        label: 'Assign/Remove Plant',
        icon: 'pi pi-user-plus',
        command: () => this.openPlantMappingModal(),
      },
      {
        label: 'Assign/Remove Department',
        icon: 'pi pi-user-plus',
        command: () => this.openDepartmentMappingModal(),
      },
      {
        label: 'Assign/Remove Cluster',
        icon: 'pi pi-user-plus',
        command: () => this.openClusterMappingModal(),
      },
      {
        label: 'Assign/Remove Component',
        icon: 'pi pi-user-plus',
        command: () => this.openComponentMappingModel(),
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
    console.log(this.selectedCompanyUser);
    menu.toggle(event);
  }

  onDialogClose() {
    this.selectedCompanyUser = null;
    this.companyUserForm.reset();
    // this.assignedPlant = null;
  }

  loadUser(event: any) {
    console.log(event);
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllCompanyUser();
  }
}

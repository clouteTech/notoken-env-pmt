import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  showClusterModal = false;

  selectedClusterHeadId: { [clusterId: number]: number } = {};

  selectedDepartment: any;

  departmentList: any[] = [];
  userList: any[] = [];
  clusterInfoList: any[] = [];

  assignedClusters: any[] = [];
  deptClusterSearchQuery = '';
  deptClusterModalLoading = false;

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}
  
  departmentForm = this.fb.group({
    departmentId: [0],
    departmentName: ['', [Validators.required, Validators.maxLength(20)]],
    departmentHeadId: [0],
    status: [false]
  })

  get departmentName(){
    return this.departmentForm.get('departmentName')
  }

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllDepartments();
  }

  fetchAllDepartments(){
    try {
      this.apiService.fetchAllDepartments('').subscribe({
        next: val => {
          this.departmentList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchUsersByUserGroup(data: any){
    try {
      this.apiService.fetchUsersByUserGroup(data).subscribe({
        next: val => {
          this.userList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }


  fetchDepartmentHead(){
    try {
      const data = {
        userGroupId: 4
      }

      this.fetchUsersByUserGroup(data);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchClusterHead(){
    try {
      const data = {
        userGroupId: 6
      }

      this.fetchUsersByUserGroup(data);
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  submitDepartmentForm(){
    try {
      if (this.departmentForm.valid) {   
        if (!this.selectedDepartment) {
          const data = this.departmentForm.value;
  
          this.apiService.createDepartments(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Department' });
              this.showDepartmentModal = false;
              this.fetchAllDepartments();
            },
            error: err => {
              if (err.status === 400) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
              }
            }
          })
        } else {
          const data = this.departmentForm.value;
  
          this.apiService.updateDepartments(data).subscribe({
            next: val => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Department' });
              this.showDepartmentModal = false;
              this.fetchAllDepartments();
            },
            error: err => {
  
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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  editDepartment(){
    try {
      this.showDepartmentModal = true;

      this.departmentForm.patchValue({
        departmentId: this.selectedDepartment.departmentId,
        departmentName: this.selectedDepartment.departmentName,
        departmentHeadId: this.selectedDepartment.departmentHead.userId,
        status: this.selectedDepartment.status
      });

      this.fetchDepartmentHead();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  isClusterAssigned(clusterId: number): boolean{
    return this.assignedClusters.some(
      cluster => cluster.clusterId === clusterId
    )
  }

  toggleCluster(cluster: any){
    if (this.isClusterAssigned(cluster.clusterId)) {
      this.removeClustersFromDepartment(cluster);
    }else{
      this.assignClustersToDepartment(cluster);
    }
  }

  getDeptMappingInitials(name: string | null | undefined): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
    return initials.toUpperCase();
  }

  filteredAssignedClusters(){
    const query = this.deptClusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  filteredAvailableClusters(){
    const query = this.deptClusterSearchQuery.trim().toLowerCase();
    return this.clusterInfoList.filter(c =>
      !this.isClusterAssigned(c.clusterId) &&
      (!query || c.clusterName?.toLowerCase().includes(query) || c.clusterCode?.toLowerCase().includes(query))
    );
  }

  fetchClusterInfo(){
    try {
      this.deptClusterModalLoading = true;
      this.apiService.fetchClusterInfo('').subscribe({
        next: val => {
          this.clusterInfoList = val.data;
          this.deptClusterModalLoading = false;
        },
        error: err => {
          this.deptClusterModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.deptClusterModalLoading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchDepartmentById(){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId
      }

      this.apiService.fetchDepartmentById(data).subscribe({
        next: val => {
          this.assignedClusters = val.data.clusters;

          this.assignedClusters.forEach((cluster: any) => {
            this.selectedClusterHeadId[cluster.clusterId] = cluster.clusterHeadId;
          });
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  assignClustersToDepartment(cluster: any){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId,
        clusterId: cluster.clusterId,
        clusterHeadId: this.selectedClusterHeadId[cluster.clusterId]
      }

      this.apiService.assignClustersToDepartment(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Assigned Successfully' });
          this.fetchDepartmentById();
          this.fetchAllDepartments();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  removeClustersFromDepartment(cluster: any){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId,
        clusterId: cluster.clusterId
      }
      this.apiService.removeClustersFromDepartment(data).subscribe({
        next: val => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Removed Successfully' });
          this.fetchDepartmentById();
          this.fetchAllDepartments();
        },
        error: err => {

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  selectedClusterHead(clusterId: number, userId: number){
    try {
      this.selectedClusterHeadId[clusterId] = userId;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openClusterModal(){
    try {
      this.showClusterModal = true;
      this.deptClusterSearchQuery = '';
      this.fetchClusterInfo();
      this.fetchClusterHead();
      this.fetchDepartmentById();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
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

        this.apiService.deleteDepartments(data).subscribe({
          next: val => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Department' });
            this.fetchAllDepartments();
          },
          error: err => {

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
      this.fetchDepartmentHead();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Assign/Remove Cluster',
        icon: 'pi pi-user-plus',
        command: () => this.openClusterModal()
      },
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
    this.selectedClusterHeadId = {};
  }
}

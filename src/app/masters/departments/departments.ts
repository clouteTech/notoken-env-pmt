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
  showClusterModal = false;

  selectedClusterHeadId: { [clusterId: number]: number } = {};

  selectedDepartment: any;

  departmentList: any[] = [];
  userList: any[] = [];
  clusterInfoList: any[] = [];

  assignedClusters: any[] = [];

  items: MenuItem[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}
  
  departmentForm = this.fb.group({
    departmentId: [0],
    departmentName: [''],
    departmentHeadId: [0],
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

  fetchUsersByUserGroup(data: any){
    try {
      this.apiService.fetchUsersByUserGroup(data).subscribe({
        next: val => {
          console.log(val);
          this.userList = val.data;
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


  fetchDepartmentHead(){
    try {
      const data = {
        userGroupId: 4
      }

      console.log(data);

      this.fetchUsersByUserGroup(data);
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchClusterHead(){
    try {
      const data = {
        userGroupId: 6
      }
      console.log(data);

      this.fetchUsersByUserGroup(data);
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
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

      this.departmentForm.patchValue({
        departmentId: this.selectedDepartment.departmentId,
        departmentName: this.selectedDepartment.departmentName,
        departmentHeadId: this.selectedDepartment.departmentHead.userId,
        status: this.selectedDepartment.status
      });

      console.log("department form:", this.departmentForm.value);

      this.fetchDepartmentHead();
    } catch (error) {
      console.log(error);
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

  fetchClusterInfo(){
    try {
      this.apiService.fetchClusterInfo('').subscribe({
        next: val => {
          console.log(val);
          this.clusterInfoList = val.data;
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

  fetchDepartmentById(){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId
      }

      console.log(data);

      this.apiService.fetchDepartmentById(data).subscribe({
        next: val => {
          console.log(val);
          this.assignedClusters = val.data.clusters;

          this.assignedClusters.forEach((cluster: any) => {
            this.selectedClusterHeadId[cluster.clusterId] = cluster.clusterHeadId;
          });

          console.log('Selected Cluster Heads:', this.selectedClusterHeadId);
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

  assignClustersToDepartment(cluster: any){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId,
        clusterId: cluster.clusterId,
        clusterHeadId: this.selectedClusterHeadId[cluster.clusterId]
      }

      console.log(data);

      this.apiService.assignClustersToDepartment(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Assigned Successfully' });
          this.fetchDepartmentById();
          this.fetchAllDepartments();
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

  removeClustersFromDepartment(cluster: any){
    try {
      const data = {
        departmentId: this.selectedDepartment.departmentId,
        clusterId: cluster.clusterId
      }

      console.log(data);

      this.apiService.removeClustersFromDepartment(data).subscribe({
        next: val => {
          console.log(val);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cluster Removed Successfully' });
          this.fetchDepartmentById();
          this.fetchAllDepartments();
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

  selectedClusterHead(clusterId: number, userId: number){
    try {
      this.selectedClusterHeadId[clusterId] = userId;
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openClusterModal(){
    try {
      this.showClusterModal = true;
      this.fetchClusterInfo();
      this.fetchClusterHead();
      this.fetchDepartmentById();
    } catch (error) {
      console.log(error);
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
      this.fetchDepartmentHead();
    } catch (error) {
      console.log(error);
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

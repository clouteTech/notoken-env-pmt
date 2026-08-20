import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_DEPARTMENTS: any[] = [
  { departmentId: 1, departmentName: 'Blade Manufacturing', departmentHead: { userId: 101, userName: 'Rajesh Kumar' }, clusters: [{ clusterId: 1 }, { clusterId: 2 }], status: true },
  { departmentId: 2, departmentName: 'Nacelle Assembly', departmentHead: { userId: 102, userName: 'Priya Sharma' }, clusters: [{ clusterId: 3 }], status: true },
  { departmentId: 3, departmentName: 'Tower Fabrication', departmentHead: { userId: 103, userName: 'Anil Menon' }, clusters: [{ clusterId: 1 }], status: true },
  { departmentId: 4, departmentName: 'Quality Assurance', departmentHead: { userId: 104, userName: 'Sunita Rao' }, clusters: [], status: true },
  { departmentId: 5, departmentName: 'Logistics & Transport', departmentHead: { userId: 105, userName: 'Vikram Singh' }, clusters: [{ clusterId: 4 }, { clusterId: 5 }], status: false },
  { departmentId: 6, departmentName: 'Site Erection', departmentHead: { userId: 106, userName: 'Kiran Patel' }, clusters: [{ clusterId: 2 }], status: true },
  { departmentId: 7, departmentName: 'Grid Connectivity', departmentHead: { userId: 107, userName: 'Deepa Nair' }, clusters: [], status: true },
  { departmentId: 8, departmentName: 'Procurement', departmentHead: { userId: 108, userName: 'Manoj Verma' }, clusters: [{ clusterId: 3 }], status: false },
  { departmentId: 9, departmentName: 'Project Planning', departmentHead: { userId: 109, userName: 'Ritu Agarwal' }, clusters: [{ clusterId: 1 }, { clusterId: 5 }], status: true },
  { departmentId: 10, departmentName: 'HSE (Health, Safety & Environment)', departmentHead: { userId: 110, userName: 'Arjun Reddy' }, clusters: [], status: true },
];

const MOCK_USERS: any[] = [
  { user: { userId: 101, userName: 'Rajesh Kumar' } },
  { user: { userId: 102, userName: 'Priya Sharma' } },
  { user: { userId: 103, userName: 'Anil Menon' } },
  { user: { userId: 104, userName: 'Sunita Rao' } },
  { user: { userId: 105, userName: 'Vikram Singh' } },
  { user: { userId: 106, userName: 'Kiran Patel' } },
  { user: { userId: 107, userName: 'Deepa Nair' } },
  { user: { userId: 108, userName: 'Manoj Verma' } },
  { user: { userId: 109, userName: 'Ritu Agarwal' } },
  { user: { userId: 110, userName: 'Arjun Reddy' } },
];

const MOCK_CLUSTER_INFO: any[] = [
  { clusterId: 1, clusterCode: 'GJ', clusterName: 'Gujarat Cluster' },
  { clusterId: 2, clusterCode: 'TN', clusterName: 'Tamil Nadu Cluster' },
  { clusterId: 3, clusterCode: 'RJ', clusterName: 'Rajasthan Cluster' },
  { clusterId: 4, clusterCode: 'KA', clusterName: 'Karnataka Cluster' },
  { clusterId: 5, clusterCode: 'MH', clusterName: 'Maharashtra Cluster' },
  { clusterId: 6, clusterCode: 'AP', clusterName: 'Andhra Pradesh Cluster' },
  { clusterId: 7, clusterCode: 'MP', clusterName: 'Madhya Pradesh Cluster' },
  { clusterId: 8, clusterCode: 'TS', clusterName: 'Telangana Cluster' },
  { clusterId: 9, clusterCode: 'OD', clusterName: 'Odisha Cluster' },
  { clusterId: 10, clusterCode: 'UP', clusterName: 'Uttar Pradesh Cluster' },
];

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
          console.log(val);
          this.departmentList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.departmentList = MOCK_DEPARTMENTS;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.departmentList = MOCK_DEPARTMENTS;
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
          } else {
            this.userList = MOCK_USERS;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.userList = MOCK_USERS;
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
      if (this.departmentForm.valid) {   
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
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill All Required field' });
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
          console.log(val);
          this.clusterInfoList = val.data;
          this.deptClusterModalLoading = false;
        },
        error: err => {
          console.log(err);
          this.deptClusterModalLoading = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.clusterInfoList = MOCK_CLUSTER_INFO;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.deptClusterModalLoading = false;
      this.clusterInfoList = MOCK_CLUSTER_INFO;
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
      this.deptClusterSearchQuery = '';
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

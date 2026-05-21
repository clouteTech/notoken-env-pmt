import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-clusters',
  imports: [Shared],
  templateUrl: './clusters.html',
  styleUrl: './clusters.css',
})
export class Clusters implements OnInit {
  showClusterModal = false;

  selectedCluster: any;

  items: MenuItem[] = [];

  clusterList: any[] = [];

  private fb = inject(FormBuilder);

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  clusterForm = this.fb.group({
    clusterId: [''],
    clusterCode: [''],
    clusterName: [''],
    status: [false]
  })

  ngOnInit(): void {
    this.items = this.getMenuItems();
    this.fetchAllClusters();
  }

  fetchAllClusters(){
    try {
      this.apiService.fetchAllClusters('').subscribe({
        next: val => {
          console.log(val);
          this.clusterList = val.data;
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

  submitClusterForm(){
    try {
      if (!this.selectedCluster) {
        const data = this.clusterForm.value;
        console.log(data);

        this.apiService.createCluster(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Created Cluster' });
            this.showClusterModal = false;
            this.fetchAllClusters();
          },
          error: err => {
            console.log(err);

            if (err.status === 400) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
            }
          }
        })
      } else {
        const data = this.clusterForm.value;
        console.log(data);

        this.apiService.updateCluster(data).subscribe({
          next: val => {
            console.log(val);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Updated Cluster' });
            this.showClusterModal = false;
            this.fetchAllClusters();
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

  editCluster(){
    try {
      this.showClusterModal = true;
      this.clusterForm.patchValue(this.selectedCluster);
    } catch (error) {
      console.log(error);
    }
  }

  deleteCluster(){
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Delete Cluster`,
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
            clusterId: this.selectedCluster.clusterId
          }
          console.log(data);

          this.apiService.deleteCluster(data).subscribe({
            next: val => {
              console.log(val);
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted Cluster' });
              this.fetchAllClusters();
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

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editCluster()
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteCluster()
      }
    ]
  }

  openClusterModal(){
    try {
      this.showClusterModal = true
    } catch (error) {
      console.log(error);
    }
  }

  clusterMenu(event: Event, menu: any, cluster: any){
    this.selectedCluster = cluster;
    menu.toggle(event);
  }

  onDialogClose(){
    this.selectedCluster = null;
    this.clusterForm.reset();
  }
}

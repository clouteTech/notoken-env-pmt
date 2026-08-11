import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-roles',
  imports: [Shared],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {
  first = 0;

  rows = 10;

  roleList: any[] = [];

  constructor(private confirmationService: ConfirmationService, 
    private apiService: Apiservice, private messageService: MessageService){}

  ngOnInit(): void {
    this.fetchAllRoles();
  }

  fetchAllRoles(){
    try {
      const data = {
        search: null,
        resource: null,
        action: null,
        page: 0,
        size: 10
      }

      console.log(data);

      this.apiService.fetchAllRoles(data).subscribe({
        next: val => {
          console.log(val);
          this.roleList = val.data.content;
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

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}

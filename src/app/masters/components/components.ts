import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-components',
  imports: [Shared],
  templateUrl: './components.html',
  styleUrl: './components.css',
})
export class Components implements OnInit {
  componentList: any[] = [];
  
  constructor(private apiService: Apiservice, private messageService: MessageService){}

  ngOnInit(): void {
    this.fetchAllComponents();
  }

  fetchAllComponents(){
    try {
      this.apiService.fetchAllComponents('').subscribe({
        next: val => {
          console.log(val);
          this.componentList = val.data;
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
  // componentList = [
  //   {
  //     componentName: 'Topflange'
  //   },
  //   {
  //     componentName: 'Bottomflange'
  //   },
  //   {
  //     componentName: 'Blade'
  //   },
  //    {
  //     componentName: 'Nacelle'
  //   },
  //    {
  //     componentName: 'Hub'
  //   },
  //    {
  //     componentName: 'Tower'
  //   },
  //   {
  //     componentName: 'Converter Panel'
  //   },
  //   {
  //     componentName: 'Site Accessories'
  //   },
  //   {
  //     componentName: 'SCADA'
  //   },
  // ]
}

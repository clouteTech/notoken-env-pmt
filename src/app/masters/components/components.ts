import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Apiservice } from 'src/app/service/apiservice';
import { Shared } from 'src/app/shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_COMPONENTS: any[] = [
  { componentId: 1, componentName: 'Topflange' },
  { componentId: 2, componentName: 'Bottomflange' },
  { componentId: 3, componentName: 'Blade' },
  { componentId: 4, componentName: 'Nacelle' },
  { componentId: 5, componentName: 'Hub' },
  { componentId: 6, componentName: 'Tower' },
  { componentId: 7, componentName: 'Converter Panel' },
  { componentId: 8, componentName: 'Site Accessories' },
  { componentId: 9, componentName: 'SCADA' },
  { componentId: 10, componentName: 'Generator' },
];

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
          } else {
            this.componentList = MOCK_COMPONENTS;
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.componentList = MOCK_COMPONENTS;
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

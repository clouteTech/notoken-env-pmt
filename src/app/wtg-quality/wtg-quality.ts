import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { MenuItem, MessageService } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-wtg-quality',
  imports: [Shared],
  templateUrl: './wtg-quality.html',
  styleUrl: './wtg-quality.css',
})
export class WtgQuality implements OnInit {
  showQualDetailsModal = false;
  selectedQuality: any;
  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;

  items: MenuItem[] = [];

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService){}

  ngOnInit(): void {
      this.items = this.getMenuItems();
  }

  qualityList = [
    {
      pCode: 'P-8001',
      component: 'Nacelle',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-05',
      customerInspectionActual: '2026-04-06',
      customerInprogressInspection: '2026-04-04',
      mdccPlan: '2026-04-08',
      mdccActual: '2026-04-09'
    },
      {
      pCode: 'P-8002',
      component: 'Hub',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-06',
      customerInspectionActual: '2026-04-07',
      customerInprogressInspection: '2026-04-05',
      mdccPlan: '2026-04-09',
      mdccActual: '2026-04-10'
    },
    {
      pCode: 'P-8003',
      component: 'Blade',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-07',
      customerInspectionActual: '2026-04-08',
      customerInprogressInspection: '2026-04-06',
      mdccPlan: '2026-04-10',
      mdccActual: '2026-04-11'
    },
    {
      pCode: 'P-8004',
      component: 'Tower',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-08',
      customerInspectionActual: null,
      customerInprogressInspection: null,
      mdccPlan: '2026-04-11',
      mdccActual: null
    },
    {
      pCode: 'P-8005',
      component: 'Converter Panel',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-09',
      customerInspectionActual: '2026-04-10',
      customerInprogressInspection: '2026-04-08',
      mdccPlan: '2026-04-12',
      mdccActual: '2026-04-13'
    },
    {
      pCode: 'P-8006',
      component: 'Nacelle',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-10',
      customerInspectionActual: null,
      customerInprogressInspection: null,
      mdccPlan: '2026-04-13',
      mdccActual: null
    },
    {
      pCode: 'P-8007',
      component: 'Hub',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-11',
      customerInspectionActual: '2026-04-12',
      customerInprogressInspection: '2026-04-10',
      mdccPlan: '2026-04-14',
      mdccActual: '2026-04-15'
    },
    {
      pCode: 'P-8008',
      component: 'Blade',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-12',
      customerInspectionActual: '2026-04-13',
      customerInprogressInspection: '2026-04-11',
      mdccPlan: '2026-04-15',
      mdccActual: null
    },
    {
      pCode: 'P-8009',
      component: 'Tower',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-13',
      customerInspectionActual: '2026-04-14',
      customerInprogressInspection: '2026-04-12',
      mdccPlan: '2026-04-16',
      mdccActual: '2026-04-17'
    },
    {
      pCode: 'P-8010',
      component: 'Converter Panel',
      subComponent: 'Root Section',
      inspectionCallPlan: '2026-04-14',
      customerInspectionActual: null,
      customerInprogressInspection: null,
      mdccPlan: '2026-04-17',
      mdccActual: null
    }
  ]

  openQualityDetails(){
    try {
      this.showQualDetailsModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  exportQuality(){
    try {
      this.chooseDownloadTemplate = true;      
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  openImportDialog(){
    try {
      this.chooseUploadTemplate = true;      
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  downloadTemplate(){
    try {
      this.messageService.add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: 'Quality template download will be available soon.'
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  uploadTemplate(){
    try {
        this.messageService.add({
          severity: 'info',
          summary: 'Coming Soon',
          detail: 'Quality template upload will be available soon.'
        });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.openQualityDetails()
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportQuality()
      }
    ]
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  openMenu(menu: any, event: any, qual: any){
    this.selectedQuality = qual;
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}
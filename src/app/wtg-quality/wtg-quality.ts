import { Component, OnInit } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { MenuItem } from 'primeng/api';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-wtg-quality',
  imports: [Shared],
  templateUrl: './wtg-quality.html',
  styleUrl: './wtg-quality.css',
})
export class WtgQuality implements OnInit {
  showQualDetailsModal = false;

  items: MenuItem[] = [];

  constructor(private sanitizer: DomSanitizer){}

  ngOnInit(): void {
      this.items = this.getMenuItems();
  }

  qualityList = [
    {
      component: 'Nacelle',
      serialNumber: 'NAC-CHN-001',
      finalQcDate: '2026-04-02',
      projectCode: 'P-8001',
      inspectionCallPlan: '2026-04-05',
      customerInspectionActual: '2026-04-06',
      mdccPlan: '2026-04-08',
      mdccActual: '2026-04-09'
    },
      {
      slNo: 2,
      component: 'Hub',
      serialNumber: 'HUB-CHN-002',
      finalQcDate: '2026-04-03',
      projectCode: 'P-8002',
      inspectionCallPlan: '2026-04-06',
      customerInspectionActual: '2026-04-07',
      mdccPlan: '2026-04-09',
      mdccActual: '2026-04-10'
    },
    {
      slNo: 3,
      component: 'Blade',
      serialNumber: 'BLD-TRY-003',
      finalQcDate: '2026-04-04',
      projectCode: 'P-8003',
      inspectionCallPlan: '2026-04-07',
      customerInspectionActual: '2026-04-08',
      mdccPlan: '2026-04-10',
      mdccActual: '2026-04-11'
    },
    {
      slNo: 4,
      component: 'Tower',
      serialNumber: 'TWR-PUN-004',
      finalQcDate: '2026-04-05',
      projectCode: 'P-8004',
      inspectionCallPlan: '2026-04-08',
      customerInspectionActual: null,
      mdccPlan: '2026-04-11',
      mdccActual: null
    },
    {
      slNo: 5,
      component: 'Converter Panel',
      serialNumber: 'CNV-CHN-005',
      finalQcDate: '2026-04-06',
      projectCode: 'P-8005',
      inspectionCallPlan: '2026-04-09',
      customerInspectionActual: '2026-04-10',
      mdccPlan: '2026-04-12',
      mdccActual: '2026-04-13'
    },
    {
      slNo: 6,
      component: 'Nacelle',
      serialNumber: 'NAC-PUN-006',
      finalQcDate: '2026-04-07',
      projectCode: 'P-8006',
      inspectionCallPlan: '2026-04-10',
      customerInspectionActual: null,
      mdccPlan: '2026-04-13',
      mdccActual: null
    },
    {
      slNo: 7,
      component: 'Hub',
      serialNumber: 'HUB-TRY-007',
      finalQcDate: '2026-04-08',
      projectCode: 'P-8007',
      inspectionCallPlan: '2026-04-11',
      customerInspectionActual: '2026-04-12',
      mdccPlan: '2026-04-14',
      mdccActual: '2026-04-15'
    },
    {
      slNo: 8,
      component: 'Blade',
      serialNumber: 'BLD-CHN-008',
      finalQcDate: '2026-04-09',
      projectCode: 'P-8008',
      inspectionCallPlan: '2026-04-12',
      customerInspectionActual: '2026-04-13',
      mdccPlan: '2026-04-15',
      mdccActual: null
    },
    {
      slNo: 9,
      component: 'Tower',
      serialNumber: 'TWR-BLG-009',
      finalQcDate: '2026-04-10',
      projectCode: 'P-8009',
      inspectionCallPlan: '2026-04-13',
      customerInspectionActual: '2026-04-14',
      mdccPlan: '2026-04-16',
      mdccActual: '2026-04-17'
    },
    {
      slNo: 10,
      component: 'Converter Panel',
      serialNumber: 'CNV-KTC-010',
      finalQcDate: '2026-04-11',
      projectCode: 'P-8010',
      inspectionCallPlan: '2026-04-14',
      customerInspectionActual: null,
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

  getMenuItems(){
    return [
      {
        label: 'Edit',
        svgIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="currentColor" d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29a1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.2 1.2 0 0 0 .22-.33a1 1 0 0 0 0-.24a.7.7 0 0 0 0-.14ZM6.83 20H4v-2.83l9.93-9.93l2.83 2.83ZM18.17 8.66l-2.83-2.83l1.42-1.41l2.82 2.82Z" />
          </svg>
        `,
        command: () => this.openQualityDetails()
      }
    ]
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

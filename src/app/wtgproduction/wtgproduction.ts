import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { SelectModule }    from 'primeng/select';
import { DatePickerModule }from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MenuItem, MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuModule } from 'primeng/menu';
import { StepperModule } from 'primeng/stepper';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-wtgproduction',
  imports: [CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule,MenuModule,StepperModule,FloatLabelModule
  ],
  templateUrl: './wtgproduction.html',
  styleUrl: './wtgproduction.css',
})
export class WTGProduction {
showProductionModal = false;

  items: MenuItem[] = [];

  constructor(private sanitizer: DomSanitizer){}

  wtgProductionList = [
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-001',
      finalQC: '2026-03-05',
      status: 'DONE'
    },
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-002',
      finalQC: '2026-03-05',
      status: 'DONE'
    },
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-003',
      finalQC: '2026-03-08',
      status: 'DONE'
    },
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-004',
      finalQC: '2026-03-09',
      status: 'DONE'
    },
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-005',
      finalQC: '2026-03-10',
      status: 'DONE'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-006',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '2026-03-05',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '2026-03-06',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: 'B-007',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '2026-03-05',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '2026-03-06',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: 'B-008',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '2026-03-05',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '2026-03-06',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: 'B-009',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: 'P-8001',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-013',
      finalQC: '2026-03-12',
      status: 'DONE'
    },
    {
      pCode: 'P-8009',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-014',
      finalQC: '2026-03-14',
      status: 'DONE'
    },
    {
      pCode: 'P-8010',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-01',
      proActualStart: '2026-03-01',
      proForecastStart: '2026-03-01',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-02',
      proActualFinish: '2026-03-02',
      proForecastFinish: '2026-03-02',
      proFinishDelayReason: '-',
      serialNo: 'B-015',
      finalQC: '2026-03-15',
      status: 'DONE'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-016',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-017',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-03',
      proActualStart: '2026-03-03',
      proForecastStart: '2026-03-03',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-04',
      proActualFinish: '2026-03-04',
      proForecastFinish: '2026-03-04',
      proFinishDelayReason: '-',
      serialNo: 'B-018',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '2026-03-05',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '2026-03-06',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: 'B-019',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '2026-03-05',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '2026-03-06',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: 'B-020',
      finalQC: '-',
      status: 'IN_PROGRESS'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-05',
      proActualStart: '-',
      proForecastStart: '2026-03-05',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-06',
      proActualFinish: '-',
      proForecastFinish: '2026-03-06',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-07',
      proActualStart: '-',
      proForecastStart: '2026-03-07',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-08',
      proActualFinish: '-',
      proForecastFinish: '2026-03-08',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-09',
      proActualStart: '-',
      proForecastStart: '2026-03-09',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-10',
      proActualFinish: '-',
      proForecastFinish: '2026-03-10',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-09',
      proActualStart: '-',
      proForecastStart: '2026-03-09',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-10',
      proActualFinish: '-',
      proForecastFinish: '2026-03-10',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
    {
      pCode: '-',
      component: 'Blade',
      subComponent: 'Root Section',
      proPlanStart: '2026-03-09',
      proActualStart: '-',
      proForecastStart: '2026-03-09',
      proStartDelayReason: '-',
      proPlanFinish: '2026-03-10',
      proActualFinish: '-',
      proForecastFinish: '2026-03-10',
      proFinishDelayReason: '-',
      serialNo: '-',
      finalQC: '-',
      status: 'PLANNED'
    },
  ];

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  getMenuItems(){
    return [
      {
        label: 'Edit Production Details',
        svgIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="currentColor" d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29a1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.2 1.2 0 0 0 .22-.33a1 1 0 0 0 0-.24a.7.7 0 0 0 0-.14ZM6.83 20H4v-2.83l9.93-9.93l2.83 2.83ZM18.17 8.66l-2.83-2.83l1.42-1.41l2.82 2.82Z" />
          </svg>
        `,
        command: () => this.openProductionDetails()
      }
    ]
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  } 

  openProductionDetails(){
    try {
      this.showProductionModal = true;
    } catch (error) {
      console.log(error);
    }
  }
}
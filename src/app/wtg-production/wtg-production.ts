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
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtgproduction',
  imports: [CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule,MenuModule,StepperModule,FloatLabelModule,
    Shared
  ],
  templateUrl: './wtg-production.html',
  styleUrl: './wtg-production.css',
})
export class WTGProduction {
  showProductionModal = false;
  chooseUploadTemplate = false;
  chooseDownloadTemplate = false;

  selectedProduction: any;

  items: MenuItem[] = [];

  constructor(private sanitizer: DomSanitizer, private messageService: MessageService){}

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

  exportProduction(){
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

  getMenuItems(){
    return [
      {
        label: 'Edit Production Details',
        icon: 'pi pi-pencil',
        command: () => this.openProductionDetails()
      },
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportProduction()
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

  openMenu(menu: any, event: any, selectedProd: any){
    this.selectedProduction = selectedProd;
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}
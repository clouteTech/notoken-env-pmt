import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MenuItem, MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';

export interface CommWtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
}

export interface SummaryRow {
  projectCode: string;
  projectName: string;
  location: string;
  wtgCount: number;
}

@Component({
  selector: 'app-commisioning1',
 imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, DialogModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './commisioning1.html',
  styleUrl: './commisioning1.css',
})
export class Commisioning1 {
 pCode = 'P-8001';
  projectName = 'India_Renew1_Gadag_KA_300.3MW';
  wtgQty = 2;

  stepCompleted: boolean[] = [];
  wtgPopupActiveStep = 0;
  stepForms: FormGroup[][] = [];
  wtgRows: CommWtgRow[] = [];

  // Summary Table
  summaryRows: SummaryRow[] = [
    { projectCode: 'P-8001', projectName: 'India_Renew1_Gadag', location: 'ENV 1', wtgCount: 2 },
    { projectCode: 'P-8002', projectName: 'India_Renew2_Mysore', location: 'ENV 2', wtgCount: 5 },
    { projectCode: 'P-8003', projectName: 'India_Renew3_Tumkur', location: 'ENV 3', wtgCount: 3 },
  ];

  // Open WTG Popup
  wtgPopupVisible = false;
  chooseDownloadTemplate = false;
  chooseUploadTemplate = false;
  displayImportDialog = false;

  maxDate: Date | undefined;

  selectedSummaryRow: SummaryRow | null = null;

  items: MenuItem[] = [];

  projectList: any[] = [];

  // View All Data Popup
  viewVisible = false;

  selectedProject: any;
  selectedFile: any;

  steps = [
    { id: 1, label: 'PRE-COMMISSIONING', subLabel: 'Pre-Com, Bottom Comm, Nacelle, Hub & Sign Off' },
    { id: 2, label: 'COMMISSIONING', subLabel: 'USS/WTG Charge, Converter, Generation, COD & Certificate' },
    { id: 3, label: 'STPT', subLabel: 'Short-Term Performance Test' },
    { id: 4, label: 'HOTO', subLabel: 'Hand Over Take Over' }
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
    0: [
      { field: 'preComActual',           header: 'Pre-commissioning', type: 'date' },
      { field: 'bottomCommDate',         header: 'Bottom Commissioning',            type: 'date' },
      { field: 'nacelleCommDate',        header: 'Nacelle Commissioning',           type: 'date' },
      { field: 'hubCommDate',            header: 'Hub Commissioning',               type: 'date' },
      { field: 'signOffDate',            header: 'Sign Off',                   type: 'date' },
    ],
    1: [
      { field: 'commPlanDate',             header: 'Commissioning Plan',                   type: 'date' },
      { field: 'commActualDate',           header: 'Commissioning Actual',        type: 'date' },
      { field: 'commForecastDate',         header: 'Commissioning Forecast',        type: 'date' },
      { field: 'commDelayReason',          header: 'Commissioning Delay Reason',        type: 'text' },
      { field: 'ussChargeDate',            header: 'USS Charge',             type: 'date' },
      { field: 'wtgChargeDate',            header: 'WTG Charge',             type: 'date' },
      { field: 'converterTestDate',        header: 'Converter Test',         type: 'date' },
      { field: 'generationTrialDate',      header: 'Generation Trial',       type: 'date' },
      { field: 'realTimeValidationDate',   header: 'Real Time Validation',   type: 'date' },
      { field: 'mppcPpcDate',              header: 'MPPC / PPC',             type: 'date' },
      { field: 'codDate',                  header: 'COD',                    type: 'date' },
      { field: 'certSignOffDate',          header: 'Certificate Sign Off',   type: 'date' }
    ],
    2: [
      { field: 'stptPlanStart',    header: 'STPT Plan Start',     type: 'date' },
      { field: 'stptActualStart',      header: 'STPT Actual Start',       type: 'date' },
      { field: 'stptForecastStart',      header: 'STPT Forecast Start',       type: 'date' },
      { field: 'stptStartDelayReason',      header: 'STPT Start Delay Reason',       type: 'text' },
      { field: 'stptPlanFinish',      header: 'STPT Plan Finish',       type: 'date' },
      { field: 'stptActualFinish',      header: 'STPT Actual Finish',       type: 'date' },
      { field: 'stptForecastFinish',      header: 'STPT Forecast Finish',       type: 'date' },
      { field: 'stptFinishDelayReason',      header: 'STPT Finish Delay Reason',       type: 'text' },
      { field: 'stptSignOff',  header: 'STPT Sign Off',  type: 'date' },
    ],
    3: [
      { field: 'hotoPlanStart',    header: 'HOTO Plan Start',     type: 'date' },
      { field: 'hotoActualStart',    header: 'HOTO Actual Start',     type: 'date' },
      { field: 'hotoForecastStart',    header: 'HOTO Forecast Start',     type: 'date' },
      { field: 'hotoStartDelayReason',    header: 'HOTO Start Delay Reason',     type: 'text' },
      { field: 'hotoPlanFinish',   header: 'HOTO Plan Finish',    type: 'date' },
      { field: 'hotoActualFinish',   header: 'HOTO Actual Finish',    type: 'date' },
      { field: 'hotoForecastFinish',   header: 'HOTO Forecast Finish',    type: 'date' },
      { field: 'hotoFinishDelayReason',   header: 'HOTO Finish Delay Reason',    type: 'text' },
      { field: 'hotoSignOff',  header: 'HOTO Sign Off',  type: 'date' }
    ],
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private apiService: Apiservice
  ) {}

  ngOnInit() {
    this.stepCompleted = new Array(this.steps.length).fill(false);

    const maxWtg = Math.max(this.wtgQty, ...this.summaryRows.map(r => r.wtgCount));
    for (let i = 1; i <= maxWtg; i++) {
      this.wtgRows.push({
        wtgId: `WTG-${String(i).padStart(2, '0')}`,
        locationNo: `LOC-${String(i).padStart(2, '0')}`,
        maximoId: `MAX-${String(i).padStart(3, '0')}`
      });
    }

    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      const rowForms: FormGroup[] = this.wtgRows.map(() => {
        const group: any = {};
        cols.forEach(col => { group[col.field] = [null]; });
        return this.fb.group(group);
      });
      this.stepForms.push(rowForms);
    }

    this.items = this.getMenuItems();
    this.getProjectList();

    const today = new Date();
    this.maxDate = new Date(today);
  }

  getProjectList(){
    try {
      let data = {
        "search": null,
        "customerId": null,
        "clusterId": null,
        "zoneId": null,
        "projectManagerId": null,
        "projectTerm": null,
        "probability": null,
        "page": 0,
        "size": 10,
        "sortBy": "createdOn",
        "sortDirection": "asc"
      }

      console.log(data);

      this.apiService.projectSearch(data).subscribe({
        next: val => {
          console.log(val);
          this.projectList = val.data.content;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error){
      console.log(error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  // ── Step-level enable ──
  isStepEnabled(stepIdx: number): boolean {
    if (stepIdx === 0) return true;
    return this.getFilledRowCount(stepIdx - 1) > 0 || this.stepCompleted[stepIdx - 1];
  }

  // ── Row-level enable ──
  isRowEnabledForStep(stepIdx: number, rowIdx: number): boolean {
    if (stepIdx === 0) {
      if (rowIdx === 0) return true;
      return this.hasAnyValueInRow(0, rowIdx - 1);
    } else {
      return this.isRowFullyFilled(stepIdx - 1, rowIdx);
    }
  }

  isRowFullyFilled(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    const rowForm = this.stepForms[stepIdx]?.[rowIdx];
    if (!rowForm) return false;
    return cols.every(col => {
      const val = rowForm.get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  hasAnyValueInRow(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    const rowForm = this.stepForms[stepIdx]?.[rowIdx];
    if (!rowForm) return false;
    return cols.some(col => {
      const val = rowForm.get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  getFilledRowCount(stepIdx: number): number {
    return this.wtgRows.filter((_, rowIdx) => this.isRowFullyFilled(stepIdx, rowIdx)).length;
  }

  getStepFormValue(stepIdx: number, rowIdx: number, field: string): any {
    return this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
  }

  setStepFormValue(stepIdx: number, rowIdx: number, field: string, value: any) {
    this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.setValue(value);
    this.cdr.detectChanges();
  }

  isStepRowsFilled(stepIdx: number): boolean {
    return this.getFilledRowCount(stepIdx) > 0;
  }

  markStepComplete(stepIdx: number) {
    if (this.isStepRowsFilled(stepIdx)) {
      this.stepCompleted[stepIdx] = true;
      if (stepIdx + 1 < this.steps.length) this.wtgPopupActiveStep = stepIdx + 1;
      this.messageService.add({
        severity: 'success',
        summary: 'Step Saved',
        detail: `${this.steps[stepIdx].label} data saved successfully.`
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'Please fill at least one complete row before saving this step.'
      });
    }
  }

  onSubmit() {
    const allData: any = { pCode: this.pCode, projectName: this.projectName, wtgQty: this.wtgQty, steps: [] };
    this.steps.forEach((step, stepIdx) => {
      allData.steps.push({
        stepLabel: step.label,
        rows: this.wtgRows.map((wtg, rowIdx) => ({
          wtgId: wtg.wtgId,
          locationNo: wtg.locationNo,
          ...this.stepForms[stepIdx][rowIdx].value
        }))
      });
    });
    console.log('Commissioning Submit:', allData);
    this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Commissioning data submitted successfully!' });
  }

  getCompletedCount(): number {
    return this.stepCompleted.filter(Boolean).length;
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ── Open WTG Popup ──
  openWtgPopup(row: SummaryRow) {
    this.selectedSummaryRow = row;
    this.wtgPopupActiveStep = 0;
    this.wtgPopupVisible = true;
  }

  closeWtgPopup() {
    this.wtgPopupVisible = false;
    this.selectedSummaryRow = null;
  }

  /** Plain WtgRow[] sliced to selected row's wtgCount — for editable WTG popup table */
  getWtgPopupRows(): CommWtgRow[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  // ── View All Data Popup ──
  openViewAllData() {
    this.viewVisible = true;
  }

  closeViewPopup() {
    this.viewVisible = false;
  }

  /** Plain WtgRow[] sliced to selected row's wtgCount — for read-only View All Data popup */
  getViewWtgRows(): CommWtgRow[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

  getViewStepGroups(): { stepIdx: number; label: string; colCount: number }[] {
    return this.steps.map((step, stepIdx) => ({
      stepIdx,
      label: `Step ${step.id}: ${step.label}`,
      colCount: this.stepColumnDefs[stepIdx].length
    }));
  }

  getViewValue(stepIdx: number, rowIdx: number, field: string, type: 'date' | 'text' | 'number'): string {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    if (val === null || val === undefined || val === '') return '—';
    if (type === 'date' && val instanceof Date) {
      const dd = String(val.getDate()).padStart(2, '0');
      const mm = String(val.getMonth() + 1).padStart(2, '0');
      return `${dd}-${mm}-${val.getFullYear()}`;
    }
    return String(val);
  }

  hasViewValue(stepIdx: number, rowIdx: number, field: string): boolean {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    return val !== null && val !== undefined && val !== '';
  }

  getLocationOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;

    return this.wtgRows.slice(0, count).map(r => ({
      label: r.locationNo,
      value: r.locationNo
    }));
  }

  getMaximoOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;

    return this.wtgRows.slice(0, count).map(r => ({
      label: r.maximoId,
      value: r.maximoId
    }));
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload(event: any){
    try {
      this.selectedFile = event.files[0];
  
      if (!this.selectedFile) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select file'
        });
        return;
      }
  
      const formData = new FormData();
  
      formData.append('file', this.selectedFile);
  
      formData.append('projectId', this.selectedProject.projectId);
  
      this.apiService.commissioningImport(formData).subscribe({
        next: val => {
          console.log(val);
  
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully'
          });
  
          this.displayImportDialog = false;
          this.chooseUploadTemplate = false;
  
          this.selectedFile = null;
        },
        error: err => {
          console.log(err);
  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.detail
          });
        }
      })
    } catch(error){
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  uploadTemplate(){
    try {
      this.displayImportDialog = true;
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  downloadTemplate(){
    try {
      const data = {
        projectId: this.selectedProject.projectId
      }
  
      console.log(data);
  
      this.apiService.commissioningExport(data).subscribe({
        next: (val: Blob) => {
          console.log(val);
          const url = window.URL.createObjectURL(val);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Commissioning.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Commissioning excel template downloaded successfully.' });
          this.chooseDownloadTemplate = false;
        },
        error: async(err) => {
          console.log(err);
          if (err.error instanceof Blob) {
            const text = await err.error.text();
            const json = JSON.parse(text);

            this.messageService.add({severity: 'error', summary: 'Error', detail: json.detail || 'Something went wrong' });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail || 'Something went wrong' });
          }
        }
      })
    } catch(error){
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

  exportCommissioning(){
    try {
      this.chooseDownloadTemplate = true;      
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getMenuItems(){
    return [
      {
        label: 'Import',
        icon: 'pi pi-upload',
        command: () => this.openImportDialog()
      },
      {
        label: 'Export',
        icon: 'pi pi-download',
        command: () => this.exportCommissioning()
      }
    ]
  }

  openMenu(menu: any, event: any, project: any){
    this.selectedProject = project;
    console.log(this.selectedProject);
    this.items = this.getMenuItems();
    menu.toggle(event);
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { Shared } from '../shared/services/shared';

export interface CommWtgRow {
  wtgId: string;
  locationNo: string;
}

@Component({
  selector: 'app-commisioning-11',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './commisioning-11.html',
  styleUrl: './commisioning-11.css',
})
export class Commisioning11 {
pCode = 'P-8001';
  projectName = 'India_Renew1_Gadag_KA_300.3MW';
  wtgQty = 2; // Set to 90 WTGs as per requirement

  stepCompleted: boolean[] = [];
  activeStep = 0;
  stepForms: FormGroup[][] = [];
  wtgRows: CommWtgRow[] = [];

  locationOptions: any[] = [];

  selectedLocations: string[] = [];
  filteredRows: CommWtgRow[] = [];

  // View Popup state
  showViewPopup = false;
  popupActiveStep = 0;

  steps = [
    { id: 1, label: 'PRE-COMMISSIONING', subLabel: 'Pre-Com, Bottom Comm, Nacelle, Hub & Sign Off' },
    { id: 2, label: 'COMMISSIONING', subLabel: 'USS/WTG Charge, Converter, Generation, COD & Certificate' },
    { id: 3, label: 'STPT', subLabel: 'Short-Term Performance Test' },
    { id: 4, label: 'HOTO', subLabel: 'Hand Over Take Over' }
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
    0: [
      { field: 'preComDate',            header: 'PRE-COM Plan',                    type: 'date' },
      { field: 'preComActual',          header: 'PRE-COM Actual',                  type: 'date' },
      { field: 'preComDelayReason',     header: 'PRE-COM Delay Reason',            type: 'text' },
      { field: 'bottomCommDate',        header: 'Bottom Commissioning Plan',       type: 'date' },
      { field: 'bottomCommActual',      header: 'Bottom Commissioning Actual',     type: 'date' },
      { field: 'bottomCommDelayReason', header: 'Bottom Comm Delay Reason',        type: 'text' },
      { field: 'nacelleCommDate',       header: 'Nacelle Comm Plan',               type: 'date' },
      { field: 'nacelleCommActual',     header: 'Nacelle Comm Actual',             type: 'date' },
      { field: 'nacelleCommDelayReason',header: 'Nacelle Comm Delay Reason',       type: 'text' },
      { field: 'hubCommDate',           header: 'Hub Comm Plan',                   type: 'date' },
      { field: 'hubCommActual',         header: 'Hub Comm Actual',                 type: 'date' },
      { field: 'hubCommDelayReason',    header: 'Hub Comm Delay Reason',           type: 'text' },
      { field: 'signOffDate',           header: 'Sign Off Plan',                   type: 'date' },
      { field: 'signOffActual',         header: 'Sign Off Actual',                 type: 'date' },
      { field: 'signOffDelayReason',    header: 'Sign Off Delay Reason',           type: 'text' },
    ],
    1: [
      { field: 'commPlanDate',             header: 'COMM Plan',                       type: 'date' },
      { field: 'commActualDate',           header: 'Commissioning Actual',            type: 'date' },
      { field: 'ussChargeDate',            header: 'USS Charge Plan',                 type: 'date' },
      { field: 'ussChargeActual',          header: 'USS Charge Actual',               type: 'date' },
      { field: 'wtgChargeDate',            header: 'WTG Charge Plan',                 type: 'date' },
      { field: 'wtgChargeActual',          header: 'WTG Charge Actual',               type: 'date' },
      { field: 'converterTestDate',        header: 'Converter Test Plan',             type: 'date' },
      { field: 'converterTestActual',      header: 'Converter Test Actual',           type: 'date' },
      { field: 'generationTrialDate',      header: 'Generation Trial Plan',           type: 'date' },
      { field: 'generationTrialActual',    header: 'Generation Trial Actual',         type: 'date' },
      { field: 'realTimeValidationDate',   header: 'Real Time Validation Plan',       type: 'date' },
      { field: 'realTimeValidationActual', header: 'Real Time Validation Actual',     type: 'date' },
      { field: 'mppcPpcDate',              header: 'MPPC / PPC Plan',                 type: 'date' },
      { field: 'mppcPpcActual',            header: 'MPPC / PPC Actual',               type: 'date' },
      { field: 'codDate',                  header: 'COD Plan',                        type: 'date' },
      { field: 'codActual',                header: 'COD Actual',                      type: 'date' },
      { field: 'certSignOffDate',          header: 'Certificate Sign Off Plan',       type: 'date' },
      { field: 'certSignOffActual',        header: 'Certificate Sign Off Actual',     type: 'date' },
    ],
    2: [
      { field: 'stptStartDate',    header: 'STPT Start Plan',     type: 'date' },
      { field: 'stptStartActual',  header: 'STPT Start Actual',   type: 'date' },
      { field: 'stptEndDate',      header: 'STPT End Plan',       type: 'date' },
      { field: 'stptEndActual',    header: 'STPT End Actual',     type: 'date' },
      { field: 'stptSignOffDate',  header: 'STPT Sign Off Plan',  type: 'date' },
      { field: 'stptSignOffActual',header: 'STPT Sign Off Actual',type: 'date' },
      { field: 'stptDelayReason',  header: 'Delay Reason',        type: 'text' },
    ],
    3: [
      { field: 'hotoStartDate',    header: 'HOTO Start Plan',     type: 'date' },
      { field: 'hotoStartActual',  header: 'HOTO Start Actual',   type: 'date' },
      { field: 'hotoFinishDate',   header: 'HOTO Finish Plan',    type: 'date' },
      { field: 'hotoFinishActual', header: 'HOTO Finish Actual',  type: 'date' },
      { field: 'hotoSignOffDate',  header: 'HOTO Sign Off Plan',  type: 'date' },
      { field: 'hotoSignOffActual',header: 'HOTO Sign Off Actual',type: 'date' },
      { field: 'hotoDelayReason',  header: 'Delay Reason',        type: 'text' },
    ],
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.stepCompleted = new Array(this.steps.length).fill(false);

    for (let i = 1; i <= this.wtgQty; i++) {
      this.wtgRows.push({ wtgId: `WTG ${i}`, locationNo: `ENV ${i}` });
    }

    this.locationOptions = this.wtgRows.map(row => ({
      label: row.locationNo,
      value: row.locationNo
    }));

    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      const rowForms: FormGroup[] = this.wtgRows.map(() => {
        const group: any = {};
        cols.forEach(col => { group[col.field] = [null]; });
        return this.fb.group(group);
      });
      this.stepForms.push(rowForms);
    }
    this.filteredRows = [...this.wtgRows];
  }

  // ── Step-level enable: Step 0 always on; Step N enabled if any row in Step N-1 is fully filled ──
  isStepEnabled(stepIdx: number): boolean {
    if (stepIdx === 0) return true;
    return this.getFilledRowCount(stepIdx - 1) > 0 || this.stepCompleted[stepIdx - 1];
  }

  // ── Row-level enable per step ──
  // Step 0: row 0 always enabled; row N enabled if row N-1 has at least one value filled
  // Step N (N>0): row R enabled only if row R is fully filled in step N-1
  isRowEnabledForStep(stepIdx: number, rowIdx: number): boolean {
    if (stepIdx === 0) {
      if (rowIdx === 0) return true;
      // Previous row must have at least one value filled
      return this.hasAnyValueInRow(0, rowIdx - 1);
    } else {
      // Row must be fully filled in the previous step to be enabled in current step
      return this.isRowFullyFilled(stepIdx - 1, rowIdx);
    }
  }

  // ── Check if a row has ALL fields filled ──
  isRowFullyFilled(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    const rowForm = this.stepForms[stepIdx]?.[rowIdx];
    if (!rowForm) return false;
    return cols.every(col => {
      const val = rowForm.get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  // ── Check if a row has at least one value ──
  hasAnyValueInRow(stepIdx: number, rowIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    const rowForm = this.stepForms[stepIdx]?.[rowIdx];
    if (!rowForm) return false;
    return cols.some(col => {
      const val = rowForm.get(col.field)?.value;
      return val !== null && val !== undefined && val !== '';
    });
  }

  // ── Count fully-filled rows in a step ──
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
      if (stepIdx + 1 < this.steps.length) this.activeStep = stepIdx + 1;
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
    const allData: any = {
      pCode: this.pCode,
      projectName: this.projectName,
      wtgQty: this.wtgQty,
      steps: []
    };
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
    this.messageService.add({
      severity: 'success',
      summary: 'Submitted',
      detail: 'Commissioning data submitted successfully!'
    });
  }

  getCompletedCount(): number {
    return this.stepCompleted.filter(Boolean).length;
  }

  // ── View Popup ──
  openViewPopup() {
    this.popupActiveStep = 0;
    this.showViewPopup = true;
  }

  closeViewPopupOnOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('view-popup-overlay')) {
      this.showViewPopup = false;
    }
  }

  // ── Format date for display in popup ──
  formatDateDisplay(val: any): string {
    if (!val) return '';
    if (val instanceof Date) {
      const d = val.getDate().toString().padStart(2, '0');
      const m = (val.getMonth() + 1).toString().padStart(2, '0');
      const y = val.getFullYear();
      return `${d}-${m}-${y}`;
    }
    return String(val);
  }

  trackByIndex(index: number): number {
    return index;
  }

  applyFilter() {
    if (!this.selectedLocations || this.selectedLocations.length === 0) {
      this.filteredRows = [...this.wtgRows];
    } else {
      this.filteredRows = this.wtgRows.filter(row =>
        this.selectedLocations.includes(row.locationNo)
      );
    }
  }
}

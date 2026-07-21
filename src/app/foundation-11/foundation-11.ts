import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MenuItem,MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Shared } from '../shared/services/shared';


export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
}

export interface SummaryRow {
  projectCode: string;
  location: string;
  wtgCount: number;
}

export interface ViewColumn {
  field: string;
  header: string;
  stepLabel: string;
  type: 'date' | 'text' | 'number';
  stepIdx: number;
}


@Component({
  selector: 'app-foundation-11',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule, InputNumberModule,
    DialogModule, Shared,
  ],
  providers: [MessageService],
  templateUrl: './foundation-11.html',
  styleUrl: './foundation-11.css',
})
export class Foundation11 {

  pCode = 'P-8001';
    wtgQty = 2;
  
    stepCompleted: boolean[] = new Array(17).fill(false);
    activeStep = 0;
  
    locationOptions: any[] = [];
  
    stepForms: FormGroup[][] = [];
    wtgRows: WtgRow[] = [];
  
    // View Popup
    viewVisible = false;
  
    // Open WTG Popup
    wtgPopupVisible = false;
    wtgPopupActiveStep = 0;
    selectedSummaryRow: SummaryRow | null = null;
    items: MenuItem[] = [];
  
  
    // Summary Table rows
    summaryRows: SummaryRow[] = [
      { projectCode: 'P-8001', location: 'ENV 1', wtgCount: 2 },
      { projectCode: 'P-8002', location: 'ENV 2', wtgCount: 5 },
      { projectCode: 'P-8003', location: 'ENV 3', wtgCount: 3 },
    ];
  
    steps = [
      { id: 1, label: 'Soil Test', fields: ['soilTestStartDate', 'soilTestStartActual', 'soilTestStartDelayReason', 'soilTestEndDate', 'soilTestEndActual', 'soilTestEndDelayReason', 'designSBC', 'actualSBC'] },
      // { id: 2, label: 'Numbers (Design SBC / Actual SBC)', fields: ['designSBC', 'actualSBC'] },
      { id: 2, label: 'Excavation', fields: ['excavationStartDate', 'excavationEndDate', 'excavationStartActual', 'excavationFinishActual', 'excavationDelayReason'] },
      { id: 3, label: 'PCC', fields: ['pccDate', 'pccActual', 'pccDelayReason'] },
      { id: 4, label: 'Bottom Flange', fields: ['bottomFlangeDate', 'bottomFlangeActual'] },
      { id: 5, label: 'Top Flange', fields: ['topFlangeDate', 'topFlangeActual', 'topBottomFlangeDelayReason'] },
      { id: 6, label: 'Reinforcement', fields: ['reinforcementStartDate', 'reinforcementStartActual', 'reinforcementFinishDate', 'reinforcementFinishActual', 'reinforcementDelayReason'] },
      { id: 7, label: 'Earthing Strip', fields: ['earthingStripDate', 'earthingStripActual', 'earthingStripDelayReason'] },
      { id: 8, label: 'Shuttering', fields: ['shutteringDate', 'shutteringActual', 'shutteringDelayReason'] },
      { id: 9, label: 'Foundation Casting Raft', fields: ['foundationCastingRaftDate', 'foundationCastingRaftActual', 'foundationCastingRaftDelayReason'] },
      { id: 10, label: 'Foundation Casting Pedestal', fields: ['foundationCastingPedestalDate', 'foundationCastingPedestalActual', 'foundationCastingPedestalDelayReason'] },
      { id: 11, label: 'Foundation Cube Test', fields: ['foundation7DayCubeTestDate', 'foundation21DayCubeTestDate', 'foundation28DayCubeTestDate', 'foundationCubeTestDelayReason'] },
      { id: 12, label: 'Grouting', fields: ['groutingDate', 'groutingActual', 'groutingDelayReason'] },
      { id: 13, label: 'Grouting Cube Test', fields: ['grouting7DayCubeTestDate', 'grouting28DayCubeTestDate', 'groutingCubeTestDelayReason'] },
      { id: 14, label: 'Backfilling', fields: ['backfillingDate', 'backfillingActual', 'backfillingDelayReason'] },
      { id: 15, label: 'Approach Road', fields: ['approachRoadDate', 'approachRoadActual', 'approachRoadDelayReason'] },
      { id: 16, label: 'Crane Platform & Location Clearance', fields: ['cranePlatformDate', 'cranePlatformActual', 'cranePlatformDelayReason', 'locClearForErectionDate', 'locClearForErectionActual', 'locClearForErectionDelayReason'] },
    ];
  
    stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
      0: [
        { field: 'soilTestStartDate', header: 'Soil Test Start Date', type: 'date' },
        { field: 'soilTestStartActual', header: 'Soil Test Start Actual', type: 'date' },
        { field: 'soilTestStartDelayReason', header: 'Delay Reason (Start)', type: 'text' },
        { field: 'soilTestEndDate', header: 'Soil Test End Date', type: 'date' },
        { field: 'soilTestEndActual', header: 'Soil Test End Actual', type: 'date' },
        { field: 'soilTestEndDelayReason', header: 'Delay Reason (End)', type: 'text' },
        { field: 'designSBC', header: 'Design SBC', type: 'number' },
        { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' }
      ],
      // 1: [
      //   { field: 'designSBC', header: 'Design SBC', type: 'number' },
      //   { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' },
      // ],
      1: [
        { field: 'excavationStartDate', header: 'Excavation Start Date', type: 'date' },
        { field: 'excavationEndDate', header: 'Excavation End Date', type: 'date' },
        { field: 'excavationStartActual', header: 'Excavation Start Actual', type: 'date' },
        { field: 'excavationFinishActual', header: 'Excavation Finish Actual', type: 'date' },
        { field: 'excavationDelayReason', header: 'Excavation Delay Reason', type: 'text' },
      ],
      2: [
        { field: 'pccDate', header: 'PCC Date', type: 'date' },
        { field: 'pccActual', header: 'PCC Actual', type: 'date' },
        { field: 'pccDelayReason', header: 'PCC Delay Reason', type: 'text' },
      ],
      3: [
        { field: 'bottomFlangeDate', header: 'Bottom Flange Date', type: 'date' },
        { field: 'bottomFlangeActual', header: 'Bottom Flange Actual', type: 'date' },
      ],
      4: [
        { field: 'topFlangeDate', header: 'Top Flange Date', type: 'date' },
        { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
        { field: 'topBottomFlangeDelayReason', header: 'Top/Bottom Flange Delay Reason', type: 'text' },
      ],
      5: [
        { field: 'reinforcementStartDate', header: 'Reinforcement Start Date', type: 'date' },
        { field: 'reinforcementStartActual', header: 'Reinforcement Start Actual', type: 'date' },
        { field: 'reinforcementFinishDate', header: 'Reinforcement Finish Date', type: 'date' },
        { field: 'reinforcementFinishActual', header: 'Reinforcement Finish Actual', type: 'date' },
        { field: 'reinforcementDelayReason', header: 'Reinforcement Delay Reason', type: 'text' },
      ],
      6: [
        { field: 'earthingStripDate', header: 'Earthing Strip Date', type: 'date' },
        { field: 'earthingStripActual', header: 'Earthing Strip Actual', type: 'date' },
        { field: 'earthingStripDelayReason', header: 'Earthing Strip Delay Reason', type: 'text' },
      ],
      7: [
        { field: 'shutteringDate', header: 'Shuttering Date', type: 'date' },
        { field: 'shutteringActual', header: 'Shuttering Actual', type: 'date' },
        { field: 'shutteringDelayReason', header: 'Shuttering Delay Reason', type: 'text' },
      ],
      8: [
        { field: 'foundationCastingRaftDate', header: 'Foundation Casting Raft Date', type: 'date' },
        { field: 'foundationCastingRaftActual', header: 'Foundation Casting Raft Actual', type: 'date' },
        { field: 'foundationCastingRaftDelayReason', header: 'Delay Reason', type: 'text' },
      ],
      9: [
        { field: 'foundationCastingPedestalDate', header: 'Foundation Casting Pedestal Date', type: 'date' },
        { field: 'foundationCastingPedestalActual', header: 'Foundation Casting Pedestal Actual', type: 'date' },
        { field: 'foundationCastingPedestalDelayReason', header: 'Delay Reason', type: 'text' },
      ],
      10: [
        { field: 'foundation7DayCubeTestDate', header: 'Foundation 7 Days Cube Test Date', type: 'date' },
        { field: 'foundation21DayCubeTestDate', header: 'Foundation 21 Days Cube Test Date', type: 'date' },
        { field: 'foundation28DayCubeTestDate', header: 'Foundation 28 Days Cube Test Date', type: 'date' },
        { field: 'foundationCubeTestDelayReason', header: 'Cube Test Delay Reason', type: 'text' },
      ],
      11: [
        { field: 'groutingDate', header: 'Grouting Date', type: 'date' },
        { field: 'groutingActual', header: 'Grouting Actual', type: 'date' },
        { field: 'groutingDelayReason', header: 'Grouting Delay Reason', type: 'text' },
      ],
      12: [
        { field: 'grouting7DayCubeTestDate', header: 'Grouting 7 Days Cube Test Date', type: 'date' },
        { field: 'grouting28DayCubeTestDate', header: 'Grouting 28 Days Cube Test Date', type: 'date' },
        { field: 'groutingCubeTestDelayReason', header: 'Grouting Cube Test Delay Reason', type: 'text' },
      ],
      13: [
        { field: 'backfillingDate', header: 'Backfilling Date', type: 'date' },
        { field: 'backfillingActual', header: 'Backfilling Actual', type: 'date' },
        { field: 'backfillingDelayReason', header: 'Backfilling Delay Reason', type: 'text' },
      ],
      14: [
        { field: 'approachRoadDate', header: 'Approach Road Date', type: 'date' },
        { field: 'approachRoadActual', header: 'Approach Road Actual', type: 'date' },
        { field: 'approachRoadDelayReason', header: 'Approach Road Delay Reason', type: 'text' },
      ],
      15: [
        { field: 'cranePlatformDate', header: 'Crane Platform Date', type: 'date' },
        { field: 'cranePlatformActual', header: 'Crane Platform Actual', type: 'date' },
        { field: 'cranePlatformDelayReason', header: 'Crane Platform Delay Reason', type: 'text' },
        { field: 'locClearForErectionDate', header: 'Loc Clear for Erection Date', type: 'date' },
        { field: 'locClearForErectionActual', header: 'Loc Clear for Erection Actual', type: 'date' },
        { field: 'locClearForErectionDelayReason', header: 'Loc Clear for Erection Delay Reason', type: 'text' },
      ],
    };
  
    constructor(private fb: FormBuilder, private messageService: MessageService) {}
  
    ngOnInit() {
      // Build enough WTG rows to cover the maximum wtgCount across all summary rows
      const maxWtg = Math.max(this.wtgQty, ...this.summaryRows.map(r => r.wtgCount));
      for (let i = 1; i <= maxWtg; i++) {
        this.wtgRows.push({
          wtgId: `WTG-${String(i).padStart(2, '0')}`,
          locationNo: `LOC-${String(i).padStart(2, '0')}`,
          maximoId: `MAX-${String(i).padStart(3, '0')}`
        });
      }
  
      // Build step forms for ALL rows (maxWtg) so every summary row's WTGs have forms
      for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
        const cols = this.stepColumnDefs[stepIdx];
        const rowForms: FormGroup[] = this.wtgRows.map(() => {
          const group: any = {};
          cols.forEach(col => { group[col.field] = [null]; });
          return this.fb.group(group);
        });
        this.stepForms.push(rowForms);
      }
  
      this.items = this.getMenuItems("");
    }
  
      getMenuItems(row:any){
      return [
        {
          label: 'Import',
          icon: 'pi pi-upload',
          command:() =>  this.openImportDialog(row)
        },
        {
          label: 'Export',
          icon: 'pi pi-download',
          command:() =>  this.exportFoundation(row)
        }
      ]
    }
  
    openImportDialog(row: any) {
      /* this.selectedRow = row;
      this.displayImportDialog = true; */
    }
  
    exportFoundation(val:any){
      try{
        var value = val
        let data = {
          "projectId": 1
        }
  
        //
        /* this.apiService.foundationExport(data).subscribe({
          next: (val: Blob) => {
            const url = window.URL.createObjectURL(val);
            const a = document.createElement('a');
            a.href = url;
            a.download = `foundation_template.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Production & Quality excel template downloaded successfully.' });
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
        }) */
        //
        /* this.apiService.foundationExport(data)
        .subscribe({
          next:val=>{
            console.log(val)
            window.open(val.fileUrl)
          },error:err=>{
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Download failed'
            });
          }
        }) */
      }catch(e){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      }
    }
  
    // ─── ROW-LEVEL UNLOCK LOGIC ───────────────────────────────────────────────
    /**
     * A specific row in stepIdx is enabled only if the SAME rowIdx
     * in the previous step has ALL fields fully filled.
     * Step 0 rows are always enabled.
     */
    isRowEnabled(stepIdx: number, rowIdx: number): boolean {
      if (stepIdx === 0) return true;
      return this.isPreviousStepRowFullyFilled(stepIdx - 1, rowIdx);
    }
  
    isPreviousStepRowFullyFilled(stepIdx: number, rowIdx: number): boolean {
      const cols = this.stepColumnDefs[stepIdx];
      if (!this.stepForms[stepIdx]?.[rowIdx]) return false;
      return cols.every(col => {
        const val = this.stepForms[stepIdx][rowIdx].get(col.field)?.value;
        return val !== null && val !== undefined && val !== '';
      });
    }
  
    isStepEnabled(stepIdx: number): boolean {
      if (stepIdx === 0) return true;
      return this.stepCompleted[stepIdx - 1] || this.isAnyRowFullyFilledInStep(stepIdx - 1);
    }
  
    isAnyRowFullyFilledInStep(stepIdx: number): boolean {
      const cols = this.stepColumnDefs[stepIdx];
      return this.stepForms[stepIdx]?.some(rowForm =>
        cols.every(col => {
          const val = rowForm.get(col.field)?.value;
          return val !== null && val !== undefined && val !== '';
        })
      ) ?? false;
    }
  
    isAnyRowFilledInStep(stepIdx: number): boolean {
      const cols = this.stepColumnDefs[stepIdx];
      return this.stepForms[stepIdx]?.some(rowForm =>
        cols.some(col => {
          const val = rowForm.get(col.field)?.value;
          return val !== null && val !== undefined && val !== '';
        })
      ) ?? false;
    }
  
    getStepFormValue(stepIdx: number, rowIdx: number, field: string): any {
      return this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    }
  
    setStepFormValue(stepIdx: number, rowIdx: number, field: string, value: any) {
      this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.setValue(value);
    }
  
    isStepRowsFilled(stepIdx: number): boolean {
      return this.isAnyRowFilledInStep(stepIdx);
    }
  
    markStepComplete(stepIdx: number) {
      if (this.isStepRowsFilled(stepIdx)) {
        this.stepCompleted[stepIdx] = true;
        if (stepIdx + 1 < this.steps.length) {
          this.activeStep = stepIdx + 1;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Step Saved',
          detail: `${this.steps[stepIdx].label} data saved successfully.`
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Data',
          detail: 'Please fill at least one field before saving this step.'
        });
      }
    }
  
    onSubmit() {
      const allData: any = { pCode: this.pCode, wtgQty: this.wtgQty, steps: [] };
      this.steps.forEach((step, stepIdx) => {
        allData.steps.push({
          stepLabel: step.label,
          rows: this.wtgRows.map((wtg, rowIdx) => ({
            wtgId: wtg.wtgId,
            locationNo: wtg.locationNo,
            maximoId: wtg.maximoId,
            ...this.stepForms[stepIdx][rowIdx].value
          }))
        });
      });
      console.log('Foundation Submit:', allData);
      this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Foundation data submitted successfully!' });
    }
  
    getCompletedCount(): number {
      return this.stepCompleted.filter(Boolean).length;
    }
  
    getStepStatus(stepIdx: number): 'completed' | 'active' | 'disabled' {
      if (this.stepCompleted[stepIdx]) return 'completed';
      if (this.isStepEnabled(stepIdx)) return 'active';
      return 'disabled';
    }
  
    trackByIndex(index: number): number {
      return index;
    }
  
    // ─── VIEW POPUP ───────────────────────────────────────────────────────────
  
    openViewPopup() {
      this.viewVisible = true;
    }
  
    closeViewPopup() {
      this.viewVisible = false;
    }
  
    /** Opens View All Data from inside the Open WTG popup — keeps selectedSummaryRow set */
    openViewAllDataFromWtg() {
      this.viewVisible = true;
    }
  
    openWtgPopup(row: SummaryRow) {
      this.selectedSummaryRow = row;
      this.wtgPopupActiveStep = 0;
      this.wtgPopupVisible = true;
    }
  
    closeWtgPopup() {
      this.wtgPopupVisible = false;
      this.selectedSummaryRow = null;
    }
  
    /**
     * Returns plain WtgRow[] for the VIEW ALL DATA popup (read-only).
     * Sliced to only the WTG count of the currently selected summary row.
     */
    getViewWtgRows(): WtgRow[] {
      const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
      return this.wtgRows.slice(0, count);
    }
  
    /**
     * Returns plain WtgRow[] for the OPEN WTG POPUP (editable steps).
     * Sliced to only the WTG count of the currently selected summary row.
     * rowIndex from p-table is used directly as the form index.
     */
    getWtgPopupRows(): WtgRow[] {
      const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
      return this.wtgRows.slice(0, count);
    }
  
    getAllViewColumns(): ViewColumn[] {
      const cols: ViewColumn[] = [];
      this.steps.forEach((step, stepIdx) => {
        this.stepColumnDefs[stepIdx].forEach(col => {
          cols.push({ field: col.field, header: col.header, stepLabel: step.label, type: col.type, stepIdx });
        });
      });
      return cols;
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
        const d = val as Date;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${dd}-${mm}-${d.getFullYear()}`;
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
}

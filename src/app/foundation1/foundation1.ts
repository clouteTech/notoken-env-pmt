import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MenuItem, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { Shared } from '../shared/services/shared';
import { Apiservice } from '../service/apiservice';


export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
}

export interface SummaryRow {
  projectCode: string;
  projectName: string;
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
  selector: 'app-foundation1',
    imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule, InputNumberModule,
    DialogModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './foundation1.html',
  styleUrl: './foundation1.css',
})
export class Foundation1 {
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
  displayImportDialog: boolean = false;

selectedRow: any;

selectedFile: any;

  // Summary Table rows
  summaryRows: SummaryRow[] = [
    { projectCode: 'P-8001', projectName: 'India_TataPower_Chennai_TamilNadu_Phase1_250MW', wtgCount: 2 },
    { projectCode: 'P-8002', projectName: 'India_AdaniEnergy_Belagavi_Karnataka_Phase2_180MW', wtgCount: 5 },
    { projectCode: 'P-8003', projectName: 'India_ReNewPower_Jaisalmer_Rajasthan_Phase1_320MW', wtgCount: 3 },
  ];

  steps = [
    { id: 1, label: 'Soil Test', fields: ['soilTestStartDate', 'soilTestStartActual', 'soilTestStartDelayReason', 'soilTestEndDate', 'soilTestEndActual', 'soilTestEndDelayReason', 'designSBC', 'actualSBC'] },
    // { id: 2, label: 'Numbers (Design SBC / Actual SBC)', fields: ['designSBC', 'actualSBC'] },
    { id: 2, label: 'Excavation', fields: ['excavationStartDate', 'excavationEndDate', 'excavationStartActual', 'excavationFinishActual', 'excavationDelayReason'] },
    { id: 3, label: 'PCC', fields: ['pccDate', 'pccActual', 'pccDelayReason'] },
    { id: 4, label: 'Anchor Cage', fields: ['bottomFlangeDate', 'bottomFlangeActual'] },
    // { id: 5, label: 'Top Flange', fields: ['topFlangeDate', 'topFlangeActual', 'topBottomFlangeDelayReason'] },
    { id: 5, label: 'Reinforcement', fields: ['reinforcementStartDate', 'reinforcementStartActual', 'reinforcementFinishDate', 'reinforcementFinishActual', 'reinforcementDelayReason'] },
    { id: 6, label: 'Earthing Strip', fields: ['earthingStripDate', 'earthingStripActual', 'earthingStripDelayReason'] },
    { id: 7, label: 'Shuttering', fields: ['shutteringDate', 'shutteringActual', 'shutteringDelayReason'] },
    { id: 8, label: 'Foundation Casting Raft', fields: ['foundationCastingRaftDate', 'foundationCastingRaftActual', 'foundationCastingRaftDelayReason'] },
    { id: 9, label: 'Foundation Casting Pedestal', fields: ['foundationCastingPedestalDate', 'foundationCastingPedestalActual', 'foundationCastingPedestalDelayReason'] },
    { id: 10, label: 'Foundation Cube Test', fields: ['foundation7DayCubeTestDate', 'foundation21DayCubeTestDate', 'foundation28DayCubeTestDate', 'foundationCubeTestDelayReason'] },
    { id: 11, label: 'Grouting', fields: ['groutingDate', 'groutingActual', 'groutingDelayReason'] },
    { id: 12, label: 'Grouting Cube Test', fields: ['grouting7DayCubeTestDate', 'grouting28DayCubeTestDate', 'groutingCubeTestDelayReason'] },
    { id: 13, label: 'Backfilling', fields: ['backfillingDate', 'backfillingActual', 'backfillingDelayReason'] },
    { id: 14, label: 'Approach Road', fields: ['approachRoadDate', 'approachRoadActual', 'approachRoadDelayReason'] },
    { id: 15, label: 'Crane Platform', fields: ['cranePlatformDate', 'cranePlatformActual', 'cranePlatformDelayReason', 'locClearForErectionDate', 'locClearForErectionActual', 'locClearForErectionDelayReason'] },
    { id: 16, label: 'Location Clearance', fields: ['locClearForErectionDate', 'locClearForErectionActual', 'locClearForErectionDelayReason'] },
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
    0: [
      // { field: 'soilTestStartDate', header: 'Soil Test Plan Start', type: 'date' },
      { field: 'soilTestStartActual', header: 'Soil Test Actual Start', type: 'date' },
      // { field: 'soilTestForecastStart', header: 'Soil Test Forecast Start', type: 'date' },
      // { field: 'soilTestStartDelayReason', header: 'Soil Test Start Delay Reason', type: 'text' },
      // { field: 'soilTestPlanFinish', header: 'Soil Test Plan Finish', type: 'date' },
      { field: 'soilTestActualFinish', header: 'Soil Test Actual Finish', type: 'date' },
      // { field: 'soilTestForecastFinish', header: 'Soil Test Forecast Finish', type: 'date' },
      // { field: 'soilTestFinishDelayReason', header: 'Soil Test Finish Delay Reason', type: 'text' },
      { field: 'designSBC', header: 'Design SBC', type: 'number' },
      { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' }
    ],
    // 1: [
    //   { field: 'designSBC', header: 'Design SBC', type: 'number' },
    //   { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' },
    // ],
    1: [
      // { field: 'excavationPlanStart', header: 'Excavation Plan Start', type: 'date' },
      { field: 'excavationActualStart', header: 'Excavation Actual Start', type: 'date' },
      // { field: 'excavationForecastStart', header: 'Excavation Forecast Start', type: 'date' },
      // { field: 'excavationStartDelayReason', header: 'Excavation Start Delay Reason', type: 'text' },
      // { field: 'excavationPlanFinish', header: 'Excavation Plan Finish', type: 'date' },
      { field: 'excavationActualFinish', header: 'Excavation Actual Finish', type: 'date' },
      // { field: 'excavationForecastFinish', header: 'Excavation Forecast Finish', type: 'date' },
      // { field: 'excavationFinishDelayReason', header: 'Excavation Finish Delay Reason', type: 'text' },
    ],
    2: [
      // { field: 'pccPlan', header: 'PCC Plan', type: 'date' },
      { field: 'pccActual', header: 'PCC Actual', type: 'date' },
      // { field: 'pccForecast', header: 'PCC Forecast', type: 'date' },
      // { field: 'pccDelayReason', header: 'PCC Delay Reason', type: 'text' },
    ],
    3: [
      // { field: 'bottomFlangePlan', header: 'Bottom Flange Plan', type: 'date' },
      { field: 'bottomFlangeActual', header: 'Bottom Flange Actual', type: 'date' },
      // { field: 'bottomFlangeForecast', header: 'Bottom Flange Forecast', type: 'date' },
      // { field: 'bottomFlangeDelayReason', header: 'Bottom Flange Delay Reason', type: 'text' },
      // { field: 'topFlangePlan', header: 'Top Flange Plan', type: 'date' },
      { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
      // { field: 'topFlangeForecast', header: 'Top Flange Forecast', type: 'date' },
      // { field: 'topFlangeDelayReason', header: 'Top Flange Delay Reason', type: 'text' },
    ],
    // 4: [
    //   { field: 'topFlangeDate', header: 'Top Flange Date', type: 'date' },
    //   { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
    //   { field: 'topBottomFlangeDelayReason', header: 'Top/Bottom Flange Delay Reason', type: 'text' },
    // ],
    4: [
      // { field: 'reinforcementPlanStart', header: 'Reinforcement Plan Start', type: 'date' },
      { field: 'reinforcementActualStart', header: 'Reinforcement Actual Start', type: 'date' },
      // { field: 'reinforcementForecastStart', header: 'Reinforcement Forecast Start', type: 'date' },
      // { field: 'reinforcementStartDelayReason', header: 'Reinforcement Start Delay Reason', type: 'text' },
      // { field: 'reinforcementPlanFinish', header: 'Reinforcement Plan Finish', type: 'date' },
      { field: 'reinforcementActualFinish', header: 'Reinforcement Actual Finish', type: 'date' },
      // { field: 'reinforcementForecastFinish', header: 'Reinforcement Forecast Finish', type: 'date' },
      // { field: 'reinforcementFinishDelayReason', header: 'Reinforcement Finish Delay Reason', type: 'text' },
    ],
    5: [
      // { field: 'earthingStripPlan', header: 'Earthing Strip Plan', type: 'date' },
      { field: 'earthingStripActual', header: 'Earthing Strip Actual', type: 'date' },
      // { field: 'earthingStripForecast', header: 'Earthing Strip Forecast', type: 'date' },
      // { field: 'earthingStripDelayReason', header: 'Earthing Strip Delay Reason', type: 'text' },
    ],
    6: [
      // { field: 'shutteringPlan', header: 'Shuttering Plan', type: 'date' },
      { field: 'shutteringActual', header: 'Shuttering Actual', type: 'date' },
      // { field: 'shutteringForecast', header: 'Shuttering Forecast', type: 'date' },
      // { field: 'shutteringDelayReason', header: 'Shuttering Delay Reason', type: 'text' },
    ],
    7: [
      { field: 'foundationCastingRaftPlan', header: 'Foundation Casting Raft Plan', type: 'date' },
      { field: 'foundationCastingRaftActual', header: 'Foundation Casting Raft Actual', type: 'date' },
      { field: 'foundationCastingRaftForecast', header: 'Foundation Casting Raft Forecast', type: 'date' },
      { field: 'foundationCastingRaftDelayReason', header: 'Foundation Casting Raft Delay Reason', type: 'text' },
    ],
    8: [
      { field: 'foundationCastingPedestalPlan', header: 'Foundation Casting Pedestal Plan', type: 'date' },
      { field: 'foundationCastingPedestalActual', header: 'Foundation Casting Pedestal Actual', type: 'date' },
      { field: 'foundationCastingPedestalForecast', header: 'Foundation Casting Pedestal Forecast', type: 'date' },
      { field: 'foundationCastingPedestalDelayReason', header: 'Foundation Casting Pedestal Delay Reason', type: 'text' },
    ],
    9: [
      { field: 'foundation7DaysCubeTestDate', header: 'Foundation 7 Days Cube Test Date', type: 'date' },
      { field: 'foundation21DaysCubeTestDate', header: 'Foundation 21 Days Cube Test Date', type: 'date' },
      { field: 'foundation28DaysCubeTestDate', header: 'Foundation 28 Days Cube Test Date', type: 'date' },
      // { field: 'foundationCubeTestDelayReason', header: 'Foundation Cube Test Delay Reason', type: 'text' },
    ],
    10: [
      // { field: 'groutingPlan', header: 'Grouting Plan', type: 'date' },
      { field: 'groutingActual', header: 'Grouting Actual', type: 'date' },
      // { field: 'groutingForecast', header: 'Grouting Forecast', type: 'date' },
      // { field: 'groutingDelayReason', header: 'Grouting Delay Reason', type: 'text' },
    ],
    11: [
      { field: 'grouting7DayCubeTestDate', header: 'Grouting 7 Days Cube Test Date', type: 'date' },
      { field: 'grouting28DayCubeTestDate', header: 'Grouting 28 Days Cube Test Date', type: 'date' },
      // { field: 'groutingCubeTestDelayReason', header: 'Grouting Cube Test Delay Reason', type: 'text' },
    ],
    12: [
      // { field: 'backfillingPlan', header: 'Backfilling Plan', type: 'date' },
      { field: 'backfillingActual', header: 'Backfilling Actual', type: 'date' },
      // { field: 'backfillingForecast', header: 'Backfilling Forecast', type: 'date' },
      // { field: 'backfillingDelayReason', header: 'Backfilling Delay Reason', type: 'text' },
    ],
    13: [
      // { field: 'approachRoadPlan', header: 'Approach Road Plan', type: 'date' },
      { field: 'approachRoadActual', header: 'Approach Road Actual', type: 'date' },
      // { field: 'approachRoadForecast', header: 'Approach Road Forecast', type: 'date' },
      // { field: 'approachRoadDelayReason', header: 'Approach Road Delay Reason', type: 'text' },
    ],
    14: [
      // { field: 'cranePlatformPlan', header: 'Crane Platform Plan', type: 'date' },
      { field: 'cranePlatformActual', header: 'Crane Platform Actual', type: 'date' },
      // { field: 'cranePlatformForecast', header: 'Crane Platform Forecast', type: 'date' },
      // { field: 'cranePlatformDelayReason', header: 'Crane Platform Delay Reason', type: 'text' }
    ],
    15: [
      // { field: 'locClearForErectionPlan', header: 'Loc Clear for Erection Plan', type: 'date' },
      { field: 'locClearForErectionActual', header: 'Loc Clear for Erection Actual', type: 'date' },
      // { field: 'locClearForErectionForecast', header: 'Loc Clear for Erection Forecast', type: 'date' },
      // { field: 'locClearForErectionDelayReason', header: 'Loc Clear for Erection Delay Reason', type: 'text' },
    ]
  };

  constructor(private fb: FormBuilder, private messageService: MessageService,private apiService:Apiservice) {}

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
  this.selectedRow = row;
  this.displayImportDialog = true;
}

onFileSelect(event: any) {
  this.selectedFile = event.target.files[0];
}


  exportFoundation(val:any){
    try{
      var value = val
      let data = {
        "projectId": 1
      }
      this.apiService.foundationExport(data)
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
      })
    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  onUpload(event: any) {

    this.selectedFile = event.files[0]

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

  formData.append('projectId', '1');

  this.apiService.foundationImport(formData)
    .subscribe({
      next: (res) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'File uploaded successfully'
        });

        this.displayImportDialog = false;

        this.selectedFile = null;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Upload failed'
        });
      }
    });
}

}

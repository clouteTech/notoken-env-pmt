import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SelectModule } from 'primeng/select';
import { Shared } from '../shared/services/shared';

export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
  wtgType: string;
  towerType: string;
  sectionCount: number;
  craneSupplier: number; // tower section count: 1–6, hardcoded per WTG
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
  type: 'date' | 'text' | 'number' | 'select';
  stepIdx: number;
}

@Component({
  selector: 'app-installation',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule, InputNumberModule,
    DialogModule, SelectModule, Shared
  ],
  providers: [MessageService],
  templateUrl: './installation.html',
  styleUrl: './installation.css',
})
export class Installation implements OnInit {

  pCode = 'P-8001';
  wtgQty = 2;

  stepCompleted: boolean[] = new Array(1).fill(false);
  activeStep = 0;

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
    { projectCode: 'P-8001', projectName: 'India_TataPower_Chennai_TamilNadu_Phase1_250MW', wtgCount: 2 },
    { projectCode: 'P-8002', projectName: 'India_AdaniEnergy_Belagavi_Karnataka_Phase2_180MW', wtgCount: 3 },
    { projectCode: 'P-8003', projectName: 'India_ReNewPower_Jaisalmer_Rajasthan_Phase1_320MW', wtgCount: 4 },
  ];

  assemblyMethodOptions = [
    { label: 'Rotor', value: 'Rotor' },
    { label: 'Hub', value: 'Hub' },
  ];

  // Crane Model dropdown options
  craneModelOptions = [
    { label: 'Crane Model 1', value: 'Crane Model 1' },
    { label: 'Crane Model 2', value: 'Crane Model 2' },
  ];

  // Crane supplier dropdown options (5 or 6 tower sections)
  craneSupplierOptions = [
    { label: 'Crane Supplier 1', value: 'Crane Supplier 1' },
    { label: 'Crane Supplier 2', value: 'Crane Supplier 2' },
  ];

  // Per-row crane supplier form values (stepIdx=0, rowIdx → value)
  // P-8001 rows get a dropdown (5/6), P-8002 rows get fixed 0 (no dropdown)
  rowCraneSupplierValues: { [rowIdx: number]: number } = {};
  rowCraneSupplierFixed: { [rowIdx: number]: boolean } = {}; // true = fixed 0, no dropdown

  // ── Per-row assembly method state (rowIdx → 'Rotor'|'Hub(DD)'|null) ────
  rowAssemblyMethod: { [rowIdx: number]: string | null } = {};

  getTowerSectionCount(rowIdx: number): number {
    // If this row has a fixed 0 (P-8002), all tower sections are N/A
    if (this.rowCraneSupplierFixed[rowIdx]) return 0;
    // Otherwise read the dropdown value (5 or 6), default 5
    return this.rowCraneSupplierValues[rowIdx] ?? 5;
  }

  onCraneSupplierChange(rowIdx: number, value: number) {
    this.rowCraneSupplierValues[rowIdx] = value;
  }

  isCraneSupplierFixed(rowIdx: number): boolean {
    return !!this.rowCraneSupplierFixed[rowIdx];
  }

  getCraneSupplierDisplay(rowIdx: number): number {
    if (this.rowCraneSupplierFixed[rowIdx]) return 0;
    return this.rowCraneSupplierValues[rowIdx] ?? 5;
  }

  isProjectRow(projectCode: string, rowIdx: number): boolean {
    // Determine which project this rowIdx belongs to
    const row = this.selectedSummaryRow;
    return row?.projectCode === projectCode;
  }

  isTowerSectionVisible(rowIdx: number, sectionNum: number): boolean {
    return sectionNum <= this.getTowerSectionCount(rowIdx);
  }

  onAssemblyMethodChange(stepIdx: number, rowIdx: number, value: string) {
    this.rowAssemblyMethod[rowIdx] = value;
    this.setStepFormValue(stepIdx, rowIdx, 'assemblyMethod', value);
    // Clear fields that belong to the other method
    if (value === 'Rotor') {
      // Clear hub-only fields
      ['hubAssemblyDate','blade1Installation','blade2Installation','blade3Installation',
       'maxOfThreeBlade','blade1Bolts10pct','blade2Bolts10pct','blade3Bolts10pct'].forEach(f =>
        this.setStepFormValue(stepIdx, rowIdx, f, null));
    } else if (value === 'Hub(DD)') {
      // Clear rotor-only fields
      ['rotorAssemblyDate','rotorInstallationDate','rotorBolts10pct'].forEach(f =>
        this.setStepFormValue(stepIdx, rowIdx, f, null));
    }
  }

  getAssemblyMethod(stepIdx: number, rowIdx: number): string | null {
    return this.rowAssemblyMethod[rowIdx] ??
           this.getStepFormValue(stepIdx, rowIdx, 'assemblyMethod') ?? null;
  }

  isRotorField(field: string): boolean {
    return ['rotorAssemblyDate', 'rotorInstallationDate', 'rotorBolts10pct'].includes(field);
  }

  isHubField(field: string): boolean {
    return ['hubAssemblyDate', 'blade1Installation', 'blade2Installation', 'blade3Installation',
            'maxOfThreeBlade', 'blade1Bolts10pct', 'blade2Bolts10pct', 'blade3Bolts10pct'].includes(field);
  }

  isTowerSection(field: string): boolean {
    return ['s1TowerInstallation','s2TowerInstallation','s3TowerInstallation',
            's4TowerInstallation','s5TowerInstallation','s6TowerInstallation'].includes(field);
  }

  getTowerSectionNumber(field: string): number {
    const map: Record<string,number> = {
      's1TowerInstallation': 1, 's2TowerInstallation': 2, 's3TowerInstallation': 3,
      's4TowerInstallation': 4, 's5TowerInstallation': 5, 's6TowerInstallation': 6,
    };
    return map[field] ?? 0;
  }

  isUpperBoltsSection(field: string): boolean {
    return ['s1UpperBolts10pct','s2UpperBolts10pct','s3UpperBolts10pct',
            's4UpperBolts10pct','s5UpperBolts10pct','s6UpperBolts10pct'].includes(field);
  }

  getUpperBoltsSectionNumber(field: string): number {
    const map: Record<string,number> = {
      's1UpperBolts10pct': 1, 's2UpperBolts10pct': 2, 's3UpperBolts10pct': 3,
      's4UpperBolts10pct': 4, 's5UpperBolts10pct': 5, 's6UpperBolts10pct': 6,
    };
    return map[field] ?? 0;
  }

  isFieldVisible(stepIdx: number, rowIdx: number, field: string): boolean {
    const method = this.getAssemblyMethod(stepIdx, rowIdx);

    // Tower section visibility: based on craneSupplier value hardcoded per WTG row
    if (this.isTowerSection(field)) {
      const sectionNum = this.getTowerSectionNumber(field);
      return this.isTowerSectionVisible(rowIdx, sectionNum);
    }

    // Upper Bolts Torque Check visibility: same craneSupplier logic as tower sections
    if (this.isUpperBoltsSection(field)) {
      const sectionNum = this.getUpperBoltsSectionNumber(field);
      return this.isTowerSectionVisible(rowIdx, sectionNum);
    }

    // Rotor-only fields: only show if method is Rotor
    if (this.isRotorField(field)) {
      return method === 'Rotor';
    }

    // Hub-only fields: only show if method is Hub(DD)
    if (this.isHubField(field)) {
      return method === 'Hub(DD)';
    }

    // All other fields always visible
    return true;
  }

  // ─── STEPS (7 logical groups from the Excel) ─────────────────────────────
  // Single step — all 54 fields in exact Excel column order (cols 7–60)
  steps = [
    { id: 1, label: 'Installation' },
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' | 'select' }[] } = {
    0: [
      // Col 7-13: Crane & Setup
      { field: 'mainCraneModel',                 header: 'Main Crane Model',                       type: 'select' },
      { field: 'mainCraneMob',                   header: 'Main Crane Mob',                         type: 'date'   },
      { field: 'startOfMainCraneAssembly',       header: 'Start of Main Crane Assembly',           type: 'date'   },
      { field: 'finishOfMainCraneAssembly',      header: 'Finish of Main Crane Assembly',          type: 'date'   },
      { field: 'bottomPlatformAssembly',         header: 'Bottom Platform Assembly',               type: 'date'   },
      { field: 'mainCraneBoomUp',                header: 'Main Crane Boom Up',                     type: 'date'   },
      // Col 14-18: Converter Panel + Installation Start
      { field: 'converterPanelInstallation',     header: 'Converter Panel Installation',           type: 'date'   },
      { field: 'installationPlanStart',          header: 'Installation Plan Start',                type: 'date'   },
      { field: 'installationActualStart',        header: 'Installation Actual Start',              type: 'date'   },
      { field: 'installationForecastStart',      header: 'Installation Forecast Start',            type: 'date'   },
      { field: 'installationStartDelayReason',   header: 'Installation Start Delay Reason',        type: 'text'   },
      // Col 19-23: Tower Sections
      { field: 's1TowerInstallation',            header: 'S1 Tower Section Installation',          type: 'date'   },
      { field: 's2TowerInstallation',            header: 'S2 Tower Section Installation',          type: 'date'   },
      { field: 's3TowerInstallation',            header: 'S3 Tower Section Installation',          type: 'date'   },
      { field: 's4TowerInstallation',            header: 'S4 Tower Section Installation',          type: 'date'   },
      { field: 's5TowerInstallation',            header: 'S5 Tower Section Installation',          type: 'date'   },
      { field: 's6TowerInstallation',            header: 'S6 Tower Section Installation',          type: 'date'   },
      // Col 24-32: Nacelle & Rotor
      { field: 'nacelleInstallation',            header: 'Nacelle Installation',                   type: 'date'   },
      { field: 'assemblyMethod',                 header: 'Assembly Method',                        type: 'select' },
      { field: 'rotorAssemblyDate',              header: 'Rotor Assembly Date',                    type: 'date'   },
      { field: 'hubAssemblyDate',                header: 'Hub Assembly Date',                      type: 'date'   },
      { field: 'blade1Installation',             header: 'Blade 1 Installation',                   type: 'date'   },
      { field: 'blade2Installation',             header: 'Blade 2 Installation',                   type: 'date'   },
      { field: 'blade3Installation',             header: 'Blade 3 Installation',                   type: 'date'   },
      { field: 'maxOfThreeBlade',                header: 'Max of Three Blade',                     type: 'date'   },
      { field: 'rotorInstallationDate',          header: 'Rotor Installation Date',                type: 'date'   },
      // Col 33-37: Installation Finish
      { field: 'installationPlanFinish',         header: 'Installation Plan Finish',               type: 'date'   },
      { field: 'installationActualFinish',       header: 'Installation Actual Finish',             type: 'date'   },
      { field: 'installationForecastFinish',     header: 'Installation Forecast Finish',           type: 'date'   },
      { field: 'installationFinishDelayReason',  header: 'Installation Finish Delay Reason',       type: 'text'   },
      { field: 'mainCraneBoomDown',              header: 'Main Crane Boom Down',                   type: 'date'   },
      // Col 38-49: Torque Checks
      { field: 'anchorBolts10pct',               header: 'Anchor Bolts 10% Torque Check',          type: 'date'   },
      { field: 's1UpperBolts10pct',              header: 'S1 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's2UpperBolts10pct',              header: 'S2 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's3UpperBolts10pct',              header: 'S3 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's4UpperBolts10pct',              header: 'S4 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's5UpperBolts10pct',              header: 'S5 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 's6UpperBolts10pct',              header: 'S6 Upper Bolts 10% Torque Check',        type: 'date'   },
      { field: 'towerNacelleBolts10pct',         header: 'Tower-Nacelle Bolts 10% Torque Check',   type: 'date'   },
      { field: 'nacelleHubBolts10pct',           header: 'Nacelle-Hub Bolts 10% Torque Check',     type: 'date'   },
      { field: 'blade1Bolts10pct',               header: 'Blade 1 Bolts 10% Torque Check Date',    type: 'date'   },
      { field: 'blade2Bolts10pct',               header: 'Blade 2 Bolts 10% Torque Check',         type: 'date'   },
      { field: 'blade3Bolts10pct',               header: 'Blade 3 Bolts 10% Torque Check',         type: 'date'   },
      { field: 'rotorBolts10pct',                header: 'Rotor Bolts 10% Torque Check',           type: 'date'   },
      { field: 'finalTorquingCompleted',         header: '10% Final Torquing Completed',           type: 'date'   },
      // Col 50-55: Mechanical & Electrical
      { field: 'generatorAlignmentDate',         header: 'Generator Alignment Date',               type: 'date'   },
      { field: 'cableLaying',                    header: 'Cable Laying Date',                      type: 'date'   },
      { field: 'mechanicalCompletion',           header: 'Mechanical Completion',                  type: 'date'   },
      { field: 'electricalCompletion',           header: 'Electrical Completion',                  type: 'date'   },
      { field: 'liftInstallation',               header: 'Lift Installation Date',                 type: 'date'   },
      { field: 'qaInspectionFinish',             header: 'QA Inspection Finish Date',              type: 'date'   },
      // Col 56-60: MCC
      { field: 'mccPlan',                        header: 'MCC Plan',                               type: 'date'   },
      { field: 'mccActual',                      header: 'MCC Actual',                             type: 'date'   },
      { field: 'mccForecast',                    header: 'MCC Forecast',                           type: 'date'   },
      { field: 'mccDelayReason',                 header: 'MCC Delay Reason',                       type: 'text'   },
      { field: 'mccSignOffDate',                 header: 'MCC Sign Off Date',                      type: 'date'   },
    ],
  };

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit() {
    const maxWtg = Math.max(this.wtgQty, ...this.summaryRows.map(r => r.wtgCount));

    for (let i = 1; i <= maxWtg; i++) {
      this.wtgRows.push({
        wtgId: `WTG-${String(i).padStart(2, '0')}`,
        locationNo: `LOC-${String(i).padStart(2, '0')}`,
        maximoId: `MAX-${String(i).padStart(3, '0')}`,
        wtgType: i % 2 === 0 ? 'EN182' : 'EN132',
        towerType: i % 2 === 0 ? '140HH-520T' : '120HH-474T',
        sectionCount: i % 2 === 0 ? 5 : 6,
        craneSupplier: 5, // default; overridden per project in openWtgPopup
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
  }

  // ─── ROW-LEVEL UNLOCK LOGIC ───────────────────────────────────────────────
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
        this.wtgPopupActiveStep = stepIdx + 1;
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
          wtgType: wtg.wtgType,
          towerType: wtg.towerType,
          ...this.stepForms[stepIdx][rowIdx].value
        }))
      });
    });
    console.log('Installation Submit:', allData);
    this.messageService.add({ severity: 'success', summary: 'Submitted', detail: 'Installation data submitted successfully!' });
  }

  getCompletedCount(): number {
    return this.stepCompleted.filter(Boolean).length;
  }

  getStepStatus(stepIdx: number): 'completed' | 'active' | 'disabled' {
    if (this.stepCompleted[stepIdx]) return 'completed';
    if (this.isStepEnabled(stepIdx)) return 'active';
    return 'disabled';
  }

  trackByIndex(index: number): number { return index; }

  // ─── VIEW POPUP ───────────────────────────────────────────────────────────
  openViewPopup() { this.viewVisible = true; }
  closeViewPopup() { this.viewVisible = false; }
  openViewAllDataFromWtg() { this.viewVisible = true; }

  openWtgPopup(row: SummaryRow) {
    this.selectedSummaryRow = row;
    this.wtgPopupActiveStep = 0;
    this.wtgPopupVisible = true;

    // Reset per-row crane supplier state for this popup
    this.rowCraneSupplierFixed = {};
    this.rowCraneSupplierValues = {};

    const count = row.wtgCount;
    for (let rowIdx = 0; rowIdx < count; rowIdx++) {
      if (row.projectCode === 'P-8002') {
        // P-8002: all WTGs fixed at 0 — no dropdown, all tower sections N/A
        this.rowCraneSupplierFixed[rowIdx] = true;
      } else {
        // All other projects: dropdown with 5/6, default to 5
        this.rowCraneSupplierFixed[rowIdx] = false;
        this.rowCraneSupplierValues[rowIdx] = 5;
      }
    }
  }

  closeWtgPopup() {
    this.wtgPopupVisible = false;
    this.selectedSummaryRow = null;
  }

  getViewWtgRows(): WtgRow[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count);
  }

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

  getViewValue(stepIdx: number, rowIdx: number, field: string, type: 'date' | 'text' | 'number' | 'select'): string {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    if (val === null || val === undefined || val === '') return '—';
    if (type === 'date' && val instanceof Date) {
      const d = val as Date;
      return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
    }
    return String(val);
  }

  hasViewValue(stepIdx: number, rowIdx: number, field: string): boolean {
    const val = this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
    return val !== null && val !== undefined && val !== '';
  }

  getLocationOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count).map(r => ({ label: r.locationNo, value: r.locationNo }));
  }

  getMaximoOptions(): any[] {
    const count = this.selectedSummaryRow?.wtgCount ?? this.wtgRows.length;
    return this.wtgRows.slice(0, count).map(r => ({ label: r.maximoId, value: r.maximoId }));
  }

  getMenuItems(){
    return [
      {
        label: 'Import',
        icon: 'pi pi-upload'
      },
      {
        label: 'Export',
        icon: 'pi pi-download'
      }
    ]
  }

  shouldShowTowerFields(): boolean {
    return this.selectedSummaryRow?.projectCode !== 'P-8002';
  }
}

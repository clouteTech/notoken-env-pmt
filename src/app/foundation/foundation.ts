import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';

export interface WtgRow {
  wtgId: string;
  locationNo: string;
  maximoId: string;
}

@Component({
  selector: 'app-foundation',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ButtonModule, InputTextModule, DatePickerModule,
    TableModule, ToastModule, CardModule,
    AccordionModule, TagModule, TextareaModule,
    TooltipModule, StepperModule
  ],
  providers: [MessageService],
  templateUrl: './foundation.html',
  styleUrl: './foundation.css',
})
export class Foundation {
pCode = 'P-8001';
  wtgQty = 2;

  // Step completion flags
  stepCompleted: boolean[] = new Array(17).fill(false);
  activeStep = 0;

  // Each step has a FormGroup for each WTG row
  stepForms: FormGroup[][] = [];

  wtgRows: WtgRow[] = [];

  steps = [
    { id: 1, label: 'Soil Test', fields: ['soilTestStartDate', 'soilTestStartActual', 'soilTestStartDelayReason', 'soilTestEndDate', 'soilTestEndActual', 'soilTestEndDelayReason'] },
    { id: 2, label: 'Numbers (Design SBC / Actual SBC)', fields: ['designSBC', 'actualSBC'] },
    { id: 3, label: 'Excavation', fields: ['excavationStartDate', 'excavationEndDate', 'excavationStartActual', 'excavationFinishActual', 'excavationDelayReason'] },
    { id: 4, label: 'PCC', fields: ['pccDate', 'pccActual', 'pccDelayReason'] },
    { id: 5, label: 'Bottom Flange', fields: ['bottomFlangeDate', 'bottomFlangeActual'] },
    { id: 6, label: 'Top Flange', fields: ['topFlangeDate', 'topFlangeActual', 'topBottomFlangeDelayReason'] },
    { id: 7, label: 'Reinforcement', fields: ['reinforcementStartDate', 'reinforcementStartActual', 'reinforcementFinishDate', 'reinforcementFinishActual', 'reinforcementDelayReason'] },
    { id: 8, label: 'Earthing Strip', fields: ['earthingStripDate', 'earthingStripActual', 'earthingStripDelayReason'] },
    { id: 9, label: 'Shuttering', fields: ['shutteringDate', 'shutteringActual', 'shutteringDelayReason'] },
    { id: 10, label: 'Foundation Casting Raft', fields: ['foundationCastingRaftDate', 'foundationCastingRaftActual', 'foundationCastingRaftDelayReason'] },
    { id: 11, label: 'Foundation Casting Pedestal', fields: ['foundationCastingPedestalDate', 'foundationCastingPedestalActual', 'foundationCastingPedestalDelayReason'] },
    { id: 12, label: 'Foundation Cube Test', fields: ['foundation7DayCubeTestDate', 'foundation21DayCubeTestDate', 'foundation28DayCubeTestDate', 'foundationCubeTestDelayReason'] },
    { id: 13, label: 'Grouting', fields: ['groutingDate', 'groutingActual', 'groutingDelayReason'] },
    { id: 14, label: 'Grouting Cube Test', fields: ['grouting7DayCubeTestDate', 'grouting28DayCubeTestDate', 'groutingCubeTestDelayReason'] },
    { id: 15, label: 'Backfilling', fields: ['backfillingDate', 'backfillingActual', 'backfillingDelayReason'] },
    { id: 16, label: 'Approach Road', fields: ['approachRoadDate', 'approachRoadActual', 'approachRoadDelayReason'] },
    { id: 17, label: 'Crane Platform & Location Clearance', fields: ['cranePlatformDate', 'cranePlatformActual', 'cranePlatformDelayReason', 'locClearForErectionDate', 'locClearForErectionActual', 'locClearForErectionDelayReason'] },
  ];

  stepColumnDefs: { [stepIdx: number]: { field: string; header: string; type: 'date' | 'text' | 'number' }[] } = {
    0: [
      { field: 'soilTestStartDate', header: 'Soil Test Start Date', type: 'date' },
      { field: 'soilTestStartActual', header: 'Soil Test Start Actual', type: 'date' },
      { field: 'soilTestStartDelayReason', header: 'Delay Reason (Start)', type: 'text' },
      { field: 'soilTestEndDate', header: 'Soil Test End Date', type: 'date' },
      { field: 'soilTestEndActual', header: 'Soil Test End Actual', type: 'date' },
      { field: 'soilTestEndDelayReason', header: 'Delay Reason (End)', type: 'text' },
    ],
    1: [
      { field: 'designSBC', header: 'Design SBC', type: 'number' },
      { field: 'actualSBC', header: 'Actual SBC (t/m²)', type: 'number' },
    ],
    2: [
      { field: 'excavationStartDate', header: 'Excavation Start Date', type: 'date' },
      { field: 'excavationEndDate', header: 'Excavation End Date', type: 'date' },
      { field: 'excavationStartActual', header: 'Excavation Start Actual', type: 'date' },
      { field: 'excavationFinishActual', header: 'Excavation Finish Actual', type: 'date' },
      { field: 'excavationDelayReason', header: 'Excavation Delay Reason', type: 'text' },
    ],
    3: [
      { field: 'pccDate', header: 'PCC Date', type: 'date' },
      { field: 'pccActual', header: 'PCC Actual', type: 'date' },
      { field: 'pccDelayReason', header: 'PCC Delay Reason', type: 'text' },
    ],
    4: [
      { field: 'bottomFlangeDate', header: 'Bottom Flange Date', type: 'date' },
      { field: 'bottomFlangeActual', header: 'Bottom Flange Actual', type: 'date' },
    ],
    5: [
      { field: 'topFlangeDate', header: 'Top Flange Date', type: 'date' },
      { field: 'topFlangeActual', header: 'Top Flange Actual', type: 'date' },
      { field: 'topBottomFlangeDelayReason', header: 'Top/Bottom Flange Delay Reason', type: 'text' },
    ],
    6: [
      { field: 'reinforcementStartDate', header: 'Reinforcement Start Date', type: 'date' },
      { field: 'reinforcementStartActual', header: 'Reinforcement Start Actual', type: 'date' },
      { field: 'reinforcementFinishDate', header: 'Reinforcement Finish Date', type: 'date' },
      { field: 'reinforcementFinishActual', header: 'Reinforcement Finish Actual', type: 'date' },
      { field: 'reinforcementDelayReason', header: 'Reinforcement Delay Reason', type: 'text' },
    ],
    7: [
      { field: 'earthingStripDate', header: 'Earthing Strip Date', type: 'date' },
      { field: 'earthingStripActual', header: 'Earthing Strip Actual', type: 'date' },
      { field: 'earthingStripDelayReason', header: 'Earthing Strip Delay Reason', type: 'text' },
    ],
    8: [
      { field: 'shutteringDate', header: 'Shuttering Date', type: 'date' },
      { field: 'shutteringActual', header: 'Shuttering Actual', type: 'date' },
      { field: 'shutteringDelayReason', header: 'Shuttering Delay Reason', type: 'text' },
    ],
    9: [
      { field: 'foundationCastingRaftDate', header: 'Foundation Casting Raft Date', type: 'date' },
      { field: 'foundationCastingRaftActual', header: 'Foundation Casting Raft Actual', type: 'date' },
      { field: 'foundationCastingRaftDelayReason', header: 'Delay Reason', type: 'text' },
    ],
    10: [
      { field: 'foundationCastingPedestalDate', header: 'Foundation Casting Pedestal Date', type: 'date' },
      { field: 'foundationCastingPedestalActual', header: 'Foundation Casting Pedestal Actual', type: 'date' },
      { field: 'foundationCastingPedestalDelayReason', header: 'Delay Reason', type: 'text' },
    ],
    11: [
      { field: 'foundation7DayCubeTestDate', header: 'Foundation 7 Days Cube Test Date', type: 'date' },
      { field: 'foundation21DayCubeTestDate', header: 'Foundation 21 Days Cube Test Date', type: 'date' },
      { field: 'foundation28DayCubeTestDate', header: 'Foundation 28 Days Cube Test Date', type: 'date' },
      { field: 'foundationCubeTestDelayReason', header: 'Cube Test Delay Reason', type: 'text' },
    ],
    12: [
      { field: 'groutingDate', header: 'Grouting Date', type: 'date' },
      { field: 'groutingActual', header: 'Grouting Actual', type: 'date' },
      { field: 'groutingDelayReason', header: 'Grouting Delay Reason', type: 'text' },
    ],
    13: [
      { field: 'grouting7DayCubeTestDate', header: 'Grouting 7 Days Cube Test Date', type: 'date' },
      { field: 'grouting28DayCubeTestDate', header: 'Grouting 28 Days Cube Test Date', type: 'date' },
      { field: 'groutingCubeTestDelayReason', header: 'Grouting Cube Test Delay Reason', type: 'text' },
    ],
    14: [
      { field: 'backfillingDate', header: 'Backfilling Date', type: 'date' },
      { field: 'backfillingActual', header: 'Backfilling Actual', type: 'date' },
      { field: 'backfillingDelayReason', header: 'Backfilling Delay Reason', type: 'text' },
    ],
    15: [
      { field: 'approachRoadDate', header: 'Approach Road Date', type: 'date' },
      { field: 'approachRoadActual', header: 'Approach Road Actual', type: 'date' },
      { field: 'approachRoadDelayReason', header: 'Approach Road Delay Reason', type: 'text' },
    ],
    16: [
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
    // Initialize WTG rows
    for (let i = 1; i <= this.wtgQty; i++) {
      this.wtgRows.push({
        wtgId: `WTG ${i}`,
        locationNo: `ENV ${i}`,
        maximoId: `Maximo ${i}`
      });
    }

    // Build form groups for each step and each WTG row
    for (let stepIdx = 0; stepIdx < this.steps.length; stepIdx++) {
      const cols = this.stepColumnDefs[stepIdx];
      const rowForms: FormGroup[] = this.wtgRows.map(() => {
        const group: any = {};
        cols.forEach(col => {
          group[col.field] = [null];
        });
        return this.fb.group(group);
      });
      this.stepForms.push(rowForms);
    }
  }

  isStepEnabled(stepIdx: number): boolean {
    if (stepIdx === 0) return true;
    return this.stepCompleted[stepIdx - 1];
  }

  getStepFormValue(stepIdx: number, rowIdx: number, field: string): any {
    return this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.value;
  }

  setStepFormValue(stepIdx: number, rowIdx: number, field: string, value: any) {
    this.stepForms[stepIdx]?.[rowIdx]?.get(field)?.setValue(value);
  }

  isStepRowsFilled(stepIdx: number): boolean {
    const cols = this.stepColumnDefs[stepIdx];
    // Step is considered filled if at least one row has at least one field filled
    return this.stepForms[stepIdx]?.some(rowForm =>
      cols.some(col => {
        const val = rowForm.get(col.field)?.value;
        return val !== null && val !== undefined && val !== '';
      })
    ) ?? false;
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
    const allData: any = {
      pCode: this.pCode,
      wtgQty: this.wtgQty,
      steps: []
    };

    this.steps.forEach((step, stepIdx) => {
      const stepData = {
        stepLabel: step.label,
        rows: this.wtgRows.map((wtg, rowIdx) => ({
          wtgId: wtg.wtgId,
          locationNo: wtg.locationNo,
          maximoId: wtg.maximoId,
          ...this.stepForms[stepIdx][rowIdx].value
        }))
      };
      allData.steps.push(stepData);
    });

    console.log('Foundation Submit:', allData);
    this.messageService.add({
      severity: 'success',
      summary: 'Submitted',
      detail: 'Foundation data submitted successfully!'
    });
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
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { TextareaModule }    from 'primeng/textarea';
import { SelectModule }      from 'primeng/select';
import { DatePickerModule }  from 'primeng/datepicker';
import { AccordionModule }   from 'primeng/accordion';
import { TableModule }       from 'primeng/table';
import { ToastModule }       from 'primeng/toast';
import { CardModule }        from 'primeng/card';
import { MessageService }    from 'primeng/api';
import { IconFieldModule }   from 'primeng/iconfield';
import { TagModule }         from 'primeng/tag';
import { InputIconModule }   from 'primeng/inputicon';
import { DialogModule }      from 'primeng/dialog';
import { ConfirmDialogModule }from 'primeng/confirmdialog';
import { FluidModule }       from 'primeng/fluid';
import { CheckboxModule }    from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule }     from 'primeng/divider';
import { TooltipModule }     from 'primeng/tooltip';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface WtgConfig {
  id: number;
  wtgType: string[];       // multiselect → array
  capacity: string | null;
  towerType: string;
  gridConnectivity: string;
  ppaType: string;
  wtgQty: number | null;
  shipAddress: string;
  monthly: (number | null)[];
  startMonth: string;
}

export interface SpvEntry {
  id: number;
  spv: string;
  wtgConfigs: WtgConfig[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateMonthLabels(startMonth: string, count = 12): string[] {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [mon, yr] = startMonth.split(' ');
  let mi = monthNames.indexOf(mon);
  let yi = parseInt(yr, 10);
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    labels.push(`${monthNames[mi]} ${yi}`);
    mi++;
    if (mi === 12) { mi = 0; yi++; }
  }
  return labels;
}

function currentMonthLabel(): string {
  const now = new Date();
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][now.getMonth()];
  return `${m} ${now.getFullYear()}`;
}

let _id = 0;
function nextId() { return ++_id; }

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule, IconFieldModule, TagModule, InputIconModule,
    DialogModule, ConfirmDialogModule,
    FluidModule, CheckboxModule, InputNumberModule,
    DividerModule, TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  // ── Project list (table) ──────────────────────────────────────────────────
  projectList = [
    {
      SlNo: '1', Pcode: 'P-8001',
      FPD: 'India_Renew1_Gadag_KA_300.3MW', SiteName: 'ReNew-1 Gadag, KN',
      Customer: 'Renew', Cityinfo: 'Gadag', uniqueS: 'KA-6', State: 'Karnataka',
      WTGQTY: '3', Capacity: '300.3', PM: 'Oxford Rebello', type1: 'FTE',
      StateHead: 'Srikanth Shanmugam', type2: 'FTE', ConstructionManager: 'OM Mishra',
      type3: 'FTE', machinaclLead: '', type4: 'FTE',
      StartDate: '01-01-2022', CompleteDate: '30-06-2025',
      DetailStatus: 'Installation, O&M', Status4: 'Execution,Service',
      ContractualCoD: '31-03-23', ExpectedCoD: '30-06-25', ActualCoD: '02-05-25',
      Delay: 763, Remarks: 'Land delay, RoW, Delay in GSS & EHV Line'
    },
    {
      SlNo: '2', Pcode: 'P-8002',
      FPD: 'India_Renew2_Chandwad_MH_300.3MW', SiteName: 'ReNew2 Chanwad, MH',
      Customer: 'Renew', Cityinfo: 'Chandwad', uniqueS: 'MH-5', State: 'Maharashtra',
      WTGQTY: '3', Capacity: '151.18', PM: 'Oxford Rebello', type1: 'FTE',
      StateHead: 'Surendra Panwar', type2: 'FTE', ConstructionManager: 'Adil Hussain',
      type3: 'DCE', machinaclLead: '', type4: '',
      StartDate: '01-01-2022', CompleteDate: '31-12-2025',
      DetailStatus: 'Installation', Status4: 'Execution',
      ContractualCoD: '31-03-23', ExpectedCoD: '30-06-25', ActualCoD: '02-05-25',
      Delay: 763, Remarks: 'Project size reduced to 46'
    }
  ];

  // ── Dialog / step state ───────────────────────────────────────────────────
  addProjectDialog = false;
  projectHeader: string = 'Step 1: Create Project';
  isProjectCreated = false;
  step1 = true;

  // ── Step 1 form fields ────────────────────────────────────────────────────
  pCode = '';
  cityInfo = '';
  selectedState: any = '';
  selectedZone = '';
  projectQTY: number = 0;
  selectedProjectManager = '';
  selectedBDManager = '';
  selectedSolutionManager = '';
  selectedStateHead = '';
  selectedSiteManager = '';
  selectedMultpleSPV = 'Yes';
  towerScopeChecked = true;
  diableStateDD = false;

  // ── Step 1 dropdown options ───────────────────────────────────────────────
  states = [
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
    { label: 'Assam', value: 'Assam' },
    { label: 'Bihar', value: 'Bihar' },
    { label: 'Chhattisgarh', value: 'Chhattisgarh' },
    { label: 'Goa', value: 'Goa' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Haryana', value: 'Haryana' },
    { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
    { label: 'Jharkhand', value: 'Jharkhand' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Manipur', value: 'Manipur' },
    { label: 'Meghalaya', value: 'Meghalaya' },
    { label: 'Mizoram', value: 'Mizoram' },
    { label: 'Nagaland', value: 'Nagaland' },
    { label: 'Odisha', value: 'Odisha' },
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Rajasthan', value: 'Rajasthan' },
    { label: 'Sikkim', value: 'Sikkim' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Tripura', value: 'Tripura' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'Uttarakhand', value: 'Uttarakhand' },
    { label: 'West Bengal', value: 'West Bengal' },
    { label: 'Delhi', value: 'Delhi' }
  ];

  cityStateMap: { [key: string]: string } = {
    chennai: 'Tamil Nadu', coimbatore: 'Tamil Nadu', salem: 'Tamil Nadu',
    hyderabad: 'Telangana', bengaluru: 'Karnataka', mysuru: 'Karnataka',
    mumbai: 'Maharashtra', pune: 'Maharashtra', delhi: 'Delhi',
    kolkata: 'West Bengal', patna: 'Bihar', ranchi: 'Jharkhand',
    lucknow: 'Uttar Pradesh'
  };

  zoneOptions       = [{ label: 'North', value: 'North' }, { label: 'South', value: 'South' }];
  PMOptions         = [{ label: 'PM 1', value: 'PM 1' }, { label: 'PM 2', value: 'PM 2' }, { label: 'PM 3', value: 'PM 3' }, { label: 'PM 4', value: 'PM 4' }];
  BDOptions         = [{ label: 'BD 1', value: 'BD 1' }, { label: 'BD 2', value: 'BD 2' }, { label: 'BD 3', value: 'BD 3' }, { label: 'BD 4', value: 'BD 4' }];
  solutionOptions   = [{ label: 'Solution Manager 1', value: 'Solution Manager 1' }, { label: 'Solution Manager 2', value: 'Solution Manager 2' }, { label: 'Solution Manager 3', value: 'Solution Manager 3' }];
  stateHeadOptions  = [{ label: 'State Head 1', value: 'State Head 1' }, { label: 'State Head 2', value: 'State Head 2' }];
  siteManagerOptions= [{ label: 'Site Manager 1', value: 'Site Manager 1' }, { label: 'Site Manager 2', value: 'Site Manager 2' }];
  multipleSPVOptions= [{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }];

  // ── Step 2: SPV/WTG options ───────────────────────────────────────────────
  WTGOptions     = [
    { label: 'EN132', value: 'EN132' }, { label: 'EN156', value: 'EN156' },
    { label: 'EN182', value: 'EN182' }, { label: 'EN156(NS)', value: 'EN156(NS)' },
    { label: 'EN182(NS)', value: 'EN182(NS)' }
  ];
  towerOptions   = [
    { label: '120HH-304T', value: '120HH-304T' }, { label: '140HH-474T', value: '140HH-474T' },
    { label: '130HH-420T', value: '130HH-420T' }, { label: '140HH-353T', value: '140HH-353T' }
  ];
  gridOptions    = [{ label: 'STU', value: 'STU' }, { label: 'CTU', value: 'CTU' }];
  ppaOptions     = [{ label: 'Auction', value: 'Auction' }, { label: 'C&I', value: 'C&I' }];

  // Capacity options driven by WTG type (same mapping as sale-demand)
  private wtgCapacityMap: Record<string, { label: string; value: string }[]> = {
    EN132:       [{ label: '2.4 MW', value: '2.4' }, { label: '2.5 MW', value: '2.5' }],
    EN156:       [{ label: '3.3 MW', value: '3.3' }, { label: '3.5 MW', value: '3.5' }],
    EN182:       [{ label: '5.0 MW', value: '5.0' }, { label: '5.5 MW', value: '5.5' }],
    'EN156(NS)': [{ label: '3.3 MW', value: '3.3' }, { label: '3.5 MW', value: '3.5' }],
    'EN182(NS)': [{ label: '5.0 MW', value: '5.0' }, { label: '5.5 MW', value: '5.5' }],
  };

  // ── Step 2: SPV entries (replaces FormArray table) ────────────────────────
  spvEntries: SpvEntry[] = [];
  spvOptions: { label: string; value: string }[] = [];  // generated from projectQTY
  overallTotalCapacity = 0;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}

  // ─── Step 1 ───────────────────────────────────────────────────────────────

  addNewProject(): void {
    this.addProjectDialog = true;
  }

  onCityChange(val: any): void {
    const city = val.target.value.trim().toLowerCase();
    if (this.cityStateMap[city]) {
      this.selectedState = this.cityStateMap[city];
      this.diableStateDD = true;
    } else {
      this.selectedState = '';
      this.diableStateDD = false;
    }
  }

  submitProject(): void {
    // Build spvOptions from projectQTY
    this.spvOptions = [];
    for (let i = 1; i <= this.projectQTY; i++) {
      this.spvOptions.push({ label: `SPV ${i}`, value: `SPV ${i}` });
    }

    // Init with one SPV block
    this.spvEntries = [];
    this.addSpvEntry();

    this.projectHeader = 'Step 2: Add SPV Details';
    this.isProjectCreated = true;
    this.step1 = false;
  }

  // ─── Step 2: SPV management ───────────────────────────────────────────────

  addSpvEntry(): void {
    this.spvEntries.push({
      id: nextId(),
      spv: '',
      wtgConfigs: [this.emptyConfig()]
    });
  }

  removeSpvEntry(spvId: number): void {
    this.spvEntries = this.spvEntries.filter(s => s.id !== spvId);
    this.recalcOverallCapacity();
  }

  /** Returns spvOptions with already-used SPVs marked disabled */
  getSpvOpts(myId: number): { label: string; value: string; disabled?: boolean }[] {
    const used = this.spvEntries.filter(s => s.id !== myId && s.spv).map(s => s.spv);
    return this.spvOptions.map(opt => ({
      ...opt,
      label: used.includes(opt.value) ? `${opt.label} (used)` : opt.label,
      disabled: used.includes(opt.value)
    }));
  }

  // ─── Step 2: WTG Config management ───────────────────────────────────────

  emptyConfig(): WtgConfig {
    return {
      id: nextId(),
      wtgType: [],
      capacity: null,
      towerType: '',
      gridConnectivity: '',
      ppaType: '',
      wtgQty: null,
      shipAddress: '',
      monthly: Array(12).fill(null),
      startMonth: currentMonthLabel()
    };
  }

  addWtgConfig(spv: SpvEntry): void {
    spv.wtgConfigs.push(this.emptyConfig());
  }

  removeWtgConfig(spv: SpvEntry, cfgId: number): void {
    spv.wtgConfigs = spv.wtgConfigs.filter(c => c.id !== cfgId);
    this.recalcOverallCapacity();
  }

  onWtgTypeChange(cfg: WtgConfig): void {
    cfg.capacity = null;
    cfg.towerType = '';
  }

  /** Capacity options based on the first selected WTG type */
  getCapacityOpts(cfg: WtgConfig): { label: string; value: string }[] {
    const firstType = cfg.wtgType?.[0];
    return firstType ? (this.wtgCapacityMap[firstType] ?? []) : [];
  }

  // ─── Step 2: Monthly distribution ────────────────────────────────────────

  getMonthLabels(cfg: WtgConfig): string[] {
    return generateMonthLabels(cfg.startMonth, 12);
  }

  monthTotal(cfg: WtgConfig): any {
    return cfg.monthly.reduce((s:any, v) => s + (v ?? 0), 0);
  }

  remainingQty(cfg: WtgConfig): number {
    return (cfg.wtgQty ?? 0) - this.monthTotal(cfg);
  }

  onMonthlyInput(cfg: WtgConfig, idx: number, raw: number | null): void {
    const val = raw ?? 0;
    const limit = cfg.wtgQty ?? 0;
    const restSum:any = cfg.monthly.reduce((s:any, v, i) => i !== idx ? s + (v ?? 0) : s, 0);
    if (restSum + val > limit) {
      cfg.monthly[idx] = Math.max(0, limit - restSum);
      this.messageService.add({
        severity: 'warn', summary: 'Qty Exceeded',
        detail: `Max allowed is ${limit}. Capped to ${cfg.monthly[idx]}.`, life: 3000
      });
    } else {
      cfg.monthly[idx] = val;
    }
    this.recalcOverallCapacity();
  }

  resetMonthly(cfg: WtgConfig): void {
    cfg.monthly = Array(12).fill(null);
    this.recalcOverallCapacity();
  }

  hasMonthlyTable(cfg: WtgConfig): boolean {
    return (cfg.wtgQty ?? 0) > 0;
  }

  // ─── Step 2: Totals ───────────────────────────────────────────────────────

  recalcOverallCapacity(): void {
    let total = 0;
    for (const spv of this.spvEntries) {
      for (const cfg of spv.wtgConfigs) {
        total += (Number(cfg.capacity) || 0) * (cfg.wtgQty ?? 0);
      }
    }
    this.overallTotalCapacity = total;
  }

  onQtyChange(cfg: WtgConfig): void {
    this.resetMonthly(cfg);
    this.recalcOverallCapacity();
  }

  onCapacityChange(cfg: WtgConfig): void {
    this.recalcOverallCapacity();
  }

  // ─── Step 2: Save ─────────────────────────────────────────────────────────

  saveSPV(): void {
    console.log('SPV Entries:', JSON.stringify(this.spvEntries, null, 2));
    console.log('Overall Total Capacity:', this.overallTotalCapacity);
    this.messageService.add({
      severity: 'success', summary: 'Success',
      detail: 'Project Created Successfully', life: 3000
    });
  }

  // ─── Trackers ─────────────────────────────────────────────────────────────
  trackById(_: number, item: { id: number }) { return item.id; }
  trackByIdx(i: number) { return i; }
}
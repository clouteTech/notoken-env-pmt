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
import { Apiservice } from '../service/apiservice';

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface WtgConfig {
  id: number;
  wtgType: string[];       // multiselect → array
  capacity: string | null;
  towerType: string;
  bladeTypeId: string;
  gridConnectivity: string;
  ppaType: string;
  wtgQty: number | null;
  shipAddress: string;
  monthly: (number | null)[];
  startMonth: string;
}

export interface SpvEntry {
  id: number;
  spv: any;
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
  projectList:any; /* = [
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
  ]; */

  // ── Dialog / step state ───────────────────────────────────────────────────
  addProjectDialog = false;
  projectHeader: string = 'Step 1: Create Project';
  isProjectCreated = false;
  step1 = true;

  // ── Step 1 form fields ────────────────────────────────────────────────────
  pCode = '';
  customerName = '';
  cityInfo = '';
  selectedState: any = '';
  selectedZone = '';
  projectQTY: number = 0;
  projectTotalCapacity = '';
  selectedProjectManager = '';
  selectedBDManager = '';
  selectedSolutionManager = '';
  selectedStateHead = '';
  selectedSiteManager = '';
  selectedMultpleSPV = 'Yes';
  towerScopeChecked = true;
  diableStateDD = false;
  ContractStatusValue = '';
  projectTermValue = '';
  projectProbalityValue = '';


  // ── Step 1 date fields ────────────────────────────────────────────────────
  dateAnchorCage: Date | null = null;
  dateComponentSupply: Date | null = null;
  dateSiteActivity: Date | null = null;
  dateCommissioning: Date | null = null;
  dateContractualCOD: Date | null = null;
  dateExpectedCOD: Date | null = null;
  dateTermSheet: Date | null = null;
  dateAdvance1: Date | null = null;
  dateAdvance2: Date | null = null;
  dateAdvance3: Date | null = null;
  dateBGRelease: Date | null = null;
  dateSupplyContract: Date | null = null;
  dateServiceSign: Date | null = null;
  dateLTSASign: Date | null = null;

  // ── Step 1 dropdown options ───────────────────────────────────────────────
  states = [
    /* { label: 'Andhra Pradesh', value: '1' },
    { label: 'Arunachal Pradesh', value: '2' },
    { label: 'Assam', value: '3' },
    { label: 'Bihar', value: '4' },
    { label: 'Chhattisgarh', value: '5' },
    { label: 'Goa', value: '6' },
    { label: 'Gujarat', value: '7' },
    { label: 'Haryana', value: '8' },
    { label: 'Himachal Pradesh', value: '9' },
    { label: 'Jharkhand', value: '10' },
    { label: 'Karnataka', value: '11' },
    { label: 'Kerala', value: '12' },
    { label: 'Madhya Pradesh', value: '13' },
    { label: 'Maharashtra', value: '14' },
    { label: 'Manipur', value: '15' },
    { label: 'Meghalaya', value: '16' },
    { label: 'Mizoram', value: '17' },
    { label: 'Nagaland', value: '18' },
    { label: 'Odisha', value: '19' },
    { label: 'Punjab', value: '20' },
    { label: 'Rajasthan', value: '21' },
    { label: 'Sikkim', value: '22' },
    { label: 'Tamil Nadu', value: '23' },
    { label: 'Telangana', value: '24' },
    { label: 'Tripura', value: '25' },
    { label: 'Uttar Pradesh', value: '26' },
    { label: 'Uttarakhand', value: '27' },
    { label: 'West Bengal', value: '28' },
    { label: 'Delhi', value: '29' } */
  ];

  cityStateMap: { [key: string]: string } = {
    chennai: 'Tamil Nadu', coimbatore: 'Tamil Nadu', salem: 'Tamil Nadu',
    hyderabad: 'Telangana', bengaluru: 'Karnataka', mysuru: 'Karnataka',
    mumbai: 'Maharashtra', pune: 'Maharashtra', delhi: 'Delhi',
    kolkata: 'West Bengal', patna: 'Bihar', ranchi: 'Jharkhand',
    lucknow: 'Uttar Pradesh'
  };

  zoneOptions       = [/* [{ label: 'North', value: '1' }, { label: 'South', value: '2' } */];
  PMOptions         = [/* { label: 'PM 1', value: '1' }, { label: 'PM 2', value: '2' }, { label: 'PM 3', value: '3' }, { label: 'PM 4', value: '4' } */];
  BDOptions         = [{ label: 'BD 1', value: '1' }, { label: 'BD 2', value: '2' }, { label: 'BD 3', value: '3' }, { label: 'BD 4', value: '4' }];
  solutionOptions   = [{ label: 'Solution Manager 1', value: '1' }, { label: 'Solution Manager 2', value: '2' }, { label: 'Solution Manager 3', value: '3' }];
  stateHeadOptions  = [{ label: 'State Head 1', value: '1' }, { label: 'State Head 2', value: '2' }];
  siteManagerOptions= [{ label: 'Site Manager 1', value: '1' }, { label: 'Site Manager 2', value: '2' }];
  multipleSPVOptions= [{ label: 'Yes', value: '1' }, { label: 'No', value: '2' }];
  projectProbality= [{ label: 'P-50', value: 'P50' }, { label: 'P-75', value: 'P75' }, { label: 'P-90', value: 'P90' }, { label: 'P-100', value: 'P100' }];
  projectTerm= [{ label: 'DAP', value: 'DAP' }, { label: 'DAP + Tower', value: 'DAP_TOWER' }, { label: 'EXW', value: 'EXW' }, { label: 'EXW + Tower', value: 'EXW_TOWER' }];
  CustomerNameList= [/* { label: 'Customer 1', value: '1' }, { label: 'Customer 2', value: '2' }, { label: 'Customer 3', value: '3' }, { label: 'Customer 4', value: '4' } */];

  // ── Step 2: SPV/WTG options ───────────────────────────────────────────────
  WTGOptions     = [
    /* { label: 'EN132', value: '132' }, { label: 'EN156', value: '156' },
    { label: 'EN182', value: '182' }, { label: 'EN156(NS)', value: '156' },
    { label: 'EN182(NS)', value: '182' } */
  ];
   getCapacityOpts     = [
  /*   { label: '2.5', value: '1' }, { label: '3.5', value: '2' },
    { label: '5', value: '5' } */
  ];
  towerOptions   = [
    /* { label: '120HH-304T', value: '1' }, { label: '140HH-474T', value: '2' },
    { label: '130HH-420T', value: '3' }, { label: '140HH-353T', value: '4' }*/
  ]; 
  bladeOptions   = [
    /* { label: 'Blade 1', value: '1' }, { label: 'Blade 2', value: '2' }, */
  ];
  gridOptions    = [/* { label: 'STU', value: '1' }, { label: 'CTU', value: '2' } */];
  ppaOptions     = [/* { label: 'Auction', value: '1' }, { label: 'C&I', value: '2' } */];

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
  spvOptions: { label: string; value: any }[] = [];
  spvOptsList: { label: string; value: any; disabled: boolean }[][] = [];
  overallTotalCapacity = 0;

  constructor(private messageService: MessageService,private apiService:Apiservice) {}

  ngOnInit(): void {
    this.getProjectList();
    this.getZoneList();
    this.getWTGTypeList();
    this.getCapacityList();
    this.getTowerTypeList();
    this.getBladeTypeList();
    this.getGridInfoList();
    this.getPPAInfoList();
    this.getCustomerList();
    this.getClusterList();
    this.getManagerList();
  }

  getProjectList(){
    try{
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
      this.apiService.projectSearch(data)
      .subscribe({
        next:(res)=>{
          console.log(res);
          this.projectList = res.data.content
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getZoneList(){
    try{
      let data = {}
      this.apiService.zoneInfo(data)
      .subscribe({
        next:(res)=>{
          this.zoneOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

    getWTGTypeList(){
    try{
      let data = {}
      this.apiService.wtgTypeInfo(data)
      .subscribe({
        next:(res)=>{
          this.WTGOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

     getCapacityList(){
    try{
      let data = {}
      this.apiService.capacityInfo(data)
      .subscribe({
        next:(res)=>{
          this.getCapacityOpts = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getTowerTypeList(){
    try{
      let data = {}
      this.apiService.towerTypeInfo(data)
      .subscribe({
        next:(res)=>{
          this.towerOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getBladeTypeList(){
    try{
      let data = {}
      this.apiService.bladeTypeInfo(data)
      .subscribe({
        next:(res)=>{
          this.bladeOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getGridInfoList(){
    try{
      let data = {}
      this.apiService.gridConnectivityInfo(data)
      .subscribe({
        next:(res)=>{
          this.gridOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getPPAInfoList(){
    try{
      let data = {}
      this.apiService.ppaTypeInfo(data)
      .subscribe({
        next:(res)=>{
          this.ppaOptions = res.data
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getCustomerList(){
    try{
      let data = {}
      this.apiService.customerInfo(data)
      .subscribe({
        next:(res)=>{
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.CustomerNameList = filt
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getClusterList(){
    try{
      let data = {}
      this.apiService.clusterInfo(data)
      .subscribe({
        next:(res)=>{
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.states = filt
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  getManagerList(){
    try{
      let data = {}
      this.apiService.companyUserInfo(data)
      .subscribe({
        next:(res)=>{
          var filt = res.data.filter((itm:any)=>{
            return itm.status == true
          })
          this.PMOptions = filt
        },error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
        }
      })

    }catch(e){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

getSPVList(addFirst = false): void {
  try {
    const data = { customerId: this.customerName || 1 };
    this.apiService.customerSpvInfo(data).subscribe({
      next: (res) => {
        console.log('SPV raw data:', res.data); // <-- check console for real property names
        const filt = res.data.filter((itm: any) => itm.status == true);
        this.spvOptions = filt.map((itm: any) => ({
          label: itm.spvName,
          value: itm.customerSpvId       // if this logs as undefined, change to the real key
        }));
        console.log('spvOptions built:', this.spvOptions);
        if (addFirst) this.addSpvEntry(); else this.buildOptsList();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.detail || 'Error loading SPV list' });
        if (addFirst) this.addSpvEntry();
      }
    });
  } catch (e) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
  }
}

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

  validateStep1() {

  const requiredFields = [
    { key: this.pCode, name: 'Project Code' },
    { key: this.customerName, name: 'Customer' },
    { key: this.cityInfo, name: 'City Info' },
    { key: this.selectedState, name: 'State' },
    { key: this.selectedZone, name: 'Zone' },
    { key: this.projectQTY, name: 'Project QTY' },
    { key: this.projectTotalCapacity, name: 'Project Total Capacity' },
    { key: this.projectProbalityValue, name: 'Project Probability' },
    { key: this.ContractStatusValue, name: 'Contract Status' },
    { key: this.projectTermValue, name: 'Project Term' },

    { key: this.selectedProjectManager, name: 'Project Manager' },
    { key: this.selectedBDManager, name: 'BD Manager' },
    { key: this.selectedSolutionManager, name: 'Solution Manager' },
    { key: this.selectedStateHead, name: 'State Head' },
    { key: this.selectedSiteManager, name: 'Site Manager' }
  ];

  const invalidField = requiredFields.find(field =>
    field.key === null ||
    field.key === undefined ||
    field.key === '' ||
    (typeof field.key === 'string' && field.key.trim() === '')
  );

  if (invalidField) {

    this.messageService.add({
      severity: 'warn',
      summary: 'Required',
      detail: `${invalidField.name} is required`
    });

    return;
  }

  this.submitProject();
}

  submitProject(): void {
    this.spvEntries = [];
    this.spvOptions = [];
    this.projectHeader = 'Step 2: Add SPV Details';
    this.isProjectCreated = true;
    this.step1 = false;
    this.getSPVList(true);
  }

  // ─── Step 2: SPV management ───────────────────────────────────────────────

  addSpvEntry(): void {
    this.spvEntries.push({ id: nextId(), spv: null, wtgConfigs: [this.emptyConfig()] });
    this.buildOptsList();
  }

onSpvSelect(entry: SpvEntry, value: any): void {
  entry.spv = value;
  this.buildOptsList();
  // Force new array reference so Angular re-renders the dropdown
  this.spvOptsList = [...this.spvOptsList];
}

buildOptsList(): void {
  const allSelected = this.spvEntries
    .filter(s => s.spv != null)
    .map(s => String(s.spv));           // convert to string for safe comparison

  this.spvOptsList = this.spvEntries.map(entry => {
    return this.spvOptions.map(opt => ({
      ...opt,
      disabled: allSelected.includes(String(opt.value))   // taken by ANY row...
               && String(opt.value) !== String(entry.spv) // ...but not by THIS row
    }));
  });
}

  removeSpvEntry(spvId: number): void {
    this.spvEntries = this.spvEntries.filter(s => s.id !== spvId);
    this.buildOptsList();
    this.recalcOverallCapacity();
  }

  // ─── Step 2: WTG Config management ───────────────────────────────────────

  emptyConfig(): WtgConfig {
    return {
      id: nextId(),
      wtgType: [],
      capacity: null,
      towerType: '',
      bladeTypeId: '',
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
  /* getCapacityOpts(cfg: WtgConfig): { label: string; value: string }[] {
    const firstType = cfg.wtgType?.[0];
    return firstType ? (this.wtgCapacityMap[firstType] ?? []) : [];
  } */

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
    // Only reset monthly distribution when a valid positive qty is committed
    if (cfg.wtgQty != null && cfg.wtgQty > 0) {
      this.resetMonthly(cfg);
    }
    this.recalcOverallCapacity();
  }

  onQtyBlur(cfg: WtgConfig): void {
    // If user clears the field, keep null (do not snap to 0)
    if (cfg.wtgQty === 0 || cfg.wtgQty == null) {
      cfg.wtgQty = null;
    } else if (cfg.wtgQty > 0) {
      this.resetMonthly(cfg);
    }
    this.recalcOverallCapacity();
  }

  onCapacityChange(cfg: WtgConfig): void {
    this.recalcOverallCapacity();
  }

  // ─── Step 2: Save ─────────────────────────────────────────────────────────

  saveSPV(): void {
    try{
      console.log('SPV Entries:', JSON.stringify(this.spvEntries, null, 2));
    console.log('Overall Total Capacity:', this.overallTotalCapacity);

    var spvDetails:any = []
    this.spvEntries.forEach((spvEntry: any) => {
      spvDetails.push({
        projectSpvId:  0, //spvEntry.spv ||
        customerSpvId: 1,
        wtgConfigurations: spvEntry.wtgConfigs.map((cfg: any) => ({
          wtgConfigId: 0,
          wtgTypeId: cfg.wtgType?.[0] || 0,
          capacityId: cfg.capacity || 0,
          towerTypeId: cfg.towerType || 0,
          bladeTypeId: cfg.bladeTypeId || 0,
          gridConnectivityId: cfg.gridConnectivity || 0,
          ppaTypeId: cfg.ppaType || 0,
          wtgQty: cfg.wtgQty || 0
        }))
      });

    });
    var filterClusterId:any = []
     if(this.selectedState){
      filterClusterId = this.states.filter((itm:any)=>{
        return itm.label == this.selectedState
      })
    }
    /* if(filterClusterId){
      var clusId = filterClusterId[0].value
    } */
    let data = {
      "projectCode": this.pCode,
      "projectDescription": "ASD",
      "customerId": this.customerName,
      "city": this.cityInfo,
      "country": this.selectedState,
      "clusterId": this.selectedState,
      "clusterHeadId": this.selectedStateHead,
      "zoneId": this.selectedZone,
      "projectManagerId": this.selectedProjectManager,
      "bdManagerId": this.selectedBDManager,
      "solutionManagerId": this.selectedSolutionManager,
      "siteManagerId": this.selectedSiteManager,
      "projectTerm": this.projectTermValue,
      "probability": this.projectProbalityValue,
      "contractStatus": this.ContractStatusValue,
      "projectSpvDetails":spvDetails
    }
    console.log(data);

    this.apiService.projectCreate(data)
    .subscribe({
      next:(res)=>{
        this.addProjectDialog = false;
        this.getProjectList();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project Created Successfully' });

      },error:(err)=>{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
      }
    })
    }catch(e){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
    

    
  }

  // ─── Trackers ─────────────────────────────────────────────────────────────
  trackById(_: number, item: { id: number }) { return item.id; }
  trackByIdx(i: number) { return i; }
}
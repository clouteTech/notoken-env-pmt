import { Component } from '@angular/core';
import { Shared } from '../shared/services/shared';
import { MessageService } from 'primeng/api';

// ─── Domain Types ───────────────────────────────────────────────────────────
 
export interface WtgConfig {
  id: number;
  wtgType: string;
  capacity: number | null;
  towerType: string;
  gridConnectivity: string;
  ppaType: string;
  wtgQty: number | null;
  // 12 monthly buckets; index 0 = start month
  monthly: (number | null)[];
  startMonth: string; // e.g. "May 2026"
}
 
export interface SpvEntry {
  id: number;
  spv: string;
  wtgConfigs: WtgConfig[];
}
 
export interface SaleDemandForm {
  // Accordion 1
  tabs: string;
  customer: string;
  state: string;
  bdManager: string;
  projectName: string;
  projectTerms: string;
  // Accordion 2 — dynamic SPV list
  spvEntries: SpvEntry[];
}
 
// ─── Master Data ─────────────────────────────────────────────────────────────
 
const TABS_OPTIONS      = ['P50', 'P90', 'P100'];
const CUSTOMER_OPTIONS  = ['ReNew', 'Adani', 'Greenko', 'NTPC', 'JSW'];
const BD_MANAGER_OPTIONS = ['Ravi Kumar', 'Sunita Sharma', 'Ajay Patel', 'Meena Joshi', 'Vikram Singh'];
const PROJECT_TERMS_OPTIONS = ['DAP', 'DAP + Tower', 'EXW', 'EXW + Tower'];
const SPV_OPTIONS       = ['SPV 1', 'SPV 2', 'SPV 3', 'SPV 4', 'SPV 5', 'SPV A', 'SPV B', 'SPV C'];
const WTG_TYPE_OPTIONS  = ['EN132', 'EN156', 'EN182'];
const TOWER_TYPE_OPTIONS = ['120HH-304T', '130HH-420T', '140HH-474T', '140HH-353T'];
const GRID_CONN_OPTIONS = ['STU', 'CTU'];
const PPA_TYPE_OPTIONS  = ['Auction', 'C&I'];
 
const CUSTOMER_STATES: Record<string, string[]> = {
  ReNew:   ['Rajasthan', 'Gujarat', 'Andhra Pradesh'],
  Adani:   ['Gujarat', 'Maharashtra', 'Tamil Nadu'],
  Greenko: ['Andhra Pradesh', 'Karnataka', 'Telangana'],
  NTPC:    ['Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
  JSW:     ['Karnataka', 'Odisha', 'Jharkhand'],
};
 
const WTG_CAPACITY_MAP: Record<string, number[]> = {
  EN132: [2.4, 2.5],
  EN156: [3.3, 3.5],
  EN182: [5.0, 5.5],
};
 
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
  selector: 'app-sale-demand',
  imports: [Shared],
  templateUrl: './sale-demand.html',
  styleUrl: './sale-demand.css',
})
export class SaleDemand {
  // ── Option lists ──────────────────────────────────────────────────────────
  tabsOpts      = TABS_OPTIONS.map(v => ({ label: v, value: v }));
  customerOpts  = CUSTOMER_OPTIONS.map(v => ({ label: v, value: v }));
  bdManagerOpts = BD_MANAGER_OPTIONS.map(v => ({ label: v, value: v }));
  projectTermsOpts = PROJECT_TERMS_OPTIONS.map(v => ({ label: v, value: v }));
  spvOpts       = SPV_OPTIONS.map(v => ({ label: v, value: v }));
  wtgTypeOpts   = WTG_TYPE_OPTIONS.map(v => ({ label: v, value: v }));
  towerTypeOpts = TOWER_TYPE_OPTIONS.map(v => ({ label: v, value: v }));
  gridConnOpts  = GRID_CONN_OPTIONS.map(v => ({ label: v, value: v }));
  ppaTypeOpts   = PPA_TYPE_OPTIONS.map(v => ({ label: v, value: v }));
 
  // ── Form state ────────────────────────────────────────────────────────────
  form: SaleDemandForm = {
    tabs: '',
    customer: '',
    state: '',
    bdManager: '',
    projectName: '',
    projectTerms: '',
    spvEntries: [],
  };
 
  stateOpts: { label: string; value: string }[] = [];
 
  // ── Preview dialog ────────────────────────────────────────────────────────
  previewVisible = false;
 
  openPreview(): void { this.previewVisible = true; }
  closePreview(): void { this.previewVisible = false; }
 
  constructor(private msgSvc: MessageService) {}
 
  ngOnInit(): void {
    this.addSpvEntry(); // start with one SPV block
  }
 
  // ── Accordion 1 ───────────────────────────────────────────────────────────
 
  onCustomerChange(): void {
    const states = CUSTOMER_STATES[this.form.customer] ?? [];
    this.stateOpts = states.map(s => ({ label: s, value: s }));
    // Auto-select the first state for this customer
    this.form.state = states.length > 0 ? states[0] : '';
  }
 
  // ── Accordion 2: SPV management ──────────────────────────────────────────
 
  addSpvEntry(): void {
    this.form.spvEntries.push({
      id: nextId(),
      spv: '',
      wtgConfigs: [this.emptyConfig()],
    });
  }
 
  removeSpvEntry(spvId: number): void {
    this.form.spvEntries = this.form.spvEntries.filter(s => s.id !== spvId);
  }
 
  getSpvOpts(myId: number): { label: string; value: string; disabled?: boolean }[] {
    const usedSpvs = this.form.spvEntries
      .filter(s => s.id !== myId && s.spv)
      .map(s => s.spv);
    return SPV_OPTIONS.map(v => ({
      label: usedSpvs.includes(v) ? `${v} (used)` : v,
      value: v,
      disabled: usedSpvs.includes(v),
    }));
  }
 
  // ── WTG Config management ─────────────────────────────────────────────────
 
  emptyConfig(): WtgConfig {
    return {
      id: nextId(),
      wtgType: '',
      capacity: null,
      towerType: '',
      gridConnectivity: '',
      ppaType: '',
      wtgQty: null,
      monthly: Array(12).fill(null),
      startMonth: currentMonthLabel(),
    };
  }
 
  addWtgConfig(spv: SpvEntry): void {
    spv.wtgConfigs.push(this.emptyConfig());
  }
 
  removeWtgConfig(spv: SpvEntry, cfgId: number): void {
    spv.wtgConfigs = spv.wtgConfigs.filter(c => c.id !== cfgId);
  }
 
  /** Get WTG type options for a config, disabling already-used types in the same SPV */
  getWtgTypeOpts(spv: SpvEntry, myCfgId: number): { label: string; value: string; disabled?: boolean }[] {
    const usedTypes = spv.wtgConfigs
      .filter(c => c.id !== myCfgId && c.wtgType)
      .map(c => c.wtgType);
    return WTG_TYPE_OPTIONS.map(v => ({
      label: usedTypes.includes(v) ? `${v} (used)` : v,
      value: v,
      disabled: usedTypes.includes(v),
    }));
  }
 
  onWtgTypeChange(cfg: WtgConfig): void {
    cfg.capacity = null;
    cfg.towerType = '';
  }
 
  getCapacityOpts(wtgType: string): { label: string; value: number }[] {
    return (WTG_CAPACITY_MAP[wtgType] ?? []).map(v => ({ label: `${v} MW`, value: v }));
  }
 
  // ── Monthly distribution ──────────────────────────────────────────────────
 
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
      this.msgSvc.add({
        severity: 'warn',
        summary: 'Qty Exceeded',
        detail: `Max allowed is ${limit}. Capped to ${cfg.monthly[idx]}.`,
        life: 3000,
      });
    } else {
      cfg.monthly[idx] = val;
    }
  }
 
  resetMonthly(cfg: WtgConfig): void {
    cfg.monthly = Array(12).fill(null);
  }
 
  hasMonthlyTable(cfg: WtgConfig): boolean {
    return (cfg.wtgQty ?? 0) > 0;
  }
 
  // ── Validation & Submit ───────────────────────────────────────────────────
 
  get accordion1Valid(): boolean {
    const f = this.form;
    return !!(f.tabs && f.customer && f.state && f.bdManager && f.projectName && f.projectTerms);
  }
 
  get accordion2Valid(): boolean {
    return this.form.spvEntries.length > 0 &&
      this.form.spvEntries.every(s =>
        s.spv && s.wtgConfigs.length > 0 &&
        s.wtgConfigs.every(c => c.wtgType && c.capacity && c.towerType && c.gridConnectivity && c.ppaType && (c.wtgQty ?? 0) > 0)
      );
  }
 
  get canSubmit(): boolean { return this.accordion1Valid && this.accordion2Valid; }
 
  submit(): void {
    if (!this.canSubmit) {
      this.msgSvc.add({ severity: 'error', summary: 'Incomplete', detail: 'Please fill all required fields.', life: 4000 });
      return;
    }
    this.previewVisible = false;
    this.msgSvc.add({ severity: 'success', summary: 'Submitted', detail: 'Sale Demand saved successfully!', life: 3000 });
  }
 
  trackById(_: number, item: { id: number }) { return item.id; }
  trackByIdx(i: number) { return i; }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DataService, ProjectEntry, WtgRow, CUSTOMERS, YEARS } from '../data.service';

// PrimeNG v20
import { TableModule }       from 'primeng/table';
import { SelectModule }      from 'primeng/select';
import { ButtonModule }      from 'primeng/button';
import { InputTextModule }   from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule }      from 'primeng/dialog';
import { ToastModule }       from 'primeng/toast';
import { TagModule }         from 'primeng/tag';
import { CardModule }        from 'primeng/card';
import { MessageService }    from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DividerModule }     from 'primeng/divider';
import { Apiservice } from '../service/apiservice';

@Component({
  selector: 'app-demand-plan',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    TableModule, SelectModule, ButtonModule,
    InputTextModule, InputNumberModule,
    DialogModule, ToastModule, TagModule,
    CardModule, ConfirmDialogModule, DividerModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './demand-plan.component.html',
  styleUrls: ['./demand-plan.component.scss']
})
export class DemandPlanComponent implements OnInit {

  year     = '2026';
  customer = '';
  projects: ProjectEntry[] = [];
  private uidSeed = 0;

  selectedCustomerId = 0;
  selectedProjectId = 0;

  customerInfoList: any[] = [];
  customerProjectList: any[] = [];
  projectSpvList: any[] = [];
  projectSpvWtgDetailList: any[] = [];

  // p-select options
  yearOptions     = YEARS.map(y => ({ label: y, value: y }));
  // customerOptions = CUSTOMERS.map(c => ({ label: c, value: c }));

  // Summary dialog
  summaryVisible = false;

  private fb = inject(FormBuilder);

  constructor(private ds: DataService, private msgSvc: MessageService, private apiService: Apiservice) {}

  yearlyDemandPlanForm = this.fb.group({
    planYear: [],
    customerId: [],
    projects: this.fb.array([])
  })

  get projectsArray(): FormArray{
    return this.yearlyDemandPlanForm.get('projects') as FormArray;
  }

  createProjectForm(project?: any): FormGroup{
    const spvs = this.fb.array(
      (project?.spvs ?? []).map((spv: any) => 
        this.createSpvForm(spv)
      )
    );

    return this.fb.group({
      projectId: [project?.projectId ?? null],
      spvs: spvs
    })
  }

  createSpvForm(spv?: any): FormGroup{
    const wtgs = this.fb.array(
      (spv?.wtgs ?? []).map((wtg: any) => 
        this.createWtgForm(wtg)
      )
    );

    return this.fb.group({
      spvId: [spv?.spvId ?? null],
      wtgs: wtgs
    })
  }

  createWtgForm(wtg?: any): FormGroup{
    return this.fb.group({
      wtgConfigId: [wtg?.wtgConfigId ?? null],
      wtgType: [wtg?.wtgType ?? null],
      capMw: [wtg?.capMw ?? null],
      towerType: [wtg?.towerType ?? null],
      bladeType: [wtg?.bladeType ?? null],
      totalQty: [wtg?.totalQty ?? 0],
      janQty: [wtg?.janQty ?? 0],
      febQty: [wtg?.febQty ?? 0],
      marQty: [wtg?.marQty ?? 0],
      aprQty: [wtg?.aprQty ?? 0],
      mayQty: [wtg?.mayQty ?? 0],
      junQty: [wtg?.junQty ?? 0],
      julQty: [wtg?.julQty ?? 0],
      augQty: [wtg?.augQty ?? 0],
      sepQty: [wtg?.sepQty ?? 0],
      octQty: [wtg?.octQty ?? 0],
      novQty: [wtg?.novQty ?? 0],
      decQty: [wtg?.decQty ?? 0]
    })
  }

  ngOnInit() {
    this.fetchAllCustomer();
  }

  fetchAllCustomer(){
    try {
      this.apiService.customerInfo('').subscribe({
        next: val => {
          console.log(val);
          this.customerInfoList = val.data;
        },
        error: err => {
          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);
      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchProjectsByCustomer(){
    try {
      const data = {
        customerId: this.selectedCustomerId
      }
      this.apiService.fetchProjectsByCustomer(data).subscribe({
        next: val => {
          console.log(val);
          this.customerProjectList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchSPVsByProject(){
    try {
      const data = {
        projectId: this.selectedProjectId
      }
      console.log(data);

      this.apiService.fetchSPVsByProject(data).subscribe({
        next: val => {
          console.log(val);
          this.projectSpvList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  fetchWtgDetailsByProjectSPV(spvId: any){
    try {
      const data = {
        projectId: this.selectedProjectId,
        spvId: spvId
      }

      console.log(data);

      this.apiService.fetchWtgDetailsByProjectSPV(data).subscribe({
        next: val => {
          console.log(val);
          this.projectSpvWtgDetailList = val.data;
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.msgSvc.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.msgSvc.add({ severity: 'error', summary: 'Error', detail: 'Please Try Again' });
    }
  }

  get filtersReady(): boolean { return !!this.year && !!this.customer; }
  get hasData(): boolean { return this.projects.some(p => p.spv && p.rows.length > 0); }

  displayIndex(uid: number): number {
    return this.projects.findIndex(p => p.uid === uid) + 1;
  }

  getProjectOptions(): { label: string; value: string }[] {
    return this.ds.getProjects(this.customer).map(c => ({ label: c, value: c }));
  }

  getSpvOptions(projectCode: string, myUid: number): { label: string; value: string; disabled?: boolean }[] {
    return this.ds.getSPVs(projectCode).map(spv => ({
      label: this.isSpvDisabled(spv, projectCode, myUid) ? `${spv} (used)` : spv,
      value: spv,
      disabled: this.isSpvDisabled(spv, projectCode, myUid)
    }));
  }

  isSpvDisabled(spv: string, projectCode: string, myUid: number): boolean {
    if (!projectCode) return false;
    return this.projects
      .filter(p => p.uid !== myUid && p.projectCode === projectCode && !!p.spv)
      .map(p => p.spv)
      .includes(spv);
  }

  getMonthLabels(): string[] { return this.ds.getMonthLabels(this.year); }

  get badgeSeverity(): 'success' | 'secondary' {
    return this.projects.some(p => p.spv) ? 'success' : 'secondary';
  }
  get badgeText(): string {
    const n = this.projects.filter(p => p.spv).length;
    const r = this.projects.reduce((s, p) => s + p.rows.length, 0);
    const u = this.projects.reduce((s, p) =>
      s + p.rows.reduce((ss, row) => ss + row.mon.reduce((a, b) => a + b, 0), 0), 0);
    return n > 0 ? `${n} project(s) · ${r} rows · ${u} units` : 'No data entered';
  }

  onYearChange()    { /* month labels refresh automatically */ }
  onCustomerChange(customerId: number) {
    console.log(customerId);
    this.selectedCustomerId = customerId;
    this.fetchProjectsByCustomer();
    // this.projects = [];
    // this.uidSeed  = 0;
    if (this.filtersReady) { this.addProject(); }
  }

  addProject() {
    if (!this.filtersReady) return;
    this.projects = [...this.projects, { uid: ++this.uidSeed, projectCode: '', spv: '', rows: [] }];
  }

  removeProject(uid: number) {
    this.projects = this.projects.filter(p => p.uid !== uid);
  }

  onProjectChange(uid: number, code: string) {
    console.log(code);
    this.selectedProjectId = Number(code);
    
    const p = this.projects.find(p => p.uid === uid);
    if (!p) return;
    p.projectCode = code; p.spv = ''; p.rows = [];

    this.fetchSPVsByProject();
  }

  onSPVChange(uid: number, spv: string) {
    console.log(spv);
    const p = this.projects.find(p => p.uid === uid);
    if (!p) return;
    p.spv = spv;
    p.rows = this.ds.getDefaultRows(spv);

    this.fetchWtgDetailsByProjectSPV(spv);
  }

  addRow(uid: number) {
    const p = this.projects.find(p => p.uid === uid);
    if (p) p.rows = [...p.rows, { wtg: 'EN182', cap: 5, tower: '140HH-474T', blade: 'Big', qty: 0, mon: Array(12).fill(0) }];
  }

  removeRow(uid: number, ri: number) {
    const p = this.projects.find(p => p.uid === uid);
    if (p) p.rows = p.rows.filter((_, i) => i !== ri);
  }

  updField(uid: number, ri: number, field: 'wtg' | 'cap' | 'tower' | 'blade' | 'qty', val: any) {
    const p = this.projects.find(p => p.uid === uid);
    if (!p || !p.rows[ri]) return;
    (p.rows[ri] as any)[field] = val;
  }

  updMon(uid: number, ri: number, mi: number, val: number) {
    const p = this.projects.find(p => p.uid === uid);
    if (p && p.rows[ri]) p.rows[ri].mon[mi] = isNaN(val) ? 0 : val;
  }

  rowTotal(row: WtgRow): number   { return (row.mon ?? []).reduce((a, b) => a + b, 0); }
  colTotal(rows: WtgRow[], mi: number): number { return rows.reduce((s, r) => s + (r.mon[mi] ?? 0), 0); }
  qtyTotal(rows: WtgRow[]): number  { return rows.reduce((s, r) => s + (r.qty ?? 0), 0); }
  grandTotal(rows: WtgRow[]): number { return rows.reduce((s, r) => s + this.rowTotal(r), 0); }

  get summaryProjects(): ProjectEntry[] { return this.projects.filter(p => p.spv && p.rows.length > 0); }
  get summaryTotalQty():   number { return this.summaryProjects.reduce((s, p) => s + this.qtyTotal(p.rows), 0); }
  get summaryTotalUnits(): number { return this.summaryProjects.reduce((s, p) => s + this.grandTotal(p.rows), 0); }
  getTotalRows():    number { return this.summaryProjects.reduce((s, p) => s + p.rows.length, 0); }
  summaryColTotal(mi: number): number { return this.summaryProjects.reduce((s, p) => s + this.colTotal(p.rows, mi), 0); }

  openSummary() {
    if (!this.hasData) {
      this.msgSvc.add({ severity: 'warn', summary: 'No Data', detail: 'No data entered yet.', life: 3000 });
      return;
    }
    this.summaryVisible = true;
  }
  closeSummary() { this.summaryVisible = false; }

  submitPlan() {
    this.closeSummary();
    this.msgSvc.add({ severity: 'success', summary: 'Submitted', detail: 'Demand plan submitted successfully!', life: 3000 });
  }

  // summary flat rows for p-table
  get summaryRows(): any[] {
    const rows: any[] = [];
    this.summaryProjects.forEach(p => {
      p.rows.forEach(row => {
        rows.push({ customer: this.customer, project: p.projectCode, spv: p.spv, ...row, total: this.rowTotal(row) });
      });
    });
    return rows;
  }

  trackByUid(_: number, p: ProjectEntry) { return p.uid; }
  trackByIdx(i: number) { return i; }
}

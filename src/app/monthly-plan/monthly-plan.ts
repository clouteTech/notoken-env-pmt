import { Component, inject, OnInit } from '@angular/core';
import { TableModule }  from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Apiservice } from '../service/apiservice';
import { Shared } from '../shared/services/shared';

// Demo fallback data — shown only when the backend API cannot be reached.
const MOCK_MONTHLY_DEMAND_PLAN: any[] = [
  { monthlyDemandPlanId: 1, planMonth: 'Apr 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 1', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 2, status: 'ACTIVE', createdOn: '2026-03-01T10:15:00', createdByName: 'Ravi Kumar' },
  { monthlyDemandPlanId: 2, planMonth: 'May 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 1', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 2, status: 'ACTIVE', createdOn: '2026-03-01T10:15:00', createdByName: 'Ravi Kumar' },
  { monthlyDemandPlanId: 3, planMonth: 'Jun 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 1', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 1, status: 'ACTIVE', createdOn: '2026-03-01T10:15:00', createdByName: 'Ravi Kumar' },
  { monthlyDemandPlanId: 4, planMonth: 'Apr 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 1', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN156', capMw: 3.3, wtgCount: 1, status: 'ACTIVE', createdOn: '2026-03-02T09:30:00', createdByName: 'Sunita Sharma' },
  { monthlyDemandPlanId: 5, planMonth: 'May 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 1', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN156', capMw: 3.3, wtgCount: 1, status: 'ACTIVE', createdOn: '2026-03-02T09:30:00', createdByName: 'Sunita Sharma' },
  { monthlyDemandPlanId: 6, planMonth: 'Apr 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 2', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 1, status: 'DRAFT', createdOn: '2026-03-05T11:00:00', createdByName: 'Ajay Patel' },
  { monthlyDemandPlanId: 7, planMonth: 'May 2026', projectCode: 'P-1719', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 2', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 1, status: 'DRAFT', createdOn: '2026-03-05T11:00:00', createdByName: 'Ajay Patel' },
  { monthlyDemandPlanId: 8, planMonth: 'Jun 2026', projectCode: 'P-1854', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 10', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 3, status: 'ACTIVE', createdOn: '2026-03-06T14:45:00', createdByName: 'Meena Joshi' },
  { monthlyDemandPlanId: 9, planMonth: 'Jul 2026', projectCode: 'P-1854', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 10', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 2, status: 'ACTIVE', createdOn: '2026-03-06T14:45:00', createdByName: 'Meena Joshi' },
  { monthlyDemandPlanId: 10, planMonth: 'Sep 2026', projectCode: 'P-1854', customerCode: 'C-101', customerName: 'ReNew Power', spvName: 'SPV 10', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5, wtgCount: 3, status: 'ON_HOLD', createdOn: '2026-03-07T08:20:00', createdByName: 'Vikram Singh' },

  { monthlyDemandPlanId: 11, planMonth: 'Apr 2026', projectCode: 'P-2044', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'SPV 4', towerType: '130HH-420T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 3, status: 'ACTIVE', createdOn: '2026-03-08T09:00:00', createdByName: 'Priya Nair' },
  { monthlyDemandPlanId: 12, planMonth: 'May 2026', projectCode: 'P-2044', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'SPV 4', towerType: '130HH-420T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 2, status: 'ACTIVE', createdOn: '2026-03-08T09:00:00', createdByName: 'Priya Nair' },
  { monthlyDemandPlanId: 13, planMonth: 'Jun 2026', projectCode: 'P-2044', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'SPV 4', towerType: '140HH-353T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.5, wtgCount: 4, status: 'ACTIVE', createdOn: '2026-03-08T09:00:00', createdByName: 'Priya Nair' },
  { monthlyDemandPlanId: 14, planMonth: 'Apr 2026', projectCode: 'P-2044', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'SPV 5', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.4, wtgCount: 2, status: 'DRAFT', createdOn: '2026-03-09T10:30:00', createdByName: 'Karan Mehta' },
  { monthlyDemandPlanId: 15, planMonth: 'Jul 2026', projectCode: 'P-2101', customerCode: 'C-102', customerName: 'Adani Green Energy', spvName: 'SPV 8', towerType: '140HH-474T', bladeType: 'Big', wtgType: 'EN182', capMw: 5.5, wtgCount: 6, status: 'ACTIVE', createdOn: '2026-03-10T13:20:00', createdByName: 'Priya Nair' },

  { monthlyDemandPlanId: 16, planMonth: 'May 2026', projectCode: 'P-3312', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'SPV 2', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN156', capMw: 3.3, wtgCount: 5, status: 'ACTIVE', createdOn: '2026-03-11T11:45:00', createdByName: 'Deepak Rao' },
  { monthlyDemandPlanId: 17, planMonth: 'Jun 2026', projectCode: 'P-3312', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'SPV 2', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN156', capMw: 3.3, wtgCount: 3, status: 'ACTIVE', createdOn: '2026-03-11T11:45:00', createdByName: 'Deepak Rao' },
  { monthlyDemandPlanId: 18, planMonth: 'Aug 2026', projectCode: 'P-3312', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'SPV 3', towerType: '140HH-353T', bladeType: 'Big', wtgType: 'EN156', capMw: 3.5, wtgCount: 2, status: 'ON_HOLD', createdOn: '2026-03-12T15:10:00', createdByName: 'Deepak Rao' },
  { monthlyDemandPlanId: 19, planMonth: 'Sep 2026', projectCode: 'P-3400', customerCode: 'C-103', customerName: 'Suzlon Energy', spvName: 'SPV 6', towerType: '120HH-304T', bladeType: 'Small', wtgType: 'EN132', capMw: 2.5, wtgCount: 4, status: 'CANCELLED', createdOn: '2026-03-13T08:50:00', createdByName: 'Anita Rao' },
];

interface MonthlyPlanRow {
  key: string;
  wtgType: string;
  capMw: number | null;
  towerType: string;
  bladeType: string;
  monthlyQty: Record<string, number>;
  totalQty: number;
  records: any[];
}

interface SpvGroup {
  spvName: string;
  rows: MonthlyPlanRow[];
  totalsByMonth: Record<string, number>;
  totalQty: number;
  records: any[];
}

interface ProjectGroup {
  projectCode: string;
  spvs: SpvGroup[];
}

interface CustomerGroup {
  customerCode: string;
  customerName: string;
  projects: ProjectGroup[];
}

interface SummaryRow {
  customerName: string;
  projectCode: string;
  spvName: string;
  wtgType: string;
  capMw: number | null;
  towerType: string;
  bladeType: string;
  totalQty: number;
  monthlyQty: Record<string, number>;
}

@Component({
  selector: 'app-monthly-plan',
  imports: [TableModule, MenuModule, ButtonModule, DialogModule, DatePickerModule, FluidModule, Shared],
  templateUrl: './monthly-plan.html',
  styleUrl: './monthly-plan.css',
})
export class MonthlyPlan implements OnInit {
  actionItems: MenuItem[] = [];

  showComponentSerialModal = false;
  showComponentDetails = false;
  showSummaryView = false;

  monthlyDemandPlanList: any[] = [];

  // Grouped Customer -> Project(P-Code) -> SPV structure, matching the agreed
  // "Demand Plan" Excel layout. Month columns are pivoted per SPV mini-table.
  groupedPlan: CustomerGroup[] = [];
  monthColumns: string[] = [];

  // Flat "View Plan Summary" rollup, mirroring the Excel's summary sheet + Sum row.
  summaryRows: SummaryRow[] = [];
  summaryTotals: Record<string, number> = {};
  summaryGrandTotal = 0;

  private router = inject(Router);
  private apiService = inject(Apiservice);

  constructor(private messageService: MessageService){}

  ngOnInit(){
    this.actionItems = this.getActionItems();

    this.fetchAllMonthlyDemandPlan();
  }

  fetchAllMonthlyDemandPlan(){
    try {
      // Grouping is done client-side across the whole plan (Customer -> Project -> SPV),
      // so this fetches the full working set rather than a single page of rows.
      const data = {
        customerId: null,
        planMonth: null,
        planYear: null,
        projectId: null,
        spvId: null,
        status: null,
        searchText: null,
        page: 0,
        size: 500,
        sortBy: "createdOn",
        sortDirection: "asc"
      }

      this.apiService.fetchAllMonthlyDemandPlan(data).subscribe({
        next: val => {
          this.monthlyDemandPlanList = val?.data?.data?.content ?? [];
          this.buildGroupedPlan();
        },
        error: err => {
          console.log(err);

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.monthlyDemandPlanList = MOCK_MONTHLY_DEMAND_PLAN;
            this.buildGroupedPlan();
          }
        }
      })
    } catch (error) {
      console.log(error);

      this.monthlyDemandPlanList = MOCK_MONTHLY_DEMAND_PLAN;
      this.buildGroupedPlan();

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  private monthSortKey(label: string): number {
    const d = new Date(label);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  private buildGroupedPlan(){
    const customersMap = new Map<string, CustomerGroup>();
    const monthsSet = new Set<string>();

    for (const rec of this.monthlyDemandPlanList){
      const month = rec.planMonth || '-';
      monthsSet.add(month);

      const custKey = rec.customerCode ?? rec.customerName ?? '-';
      let customer = customersMap.get(custKey);
      if (!customer){
        customer = { customerCode: rec.customerCode, customerName: rec.customerName, projects: [] };
        customersMap.set(custKey, customer);
      }

      let project = customer.projects.find(p => p.projectCode === rec.projectCode);
      if (!project){
        project = { projectCode: rec.projectCode, spvs: [] };
        customer.projects.push(project);
      }

      let spv = project.spvs.find(s => s.spvName === rec.spvName);
      if (!spv){
        spv = { spvName: rec.spvName, rows: [], totalsByMonth: {}, totalQty: 0, records: [] };
        project.spvs.push(spv);
      }
      spv.records.push(rec);

      const rowKey = [rec.wtgType, rec.capMw, rec.towerType, rec.bladeType].join('|');
      let row = spv.rows.find(r => r.key === rowKey);
      if (!row){
        row = { key: rowKey, wtgType: rec.wtgType, capMw: rec.capMw, towerType: rec.towerType, bladeType: rec.bladeType, monthlyQty: {}, totalQty: 0, records: [] };
        spv.rows.push(row);
      }
      row.records.push(rec);

      const qty = Number(rec.wtgCount) || 0;
      row.monthlyQty[month] = (row.monthlyQty[month] || 0) + qty;
      row.totalQty += qty;
    }

    for (const customer of customersMap.values()){
      for (const project of customer.projects){
        for (const spv of project.spvs){
          for (const row of spv.rows){
            spv.totalQty += row.totalQty;
            for (const [m, q] of Object.entries(row.monthlyQty)){
              spv.totalsByMonth[m] = (spv.totalsByMonth[m] || 0) + q;
            }
          }
        }
      }
    }

    this.monthColumns = Array.from(monthsSet).sort((a, b) => this.monthSortKey(a) - this.monthSortKey(b));
    this.groupedPlan = Array.from(customersMap.values());

    this.buildSummaryRows();
  }

  private buildSummaryRows(){
    const rows: SummaryRow[] = [];
    const totalsByMonth: Record<string, number> = {};
    let grandTotal = 0;

    for (const customer of this.groupedPlan){
      for (const project of customer.projects){
        for (const spv of project.spvs){
          for (const row of spv.rows){
            rows.push({
              customerName: customer.customerName,
              projectCode: project.projectCode,
              spvName: spv.spvName,
              wtgType: row.wtgType,
              capMw: row.capMw,
              towerType: row.towerType,
              bladeType: row.bladeType,
              totalQty: row.totalQty,
              monthlyQty: row.monthlyQty
            });
            grandTotal += row.totalQty;
            for (const [m, q] of Object.entries(row.monthlyQty)){
              totalsByMonth[m] = (totalsByMonth[m] || 0) + q;
            }
          }
        }
      }
    }

    this.summaryRows = rows;
    this.summaryTotals = totalsByMonth;
    this.summaryGrandTotal = grandTotal;
  }

  toggleSummaryView(){
    this.showSummaryView = !this.showSummaryView;
  }

  getActionItems(){
    return [
      {
        label: 'Create Component Serial',
        icon: 'pi pi-plus',
        command: () => this.openComponentSerial()
      }
    ]
  }

  breakdownList = [
    { towerType: '120HH-474T', bladeType: 'Small', wtgCount: '2', wtgComponentCount: '30' },
    { towerType: '-', bladeType: 'Small', wtgCount: '5', wtgComponentCount: '50' },
    { towerType: '140HH-520T', bladeType: 'Big', wtgCount: '2', wtgComponentCount: '32' },
  ]

  selectedMonth(month: any){
    this.showComponentDetails = true;
  }

  openComponentSerial(){
    try {
      this.showComponentSerialModal = true;
    } catch (error) {
      console.log(error);
    }
  }

  viewComponentSerial(spv: SpvGroup){
    const planId = spv.records?.[0]?.monthlyDemandPlanId;
    this.router.navigate(['/plan', planId, 'component-serial']);
  }
}

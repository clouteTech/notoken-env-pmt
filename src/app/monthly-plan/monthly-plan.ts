import { Component, inject, OnInit } from '@angular/core';
import { TableModule }  from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Apiservice } from '../service/apiservice';
import { Shared } from '../shared/services/shared';

export interface ComponentRequirement {
  componentMasterId?: number;
  componentName: string;
  requiredQty: number;
  createdQty: number;
}

export interface WtgModel {
  monthlyDemandPlanId?: number;
  wtgConfigId?: number;
  wtgType?: string;
  capMw?: number;
  towerType: string;
  bladeType: string;
  wtgCount: number;
  componentCount: number;
  components: ComponentRequirement[];
}

export interface MonthlyComponentDetails {
  planMonth?: string;
  totalRecords: number;
  totalWtgCount: number;
  totalComponentCount: number;
  wtgModels: WtgModel[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

@Component({
  selector: 'app-monthly-plan',
  imports: [TableModule, MenuModule, ButtonModule, DialogModule, DatePickerModule, FluidModule, Shared],
  templateUrl: './monthly-plan.html',
  styleUrl: './monthly-plan.css',
})
export class MonthlyPlan implements OnInit {
  first = 0;

  rows = 10;
  page = 0;
  size = 10;
  totalRecords = 0;

  items: MenuItem[] = [];
  actionItems: MenuItem[] = [];

  showComponentSerialModal = false;
  showComponentDetails = false;
  isLoadingComponentDetails = false;
  componentDetailsError = false;

  selectedMonthlyPlan: any;

  monthlyDemandPlanList: any[] = [];
  monthlyComponentDetails: MonthlyComponentDetails | null = null;

  selectedPlanMonth: string | null = null;
  selectedPlanMonthLabel: string | null = null;
  private selectedPlanMonthDate: Date | null = null;

  private router = inject(Router);
  private apiService = inject(Apiservice);

  constructor(
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(){
    this.items = this.getMenuItems();
    this.actionItems = this.getActionItems();

    this.fetchAllMonthlyDemandPlan();
  }

  fetchAllMonthlyDemandPlan(){
    try {
      const data = {
        customerId: null,
        planMonth: null,
        planYear: null,
        projectId: null,
        spvId: null,
        status: null,
        searchText: null,
        page: this.page,
        size: this.size,
        sortBy: "createdOn",
        sortDirection: "asc"
      }

      this.apiService.fetchAllMonthlyDemandPlan(data).subscribe({
        next: val => {
          this.monthlyDemandPlanList = val?.data?.data?.content;

          this.totalRecords = val?.data?.data?.totalElements ?? 0;
        },
        error: err => {
          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          }
        }
      })
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });

    }
  }

  getMenuItems(){
    return [
      {
        label: 'View Component Serial',
        icon: 'pi pi-eye',
        command: () => this.router.navigate(['/plan', this.selectedMonthlyPlan.monthlyDemandPlanId, 'component-serial'])
      }
    ]
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

  getSeverity(status: string){
    switch(status){
      case 'DRAFT':
        return 'info';

      case 'ACTIVE':
        return 'success';

      case 'ON_HOLD':
        return 'warn';

      case 'COMPLETED':
        return 'success';

      case 'CANCELLED':
        return 'danger';

      default:
        return 'info';
    }
  }

  selectedMonth(yearMonth: Date){
    try {
      this.selectedPlanMonthDate = yearMonth;

      const year = yearMonth.getFullYear();
      const monthIndex = yearMonth.getMonth();
      const month = String(monthIndex + 1).padStart(2, '0');

      this.selectedPlanMonth = `${year}-${month}`;
      this.selectedPlanMonthLabel = `${MONTH_NAMES[monthIndex]} ${year}`;

      // Clear any previously loaded month's data before fetching, so stale
      // requirements are never shown while/after loading a different month.
      this.monthlyComponentDetails = null;
      this.showComponentDetails = false;
      this.componentDetailsError = false;
      this.isLoadingComponentDetails = true;

      const data = {
        planMonth: this.selectedPlanMonth
      }

      this.apiService.fetchMonthlyDetailsFromYearlyPlan(data).subscribe({
        next: val => {
          this.monthlyComponentDetails = val.data.data;
          this.showComponentDetails = true;
          this.isLoadingComponentDetails = false;
        },
        error: err => {
          this.isLoadingComponentDetails = false;
          this.componentDetailsError = true;
          this.monthlyComponentDetails = null;
          this.showComponentDetails = false;

          if (err.status === 400) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.detail });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to fetch component requirements. Please try again.' });
          }
        }
      })
    } catch (error) {
      this.isLoadingComponentDetails = false;
      this.componentDetailsError = true;

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  openComponentSerial(){
    try {
      this.showComponentSerialModal = true;
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please Try Again.'
      });
    }
  }

  retryFetch(){
    if (this.selectedPlanMonthDate) {
      this.selectedMonth(this.selectedPlanMonthDate);
    }
  }

  resetComponentSerialModal(){
    this.monthlyComponentDetails = null;
    this.showComponentDetails = false;
    this.isLoadingComponentDetails = false;
    this.componentDetailsError = false;
    this.selectedPlanMonth = null;
    this.selectedPlanMonthLabel = null;
    this.selectedPlanMonthDate = null;
  }

  formatConfigNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  remainingQty(component: ComponentRequirement): number {
    return Math.max((component.requiredQty ?? 0) - (component.createdQty ?? 0), 0);
  }

  componentStatus(component: ComponentRequirement): 'Pending' | 'Partial' | 'Completed' {
    const required = component.requiredQty ?? 0;
    const created = component.createdQty ?? 0;

    if (created >= required) {
      return 'Completed';
    }

    if (created > 0) {
      return 'Partial';
    }

    return 'Pending';
  }

  componentSeverity(component: ComponentRequirement){
    switch (this.componentStatus(component)) {
      case 'Completed':
        return 'success';

      case 'Partial':
        return 'warn';

      default:
        return 'danger';
    }
  }

  private requiredQtyOf(components: ComponentRequirement[]): number {
    return (components ?? []).reduce((sum, component) => sum + (component.requiredQty ?? 0), 0);
  }

  private createdQtyOf(components: ComponentRequirement[]): number {
    return (components ?? []).reduce((sum, component) => sum + (component.createdQty ?? 0), 0);
  }

  totalRequiredQty(): number {
    return this.requiredQtyOf((this.monthlyComponentDetails?.wtgModels ?? []).flatMap(model => model.components ?? []));
  }

  totalCreatedQty(): number {
    return this.createdQtyOf((this.monthlyComponentDetails?.wtgModels ?? []).flatMap(model => model.components ?? []));
  }

  progressPercent(): number {
    return this.calcProgressPercent(this.totalRequiredQty(), this.totalCreatedQty());
  }

  wtgRequiredQty(item: WtgModel): number {
    return this.requiredQtyOf(item.components);
  }

  wtgCreatedQty(item: WtgModel): number {
    return this.createdQtyOf(item.components);
  }

  wtgProgressPercent(item: WtgModel): number {
    return this.calcProgressPercent(this.wtgRequiredQty(item), this.wtgCreatedQty(item));
  }

  private calcProgressPercent(required: number, created: number): number {
    if (required === 0) {
      return 0;
    }

    return Math.min(Math.round((created / required) * 100), 100);
  }

  hasPendingComponents(): boolean {
    return this.totalRequiredQty() > this.totalCreatedQty();
  }

  canCreate(): boolean {
    return !!this.monthlyComponentDetails
      && !this.isLoadingComponentDetails
      && (this.monthlyComponentDetails.wtgModels?.length ?? 0) > 0
      && this.hasPendingComponents();
  }

  confirmCreateComponentSerial(){
    if (!this.canCreate()) {
      return;
    }

    const pendingCount = this.totalRequiredQty() - this.totalCreatedQty();

    this.confirmationService.confirm({
      header: 'Create Component Serials?',
      message: `You are about to create component serials for ${this.selectedPlanMonthLabel}. Total pending components: ${pendingCount}.`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Confirm Create'
      },
      accept: () => this.createComponentSerials()
    });
  }

  createComponentSerials(){
    // TODO: No backend endpoint exists yet for creating component serials.
    // Once the API is available, add a method to Apiservice (e.g. createComponentSerials)
    // and call it here with { planMonth: this.selectedPlanMonth }, then on success close
    // the modal and refresh both this.monthlyComponentDetails and the plan list.
    this.messageService.add({
      severity: 'warn',
      summary: 'Not Available',
      detail: 'Component serial creation API is not available yet. This request could not be completed.'
    });
  }

  getSafeSvg(svg: string): SafeHtml{
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  monthlyMenu(event: Event, menu: any, monthlyPlan: any){
    this.selectedMonthlyPlan = monthlyPlan;
    menu.toggle(event);
  }

  loadMonthlyPlan(event: any){
    this.first = event.first;

    this.page = event.first / event.rows;
    this.size = event.rows;

    this.fetchAllMonthlyDemandPlan();
  }
}

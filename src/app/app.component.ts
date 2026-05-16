import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  sidebarOpen = signal(true);
  showLogoutConfirm = false;
  showMastersMenu = false;

  currentRoute = '';
  activeMenu = 'create';
  private routeSub!: Subscription;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.restore();
    this.currentRoute = this.router.url;
    this.updateActiveMenu(this.router.url);

    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects;
        this.updateActiveMenu(e.urlAfterRedirects);
      });

    if (window.innerWidth <= 768) {
      this.sidebarOpen.set(false);
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private updateActiveMenu(url: string) {
    if (url.includes('create')) this.activeMenu = 'create';
    if (url.includes('demand')) this.activeMenu = 'demand';
    if (url.includes('componentAllocation')) this.activeMenu = 'componentAllocation';
    if (url.includes('allocationApproval')) this.activeMenu = 'allocationApproval';
    if (url.includes('WTGProduction')) this.activeMenu = 'WTGProduction';

    else this.activeMenu = 'create';
  }

  get isLoginRoute(): boolean {
    return this.currentRoute.startsWith('/login') || this.currentRoute === '/';
  }

  navigate(menu: string) {
    this.activeMenu = menu;
    if (menu === 'demand') this.router.navigate(['/dashboard']);
    else if (menu === 'saleDemand') this.router.navigate(['/saleDemand']);
    else if (menu === 'create') this.router.navigate(['/create-project']);
    else if (menu === 'monthlyDemandPlan') this.router.navigate(['/monthlyDemandPlan']);
    else if (menu === 'allocationApproval') this.router.navigate(['/allocationApproval']);
    else if (menu === 'WTGProduction') this.router.navigate(['/WTGProduction']);
    else if(menu === 'WTGQuality') this.router.navigate(['/wtg-quality']);
    else if(menu === 'WTGDispatch') this.router.navigate(['/wtg-dispatch']);
    else if(menu === 'WTGReceiving') this.router.navigate(['/wtg-receiving']);
    else if(menu === 'Foundation') this.router.navigate(['/foundation']);
    else if(menu === 'Foundation1') this.router.navigate(['/foundation1']);
    else if(menu === 'Foundation_11') this.router.navigate(['/foundation_11']);
    else if(menu === 'Commisioning') this.router.navigate(['/commisioning']);
    else if(menu === 'Commisioning1') this.router.navigate(['/commisioning1']);
    else if(menu === 'Commisioning_11') this.router.navigate(['/commisioning_11']);
    else if(menu === 'components') this.router.navigate(['/components']);
    else if(menu === 'towerType') this.router.navigate(['/tower-types']);
    else if(menu === 'bladeType') this.router.navigate(['/blade-types']);
    else if(menu === 'wtgType') this.router.navigate(['/wtg-types']);
    else if(menu === 'gridConnectivities') this.router.navigate(['/grid-connectivities']);
    else if(menu === 'wtgCapacities') this.router.navigate(['/wtg-capacities']);
    else if(menu === 'ppaTypes') this.router.navigate(['/ppa-types']);
    else if(menu === 'plants') this.router.navigate(['/plants']);
    else if(menu === 'customers') this.router.navigate(['/customers']);
    else if(menu === 'zone') this.router.navigate(['/zones']);
    else if(menu === 'installation') this.router.navigate(['/installation']);
    if (window.innerWidth <= 768) this.sidebarOpen.set(false);
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }
  confirmLogout() { this.showLogoutConfirm = true; }
  cancelLogout()  { this.showLogoutConfirm = false; }

  doLogout() {
    this.showLogoutConfirm = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

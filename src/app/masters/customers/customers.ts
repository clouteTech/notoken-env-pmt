import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-customers',
  imports: [Shared],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers {
  items: MenuItem[] = [];

  private router = inject(Router);

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.items = this.getMenuItems();
  }

  customerList = [
    {
      customerCode: 'CUST001',
      customerName: 'Reliance Power Ltd'
    },
    {
      customerCode: 'CUST002',
      customerName: 'Adani Green Energy'
    },
    {
      customerCode: 'CUST003',
      customerName: 'Tata Power Renewable'
    },
    {
      customerCode: 'CUST004',
      customerName: 'Suzlon Energy'
    },
    {
      customerCode: 'CUST005',
      customerName: 'ReNew Power'
    },
    {
      customerCode: 'CUST006',
      customerName: 'JSW Energy'
    }
  ];

  getMenuItems(){
    return [
      {
        label: 'View Customer SPV Details',
        icon: 'pi pi-eye',
        command: () => this.router.navigate(['/customers/spv'])
      },
      {
        label: 'Quality Configuration',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/customers/quality-config'])
      }
    ]
  }
}

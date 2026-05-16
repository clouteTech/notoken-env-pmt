import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-add-customer',
  imports: [Shared],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer {
  spvList: any[] = [];

  private fb = inject(FormBuilder);
  
  spvForm = this.fb.group({
    spvName: [''],
    spvGst: [''],
    gstAddress: [''],
    city: [''],
    state: [''],
    country: [''],
    postalCode: ['']
  })

  addSpv() {
    this.spvList.push(this.spvForm.value);
  }

  removeSpv(index: number) {
    this.spvList.splice(index, 1);
  }
}

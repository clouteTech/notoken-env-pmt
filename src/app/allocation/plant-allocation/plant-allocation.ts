
import { Component, inject, OnInit } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plant-allocation',
  imports: [
    FloatLabelModule,
    SelectModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './plant-allocation.html',
  styleUrl: './plant-allocation.css'
})
export class PlantAllocation implements OnInit {

  selectedQty = 0;
  remainingQty = 0;

  allocations: any[] = [];
  selectedComponents: any[] = [];

  qtyLimitError = false;

  private fb = inject(FormBuilder);

  allocationForm = this.fb.group({
    qty: [0],
    plantName: [''],
    plantManager: ['']
  });

plantManagerList = [
  {
    label: 'Suresh Reddy (limit 10)',
    value: 'Suresh Reddy',
    limit: 10,
    disabled: false
  },
  {
    label: 'Laxmi Devi (limit 20)',
    value: 'Laxmi Devi',
    limit: 20,
    disabled: false
  },
  {
    label: 'Anitha Rao (limit 40)',
    value: 'Anitha Rao',
    limit: 40,
    disabled: false
  }
];

  plantNameList = [
    { label: 'Chennai', value: 'Chennai' },
    { label: 'Trichy', value: 'Trichy' },
    { label: 'Pune', value: 'Pune' }
  ];

  ngOnInit(): void {
    const state = history.state;

    if (state?.components) {
      this.groupComponents(state.components);
    }

    this.allocationForm.get('qty')?.valueChanges.subscribe(() => {
      this.checkQtyLimit();
    });

    this.allocationForm.get('plantManager')?.valueChanges.subscribe(() => {
      this.checkQtyLimit();
    });
  }

  checkQtyLimit(): void {
    const managerName =
      this.allocationForm.get('plantManager')?.value;

    const qty = Number(
      this.allocationForm.get('qty')?.value
    );

    const manager = this.plantManagerList.find(
      x => x.value === managerName
    );

    this.qtyLimitError =
      !!manager &&
      qty > manager.limit;
  }

  groupComponents(components: any[]): void {
    const map = new Map();

    components.forEach(item => {
      if (map.has(item.componentName)) {
        map.get(item.componentName).count += 1;
      } else {
        map.set(item.componentName, {
          componentName: item.componentName,
          count: 1
        });
      }
    });

    this.selectedComponents = Array.from(map.values());
  }

  componentChange(component: any): void {
    this.selectedQty = component.count;
  }
addAllocations(): void {
  const formValue = this.allocationForm.value;
  const managerName = formValue.plantManager;
  const qty = Number(formValue.qty);

  const manager = this.plantManagerList.find(
    x => x.value === managerName
  );

  if (!manager) {
    alert('Please select Plant Manager');
    return;
  }

  if (!qty || qty <= 0) {
    alert('Please enter a valid quantity');
    return;
  }

  if (qty > manager.limit) {
    this.qtyLimitError = true;
    return;
  }

  this.qtyLimitError = false;


  this.allocations.push({
    ...formValue,
    plantManager: manager
  });

  if (qty === manager.limit) {
    manager.disabled = true;
  }

 
  this.plantManagerList = [...this.plantManagerList];


  this.allocationForm.patchValue({
    plantManager: '',
    plantName: '',
    qty: 0
  });

  this.qtyLimitError = false;
}

  viewPlantManagers(): void {
    alert(
      'Plant Manager List:\n\n' +
      'Suresh Reddy (limit 10)\n' +
      'Laxmi Devi (limit 20)\n' +
      'Anitha Rao (limit 40)'
    );
  }

  removeAllocation(index: number, allocate: any): void {
    this.allocations.splice(index, 1);
  }
}

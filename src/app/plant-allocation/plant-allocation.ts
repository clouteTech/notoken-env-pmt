import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { TableModule }  from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plant-allocation',
  imports: [FloatLabelModule, SelectModule, TableModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './plant-allocation.html',
  styleUrl: './plant-allocation.css',
})
export class PlantAllocation {
  selectedQty = 0;
  remainingQty = 0;

  allocations: any[] = [];
  selectedComponents: any[] = [];

  private fb = inject(FormBuilder);

  allocationForm = this.fb.group({
    qty: [0],
    plantName: [''],
    plantManager: ['']
  })

  ngOnInit(): void {
    const state = history.state;
    
    if (state?.components) {
      console.log(state.components);

      // this.selectedComponents = state.components;
      this.groupComponents(state.components);
    }
  }

  groupComponents(components: any[]){
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

  componentChange(component: any){
    console.log(component);
    this.selectedQty = component.count;
  }

  addAllocations(){
    const qty: number = this.allocationForm.get('qty')?.value ?? 0;
    this.allocations.push(this.allocationForm.value);
    console.log(this.allocations);
    
    this.remainingQty = this.selectedQty - qty;
    this.allocationForm.reset();
  }

  plantNameList = [
    {
      label: 'Chennai',
      value: 'Chennai'
    },
    {
      label: 'Trichy',
      value: 'Trichy'
    },
    {
      label: 'Pune',
      value: 'Pune'
    }
  ];

  plantManagerList = [
    {
      label: 'Suresh Reddy',
      value: 'Suresh Reddy'
    },
    {
      label: 'Lakshmi Devi',
      value: 'Lakshmi Devi'
    },
    {
      label: 'Anitha Rao',
      value: 'Anitha Rao'
    }
  ];


  removeAllocation(index: number, allocate: any){
    this.remainingQty += allocate.qty;
    this.allocations.splice(index, 1);
  }
}

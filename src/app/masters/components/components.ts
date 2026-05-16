import { Component } from '@angular/core';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-components',
  imports: [Shared],
  templateUrl: './components.html',
  styleUrl: './components.css',
})
export class Components {
  componentList = [
    {
      componentName: 'Topflange'
    },
    {
      componentName: 'Bottomflange'
    },
    {
      componentName: 'Blade'
    },
     {
      componentName: 'Nacelle'
    },
     {
      componentName: 'Hub'
    },
     {
      componentName: 'Tower'
    },
    {
      componentName: 'Converter Panel'
    },
    {
      componentName: 'Site Accessories'
    },
    {
      componentName: 'SCADA'
    },
  ]
}

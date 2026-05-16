import { Component } from '@angular/core';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-receiving-sub-components',
  imports: [Shared],
  templateUrl: './wtg-receiving.html',
  styleUrl: './wtg-receiving.css',
})
export class WtgReceiving {
  componentDetails = [
    {
      components: 'Top Flange',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Bottom Flange',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      components: 'Nacelle',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Hub',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      components: 'Blade 1',
      locationId: 'ENV 2',
      maximoId: 'Maximo 2'
    },
    {
      components: 'Blade 2',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Blade 3',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Tower 1',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Tower 2',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Tower 3',
      locationId: 'ENV 1',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Tower 4',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      components: 'Tower 5',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      components: 'Converter Panel',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    },
    {
      components: 'Site Accessories',
      locationId: 'ENV 2',
      maximoId: 'Maximo 1'
    },
    {
      components: 'SCADA',
      locationId: 'ENV 1',
      maximoId: 'Maximo 2'
    }
  ];

  wtgList = [
    {
      id: 1,
      wtgCode: 'WTG-001',
      componentDetails: this.componentDetails
    },
    {
      id: 2,
      wtgCode: 'WTG-002',
      componentDetails: this.componentDetails
    }
  ];

  componentConditionList = [
    {
      label: 'Good',
      value: 'Good'
    },
    {
      label: 'Damage',
      value: 'Damage'
    }
  ]

  returnStatusList = [
    {
      label: 'Returned',
      value: true
    },
    {
      label: 'Pending',
      value: false
    }
  ]
}

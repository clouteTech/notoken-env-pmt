import { Component } from '@angular/core';
import { Shared } from 'src/app/shared/services/shared';

@Component({
  selector: 'app-zones',
  imports: [Shared],
  templateUrl: './zones.html',
  styleUrl: './zones.css',
})
export class Zones {
  showZoneModal = false;

  zoneList = [
    {
      zoneName: 'North'
    },
    {
      zoneName: 'South'
    },
    {
      zoneName: 'East'
    },
    {
      zoneName: 'West'
    }
  ]

  openZoneModal(){
    try {
      this.showZoneModal = true;
    } catch (error) {
      console.log(error);
    }
  }
}

import { Component } from '@angular/core';
import { Shared } from '../shared/services/shared';

@Component({
  selector: 'app-wtg-receiving',
  imports: [Shared],
  templateUrl: './wtg-receiving-project-summary.html',
  styleUrl: './wtg-receiving-project-summary.css',
})
export class WtgReceivingProjectSummary {
  wtgProjects = [
    {
      slNo: 1,
      openWtg: 'WTG-001',
      projectCode: 'P-8001',
      projectName: 'India_TataPower_Chennai_TamilNadu_Phase1_250MW',
      wtgCount: 2
    },
    {
      slNo: 2,
      openWtg: 'WTG-002',
      projectCode: 'P-8002',
      projectName: 'India_AdaniEnergy_Belagavi_Karnataka_Phase2_180MW',
      wtgCount: 5
    },
    {
      slNo: 3,
      openWtg: 'WTG-003',
      projectCode: 'P-8003',
      projectName: 'India_ReNewPower_Jaisalmer_Rajasthan_Phase1_320MW',
      wtgCount: 6
    },
    {
      slNo: 4,
      openWtg: 'WTG-004',
      projectCode: 'P-8004',
      projectName: 'India_Greenko_Kutch_Gujarat_Phase3_400MW',
      wtgCount: 3
    },
    {
      slNo: 5,
      openWtg: 'WTG-005',
      projectCode: 'P-8005',
      projectName: 'India_AzurePower_Pune_Maharashtra_Phase1_150MW',
      wtgCount: 4
    }
  ];
}

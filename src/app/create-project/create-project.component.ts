import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { SelectModule }    from 'primeng/select';
import { DatePickerModule }from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TableModule }     from 'primeng/table';
import { ToastModule }     from 'primeng/toast';
import { CardModule }      from 'primeng/card';
import { MessageService }  from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield'; 
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FluidModule } from 'primeng/fluid';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, TextareaModule,
    SelectModule, DatePickerModule,
    AccordionModule, TableModule,
    ToastModule, CardModule,IconFieldModule,TagModule,InputIconModule,DialogModule,ConfirmDialogModule,
    FluidModule,ReactiveFormsModule,MultiSelectModule,CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  projectList = [{
    SlNo: "1",
    Pcode: "P-8001",
    FPD: "India_Renew1_Gadag_KA_300.3MW",
    SiteName: "ReNew-1 Gadag, KN",
    Customer: "Renew",
    Cityinfo: "Gadag",
    uniqueS: "KA-6",
    State: " Karnataka",
    WTGQTY: "3",
    Capacity: "300.3",
    PM: "Oxford Rebello",
    type1: "FTE",
    StateHead: "Srikanth Shanmugam",
    type2: "FTE",
    ConstructionManager: "OM Mishra",
    type3: "FTE",
    machinaclLead: "",
    type4: "FTE",
    StartDate: "01-01-2022",
    CompleteDate: "30-06-2025",
    DetailStatus: "Installation, O&M",
    Status4: "Execution,Service",
    ContractualCoD: "31-03-23",
    ExpectedCoD: "30-06-25",
    ActualCoD: "02-05-25",
    Delay: 763,
    Remarks: "Land delay, RoW, Delay in GSS & EHV Line"
},
{
  SlNo: "2",
  Pcode: "P-8002",
  FPD: "India_Renew2_Chandwad_MH_300.3MW",
  SiteName: " ReNew2 Chanwad, MH",
  Customer: "Renew",
  Cityinfo: "Chandwad",
  uniqueS: "MH-5",
  State: " Karnataka",
  WTGQTY: "3",
  Capacity: "151.18",
  PM: "Oxford Rebello",
  type1: "FTE",
  StateHead: "Surendra Panwar",
  type2: "FTE",
  ConstructionManager: "Adil Hussain",
  type3: "DCE",
  machinaclLead: "",
  type4: "",
  StartDate: "01-01-2022",
  CompleteDate: "31-12-2025",
  DetailStatus: "Installation",
  Status4: "Execution",
  ContractualCoD: "31-03-23",
  ExpectedCoD: "30-06-25",
  ActualCoD: "02-05-25",
  Delay: 763,
  Remarks: "Project size reduced to 46"
}]
addProjectDialog:boolean = false;
states = [
    { label: "Andhra Pradesh", value: "Andhra Pradesh" },
    { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
    { label: "Assam", value: "Assam" },
    { label: "Bihar", value: "Bihar" },
    { label: "Chhattisgarh", value: "Chhattisgarh" },
    { label: "Goa", value: "Goa" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Haryana", value: "Haryana" },
    { label: "Himachal Pradesh", value: "Himachal Pradesh" },
    { label: "Jharkhand", value: "Jharkhand" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Kerala", value: "Kerala" },
    { label: "Madhya Pradesh", value: "Madhya Pradesh" },
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Manipur", value: "Manipur" },
    { label: "Meghalaya", value: "Meghalaya" },
    { label: "Mizoram", value: "Mizoram" },
    { label: "Nagaland", value: "Nagaland" },
    { label: "Odisha", value: "Odisha" },
    { label: "Punjab", value: "Punjab" },
    { label: "Rajasthan", value: "Rajasthan" },
    { label: "Sikkim", value: "Sikkim" },
    { label: "Tamil Nadu", value: "Tamil Nadu" },
    { label: "Telangana", value: "Telangana" },
    { label: "Tripura", value: "Tripura" },
    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
    { label: "Uttarakhand", value: "Uttarakhand" },
    { label: "West Bengal", value: "West Bengal" },
    { label: "Delhi", value: "Delhi" }
  ];

  cityStateMap: { [key: string]: string } = {
    "chennai": "Tamil Nadu",
    "coimbatore": "Tamil Nadu",
    "salem": "Tamil Nadu",
    "hyderabad": "Telangana",
    "bengaluru": "Karnataka",
    "mysuru": "Karnataka",
    "mumbai": "Maharashtra",
    "pune": "Maharashtra",
    "delhi": "Delhi", // (if including UTs)
    "kolkata": "West Bengal",
    "patna": "Bihar",
    "ranchi": "Jharkhand",
    "lucknow": "Uttar Pradesh"
    // 👉 Add more as needed
  };
  selectedState: any = [];

  zoneOptions:any = [
    {label:'North',value:'North'},
    {label:'South',value:'South'}
  ]
  selectedZone:any = ""
  PMOptions:any = [
    {label:'PM 1', value:'PM 1'},
    {label:'PM 2', value:'PM 2'},
    {label:'PM 3', value:'PM 3'},
    {label:'PM 4', value:'PM 4'}
  ]
  selectedProjectManager:any = "";
  BDOptions:any = [
    {label:'BD 1', value:'BD 1'},
    {label:'BD 2', value:'BD 2'},
    {label:'BD 3', value:'BD 3'},
    {label:'BD 4', value:'BD 4'}
  ]
  selectedBDManager:any = "";
  solutionOptions:any = [
    {label:'solution Manager 1', value:'solution Manager 1'},
    {label:'solution Manager 2', value:'solution Manager 2'},
    {label:'solution Manager 3', value:'solution Manager 3'},
    {label:'solution Manager 4', value:'solution Manager 4'}
  ]
  selectedSolutionManager:any = "";
  stateHeadOptions:any = [
    {label:'State Head 1', value:'State Head 1'},
    {label:'State Head 2', value:'State Head 2'},
    {label:'State Head 3', value:'State Head 3'},
    {label:'State Head 4', value:'State Head 4'}
  ]
  selectedStateHead:any = "";
  siteManagerOptions:any = [
    {label:'Site Manager 1', value:'Site Manager 1'},
    {label:'Site Manager 2', value:'Site Manager 2'},
    {label:'Site Manager 3', value:'Site Manager 3'},
    {label:'Site Manager 4', value:'Site Manager 4'}
  ]
  selectedSiteManager:any = "";

  multipleSPVOptions:any = [
    {label:'Yes', value:'Yes'},
    {label:'No', value:'No'}
  ]
  selectedMultpleSPV:any = "Yes";
  diableStateDD:boolean = false;
  projectHeader:any = "Step:1 Create Project";
  isProjectCreated:boolean = false;
  step1:boolean = true;
  spvList:any =  [2];
  spvOptions:any = [];
  projectQTY:any = "";
  pCode:any = "";
  WTGOptions:any = [
    {label:'EN132',value:'EN132'},
    {label:'EN156',value:'EN156'},
    {label:'EN182',value:'EN182'},
    {label:'EN156(NS)',value:'EN156(NS)'},
    {label:'EN182(NS)',value:'EN182(NS)'}
  ];
 capacityOptions:any = [
      {label:'2.5', value:'2.5'},
      {label:'3.5', value:'3.5'},
      {label:'5', value:'5'},
 ]
 towerOptions:any = [
      {label:'120HH-304T', value:'120HH-304T'},
      {label:'140HH-474T', value:'140HH-474T'},
      {label:'130HH-420T', value:'130HH-420T'},
      {label:'140HH-353T', value:'140HH-353T'}
 ]
 gridOptions:any = [
      {label:'STU', value:'STU'},
      {label:'CTU', value:'CTU'}
   
 ]
 ppaOptions:any = [
      {label:'Auction', value:'Auction'},
      {label:'C&I', value:'C&I'}
   
 ]
 spvForm:any;
 errorMessage:any = "";
 disableAddBtn:boolean = false;
 cityInfo:any = "";
 overallTotalCapacity:any = 0;
 towerScopeChecked :boolean = true;
  constructor(private fb: FormBuilder,private messageService: MessageService){}

  ngOnInit(){

    this.spvForm = this.fb.group({
      wtgs: this.fb.array([])   // FormArray for rows
    });
    
    this.addRow(true);
    this.spvForm.get('totalCapacity')?.disable();
  }

   get wtgs(): FormArray {
    return this.spvForm.get('wtgs') as FormArray;
  }

  getRowFormGroup(index: number): FormGroup {
  return this.wtgs.at(index) as FormGroup;
}

calculateTotalCapacity(){
  try{
const wtgsArray = this.spvForm.get('wtgs') as FormArray;
  let overallTotal = 0;

  wtgsArray.controls.forEach((row: AbstractControl) => {
    const capacity = Number(row.get('capacity')?.value) || 0;
    const qty = Number(row.get('qty')?.value) || 0;
    const total = capacity * qty;

    // ✅ patch row total
    row.get('totalCapacity')?.setValue(total, { emitEvent: false });

    overallTotal += total;
  });

  // ✅ keep total in component variable
  this.overallTotalCapacity = overallTotal;

  }catch(e){

  }
}

  addRow(isFirst: boolean = false) {

    const row = this.fb.group({
      spv: [{ value: null, disabled: !isFirst }, Validators.required],
      shipAddress: [{ value: null, disabled: !isFirst }, Validators.required],
      wtgType: [{ value: null, disabled: !isFirst }, Validators.required],
      capacity: [{ value: null, disabled: !isFirst }, Validators.required],
      tower: [{ value: null, disabled: !isFirst }, Validators.required],
      grid: [{ value: null, disabled: !isFirst }, Validators.required],
      ppa: [{ value: null, disabled: !isFirst }, Validators.required],
      totalCapacity: [{ value: null, disabled: true }, Validators.required],
      qty: [null, Validators.required] 
    });

    row.get('qty')?.valueChanges.subscribe(() => {
    this.validateQtyTotal();
  });

  row.get('capacity')?.valueChanges.subscribe(() => this.calculateTotalCapacity());

  if (this.wtgs.length > 0) {
    const prevRow = this.wtgs.at(this.wtgs.length - 1) as FormGroup;
    row.patchValue({
      spv: prevRow.get('spv')?.value,
      shipAddress: prevRow.get('shipAddress')?.value,
      wtgType: prevRow.get('wtgType')?.value,
      capacity: prevRow.get('capacity')?.value,
      tower: prevRow.get('tower')?.value,
      grid: prevRow.get('grid')?.value,
      ppa: prevRow.get('ppa')?.value,
      // ⚠️ don’t patch totalCapacity (it will be recalculated)
    });
  }

    this.wtgs.push(row);
  }

  validateQtyTotal() {
  const totalQty = this.wtgs.controls
    .map(c => Number(c.get('qty')?.value) || 0)
    .reduce((a, b) => a + b, 0);

  if (this.projectQTY > 0 && totalQty > this.projectQTY) {
    this.errorMessage = `Total QTY (${this.projectQTY}) cannot exceed Project QTY (${this.projectQTY}).`;
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Total QTY (${this.projectQTY}) cannot exceed Project QTY (${this.projectQTY}).`, life: 3000 });
    this.disableAddBtn = true;
    return
  } else {
    this.errorMessage = '';
    this.disableAddBtn = false;

  }
}

  lockRow(index: any,val:any) {
    const row = this.wtgs.at(index) as FormGroup;
    row.get('spv')?.disable();
    row.get('shipAddress')?.disable();
    row.get('wtgType')?.disable();
    row.get('capacity')?.disable();
    row.get('tower')?.disable();
    row.get('grid')?.disable();
    row.get('ppa')?.disable();
    row.get('totalCapacity')?.disable();
    // qty stays editable
  }

  deleteRow(index: number,action:any) {
  if (index > 0) {
    this.wtgs.removeAt(index);
  }
  if(action == 'delete'){
    if (this.wtgs.length === 1) {
       this.enableRow(0);
     }
  }
       this.enableRow(0);

}

enableRow(index: number) {
  const row = this.wtgs.at(index) as FormGroup;
  Object.keys(row.controls).forEach(ctrl => {
    if (ctrl !== 'totalCapacity') {
      row.get(ctrl)?.enable();
    }
  });
}

  addNewProject(){
    try{
      this.addProjectDialog = true;
    }catch(e){
      console.log(e);
    }
  }

  onCityChange(val:any) {
    const city = val.target.value.trim().toLocaleLowerCase();;
    if (this.cityStateMap[city]) {
      this.selectedState = this.cityStateMap[city];
      this.diableStateDD = true;
    } else {
      this.selectedState = ''; // reset if not found
      this.diableStateDD = false;

    }
  }

  submitProject(){
    try{
      this.projectHeader = "Step 2 : Add SPV's"
      this.isProjectCreated = true;
      this.step1 = false;
      var projectQTY = this.projectQTY;
      for (let i = 1; i <= projectQTY; i++) {
            this.spvOptions.push({ label: 'SPV ' + i, value: 'SPV ' + i });
           // this.WTGOptions.push({ label: 'WTG ' + i, value: 'WTG ' + i });
        }

    }catch(e){

    }
  }

  saveSPV(){
    try{
      console.log(this.spvForm.value);
      console.log(this.wtgs);
      const formData = this.spvForm.getRawValue();

  console.log("Full Form Data:", formData);

  // if you want only wtgs array
  console.log("WTGS Rows:", formData.wtgs);

  // if you want overall total separately
  console.log("Overall Total Capacity:", this.overallTotalCapacity);
      
      this.spvForm.reset();
       /* if (this.wtgs.length > 0) {
    const prevRow = this.wtgs.at(this.wtgs.length - 1) as FormGroup;
    prevRow.reset();
       } */


        if (this.wtgs.length > 0) {
    for (let i = this.wtgs.length - 1; i >= 0; i--){
      this.deleteRow(i,'')
    }
       }
    this.spvForm.get('totalCapacity')?.disable();


    this.messageService.add({ severity: 'success', summary: 'Success', detail: `Project Created Successfully`, life: 3000 });

    
    }catch(e){

    }
  }
}

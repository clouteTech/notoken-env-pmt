import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Apiservice {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient){}

  postMethod(url: any, params: any, config?: any){
    return this.http.post(this.baseUrl + url, params, config);
  }

  // Blade Type Master

  fetchAllBladeTypes(params: any): Observable<any>{
    return this.postMethod('master/blade-type/get-all', params);
  }

  createBladeType(params: any): Observable<any>{
    return this.postMethod('master/blade-type/create', params);
  }

  updateBladeType(params: any){
    return this.postMethod('master/blade-type/update', params);
  }

  deleteBladeType(params: any): Observable<any>{
    return this.postMethod('master/blade-type/delete', params);
  }

  // Component Master

  fetchAllComponents(params: any): Observable<any>{
    return this.postMethod('master/wtg-component/get-all', params);
  }

  // Capacity Master

  fetchAllCapacities(params: any): Observable<any>{
    return this.postMethod('master/capacity/get-all', params);
  }

  createCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/create', params);
  }

  updateCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/update', params);
  }

  deleteCapacity(params: any): Observable<any>{
    return this.postMethod('master/capacity/delete', params);
  }

  // Zone Master

  fetchAllZones(params: any): Observable<any>{
    return this.postMethod('master/zone/get-all', params);
  }

  createZone(params: any): Observable<any>{
    return this.postMethod('master/zone/create', params);
  }

  updateZone(params: any): Observable<any>{
    return this.postMethod('master/zone/update', params);
  }

  deleteZone(params: any): Observable<any>{
    return this.postMethod('master/zone/delete', params);
  }


  // PPA-Type Master

  fetchAllPpaTypes(params: any): Observable<any>{
    return this.postMethod('master/ppa-type/get-all', params);
  }

  createPpaType(params: any){
    return this.postMethod('master/ppa-type/create', params);
  }

  updatePpaType(params: any){
    return this.postMethod('master/ppa-type/update', params);
  }

  deletePpaType(params: any){
    return this.postMethod('master/ppa-type/delete', params);
  }

  // Tower Type Master

  fetchAllTowerTypes(params: any): Observable<any>{
    return this.postMethod('master/tower-type/get-all', params);
  }

  createTowerType(params: any): Observable<any>{
    return this.postMethod('master/tower-type/create', params);
  }

  updateTowerType(params: any){
    return this.postMethod('master/tower-type/update', params);
  }

  deleteTowerType(params: any){
    return this.postMethod('master/tower-type/delete', params);
  }

  // Grid Connectivity Master

  fetchAllGridConnectivities(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/get-all', params);
  }

  createGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/create', params);
  }

  updateGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/update', params);
  }

  deleteGridConnectivity(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/delete', params);
  }

  // WTG Type Master

  fetchAllWTGTypes(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/get-all', params);
  }

  createWTGTypes(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/create', params);
  }

  updateWTGType(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/update', params);
  }

  deleteWTGType(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/delete', params);
  }

  // Department Master

  fetchAllDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/get-all', params);
  }

  createDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/create', params);
  }

  updateDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/update', params);
  }

  deleteDepartments(params: any): Observable<any>{
    return this.postMethod('master/organization/department/delete', params);
  }

  // Company User Master

  fetchAllCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/search', params);
  }

  createCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/create', params);
  }

  updateCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/update', params);
  }

  deleteCompanyUsers(params: any): Observable<any>{
    return this.postMethod('auth/company-user/delete', params);
  }

  // UserGroup Master

  fetchAllUserGroups(params: any): Observable<any>{
    return this.postMethod('auth/user-group/search', params);
  }

  createUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/create', params);
  }

  updateUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/update', params);
  }

  deleteUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-group/delete', params);
  }

  fetchUserGroupInfo(params: any): Observable<any>{
    return this.postMethod('auth/user-group/info', params);
  }

  // Role Master

  fetchAllRoles(params: any): Observable<any>{
    return this.postMethod('auth/role/search', params);
  }

  // Cluster Master

  fetchAllClusters(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/get-all', params);
  }

  createCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/create', params);
  }

  updateCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/update', params);
  }

  deleteCluster(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/delete', params);
  }

  // User - User Group Mapping

  fetchUsersByUserGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/get-group-users', params);
  }

  fetchUserGroupsByUser(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/get-user-groups', params);
  }

  assignUserGroupsToUser(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/assign-group', params);
  }

  customerSearch(params: any): Observable<any>{
    return this.postMethod('master/customer/search', params);
  }
  customerGet(params: any): Observable<any>{
    return this.postMethod('master/customer/get', params);
  }
  createCustomer(params: any): Observable<any>{
    return this.postMethod('master/customer/create', params);
  }

  foundationExport(params: any): Observable<any>{
     return this.postMethod(
    'foundation/export',
    params,
    { responseType: 'blob' }
  );
  }
   foundationImport(params: any): Observable<any>{
    return this.postMethod('foundation/import', params);
  }

  spvAdd(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/add', params);
  }
  spvUpdate(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/update', params);
  }
  spvDelete(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/delete', params);
  }
  userGroupInfo(params: any): Observable<any>{
    return this.postMethod('auth/user-group/info', params);
  }
  assignGroup(params: any): Observable<any>{
    return this.postMethod('auth/user-user-group/assign-group', params);
  }

  projectSearch(params: any): Observable<any>{
    return this.postMethod('project/search', params);
  }
  projectCreate(params: any): Observable<any>{
    return this.postMethod('project/create', params);
  }
  foundationActivities(params: any): Observable<any>{
    return this.postMethod('foundation/activities', params);
  }
  zoneInfo(params: any): Observable<any>{
    return this.postMethod('master/zone/info', params);
  }
  wtgTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/wtg-type/info', params);
  }
  capacityInfo(params: any): Observable<any>{
    return this.postMethod('master/capacity/info', params);
  }
  towerTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/tower-type/info', params);
  }
  bladeTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/blade-type/info', params);
  }
  gridConnectivityInfo(params: any): Observable<any>{
    return this.postMethod('master/grid-connectivity/info', params);
  }
  ppaTypeInfo(params: any): Observable<any>{
    return this.postMethod('master/ppa-type/info', params);
  }
  customerInfo(params: any): Observable<any>{
    return this.postMethod('master/customer/info', params);
  }
  clusterInfo(params: any): Observable<any>{
    return this.postMethod('master/organization/cluster/info', params);
  }
  companyUserInfo(params: any): Observable<any>{
    return this.postMethod('auth/company-user/info', params);
  }
  customerSpvInfo(params: any): Observable<any>{
    return this.postMethod('master/customer/spv/info', params);
  }
  locationExport(params: any): Observable<any>{
    return this.postMethod(
    'project/location/export',
    params,
    { responseType: 'blob' }
    );
  }

  locationImport(params: any): Observable<any>{
    return this.postMethod('project/location/import', params);
  }

  // Installation

  installationList(params: any): Observable<any>{
    return this.http.get(`${this.baseUrl}installation/all`);
  }

  installationExport(params: any): Observable<any>{
    return this.postMethod('installation/export', params, { responseType: 'blob' });
  }

  installationImport(params: any): Observable<any>{
    return this.postMethod('installation/import', params);
  }

  installationCreate(params: any): Observable<any>{
    return this.postMethod('installation/create-with-details', params);
  }

  // project

  fetchProjectDetails(params: any): Observable<any>{
    return this.postMethod('project/get', params);
  }

  // project location 

  fetchPrjLocationInfo(params: any): Observable<any>{
    return this.postMethod('project/location/info', params);
  }

  // Foundation

  createFoundationSoilTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/soil-test', params);
  }

  createFoundationExcavation(params: any): Observable<any>{
    return this.postMethod('foundation/activity/excavation', params);
  }

  createFoundationPCC(params: any): Observable<any>{
    return this.postMethod('foundation/activity/pcc', params);
  }

  createFoundationFlange(params: any): Observable<any>{
    return this.postMethod('foundation/activity/flange', params);
  }

  createFoundationReinforcement(params: any): Observable<any>{
    return this.postMethod('foundation/activity/reinforcement', params);
  }

  createFoundationEarthing(params: any): Observable<any>{
    return this.postMethod('foundation/activity/earthing', params);
  }

  createFoundationShuttering(params: any): Observable<any>{
    return this.postMethod('foundation/activity/shuttering', params);
  }

  createFoundationRaftCasting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/raft-casting', params);
  }

  createFoundationPedestalCasting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/pedestal-casting', params);
  }

  createFoundationCubeTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/foundation-cube-test', params);
  }

  createFoundationGrouting(params: any): Observable<any>{
    return this.postMethod('foundation/activity/grouting', params);
  }

  createFoundationGroutingCubeTest(params: any): Observable<any>{
    return this.postMethod('foundation/activity/grouting-cube-test', params);
  }

  createFoundationBackfilling(params: any): Observable<any>{
    return this.postMethod('foundation/activity/backfilling', params);
  }

  createFoundationApproachRoad(params: any): Observable<any>{
    return this.postMethod('foundation/activity/approach-road', params);
  }

  createFoundationCranePlatform(params: any){
    return this.postMethod('foundation/activity/crane-platform', params);
  }

  createFoundationLocationClearance(params: any){
    return this.postMethod('foundation/activity/location-clearance', params);
  }

  // Project Crane Detail

  fetchPrjCraneDetails(params: any): Observable<any>{
    return this.postMethod('project/crane-detail/get-project-cranes', params);
  }

  // Project WTG Detail

  fetchPrjWTGDetails(params: any): Observable<any>{
    return this.postMethod('project/wtg/get-all', params);
  }

  // auth/user-user-group/remove-group

  // auth/company-user/get
}

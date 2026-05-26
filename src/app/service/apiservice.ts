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

    customer(params: any): Observable<any>{
    return this.postMethod('master/customer/get', params);
  }
  createCustomer(params: any): Observable<any>{
    return this.postMethod('master/customer/create', params);
  }

  // auth/user-user-group/remove-group

  // auth/company-user/get
}

import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CronCreateRequest, CronJob } from '../models/data.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CronService {

  private apiURL = environment.apiRoute


  http = inject(HttpClient);

  getAllCronJobs(): Observable<CronJob[]>{
    return this.http.get<CronJob[]>(`${this.apiURL}/cron/all`, { withCredentials: true })
  }

  addCronJobs(data: any): Observable<CronCreateRequest>{
    return this.http.post<CronCreateRequest>(`${this.apiURL}/cron/create`, data , { withCredentials: true })
  }

  deleteCronJob(cronId: string): Observable<void>{
    return this.http.delete<void>(`${this.apiURL}/cron/delete?cronId=${cronId}`, { withCredentials: true })
  }

}

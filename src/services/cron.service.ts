import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CronCreateRequest, CronJob, ExecutionLogs } from '../models/data.models';
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

  updateCronJobs(cronId: string, data: any): Observable<CronCreateRequest>{
    return this.http.put<CronCreateRequest>(`${this.apiURL}/cron/edit?cronId=${cronId}`, data , { withCredentials: true })
  }

  deleteCronJob(cronId: string): Observable<void>{
    return this.http.delete<void>(`${this.apiURL}/cron/delete?cronId=${cronId}`, { withCredentials: true })
  }


  // Get logs for a specific cron job
  getLogsForACronJob(cronId: string, page: number = 0, size: number = 10, status: string = '', timeframe: string = ''): Observable<{logs: ExecutionLogs[], currentPage: number, totalItems: number, totalPages: number}>{
    let url = `${this.apiURL}/logs/single-cron/all?cronId=${cronId}&page=${page}&size=${size}`;
    if (status && status !== 'ALL') {
      url += `&status=${status}`;
    }
    if (timeframe && timeframe !== 'ALL') {
      url += `&timeframe=${timeframe}`;
    }
    return this.http.get<{logs: ExecutionLogs[], currentPage: number, totalItems: number, totalPages: number}>(url, { withCredentials: true })
  }

}

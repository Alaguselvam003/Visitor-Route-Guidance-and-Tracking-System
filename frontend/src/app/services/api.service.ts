import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem('jwt_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/visitor/register`, data, { responseType: 'text' });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data, { responseType: 'text' });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/visitor/verify-otp?email=${email}&otp=${otp}`, null, { responseType: 'text' });
  }

  gateEntry(token: string, gate: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/visitor/gate-entry?token=${token}&gate=${gate}`, null, { responseType: 'text' });
  }

  checkin(qrToken: string, host: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reception/checkin`, { qrToken, host }, { responseType: 'text' });
  }

  getReceptionQueue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reception/list`);
  }

  approveVisitor(qrToken: string, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reception/host-approval`, { qrToken, status }, { responseType: 'text' });
  }

  startMeeting(qrToken: string, durationMinutes: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reception/meeting/start`, { qrToken, durationMinutes }, { responseType: 'text' });
  }

  getVisitors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/visitor/list`);
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`, { headers: this.getHeaders() });
  }

  assignNfc(qrToken: string, nfcTag: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/visitor/assign-nfc?qrToken=${qrToken}&nfcTag=${nfcTag}`, null, { responseType: 'text' });
  }

  simulateZone(qrToken: string, zone: string, alert?: string): Observable<any> {
    const alertParam = alert ? `&alert=${encodeURIComponent(alert)}` : '';
    return this.http.post(`${this.baseUrl}/visitor/simulate-zone?qrToken=${qrToken}&zone=${zone}${alertParam}`, null, { responseType: 'text' });
  }
}

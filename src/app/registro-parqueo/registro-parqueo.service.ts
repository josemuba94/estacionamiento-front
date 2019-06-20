import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Estacionamiento } from '../modelo/estacionamiento';
import { Observable, throwError } from 'rxjs';
import { RegistroParqueo } from '../modelo/registroParqueo';
import { SolicitudIngreso } from '../modelo/solicitudIngreso';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroParqueoService {

  private estacionamiento: Estacionamiento;

  constructor(private httpClient: HttpClient) { }

  public darVehiculosIngresados(): Observable<Estacionamiento> {
    return this.httpClient.get<Estacionamiento>(environment.UrldarEstado);
  }

  public ingresarVehiculo(solicitudIngreso: SolicitudIngreso): Observable<RegistroParqueo> {
    return this.httpClient.post<RegistroParqueo>(environment.UrlingresarVehiculo, solicitudIngreso).pipe(
      retry(1),
      catchError(this.responseError)
    );
  }

  public sacarVehiculo(registroParqueo: RegistroParqueo): Observable<RegistroParqueo> {
    return this.httpClient.put<RegistroParqueo>(environment.UrlsacarVehiculo, registroParqueo).pipe(
      retry(1),
      catchError(this.responseError)
    );
  }

  public calcularSalida(placa: string): Observable<RegistroParqueo> {
    return this.httpClient.get<RegistroParqueo>(environment.UrlcalcularSalida + placa).pipe(
      retry(1),
      catchError(this.responseError)
    );
  }

  public responseError(error) {
    let errorMessage = '';
    errorMessage = error.error.message;
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

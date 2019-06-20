import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from "ngx-toastr";

import { RegistroParqueoService } from './registro-parqueo.service';
import { Estacionamiento } from '../modelo/estacionamiento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SolicitudIngreso } from '../modelo/solicitudIngreso';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RegistroParqueo } from '../modelo/registroParqueo';

@Component({
  selector: 'app-registro-parqueo',
  templateUrl: './registro-parqueo.component.html',
  styleUrls: ['./registro-parqueo.component.css'],
  providers: [RegistroParqueoService]
})
export class RegistroParqueoComponent implements OnInit {

  public estacionamiento: Estacionamiento;
  public esTipoMoto: boolean;
  public solicitudIngreso: SolicitudIngreso;
  public registroParqueo: RegistroParqueo;
  public modalSalida: BsModalRef;
  public placaSalida: string;

  constructor(private registroParqueoService: RegistroParqueoService, private modalService: BsModalService,
    private toastr: ToastrService) {
    this.solicitudIngreso = new SolicitudIngreso();
    this.cargarDatosIniciales();
  }

  ngOnInit() {
    this.esTipoMoto = false;
  }

  private cargarDatosIniciales() {
    this.registroParqueo = null;
    this.registroParqueoService.darVehiculosIngresados().subscribe(data => {
      this.estacionamiento = data;
    });
  }

  habilitarTipoMoto(tipoSelecctionado: string) {
    this.solicitudIngreso.esMotoAltoCilindraje = 'N';
    if (tipoSelecctionado === 'MOTO') {
      this.esTipoMoto = true;
    } else {
      this.esTipoMoto = false;
    }
  }

  solicitarIngreso() {
    if (this.validarSolicitud()) {
      this.solicitudIngreso.fecha = new Date();
      this.solicitudIngreso.placa = this.solicitudIngreso.placa.toUpperCase();
      this.registroParqueoService.ingresarVehiculo(this.solicitudIngreso).subscribe(data => {
        this.registroParqueo = data;
        this.toastr.success('El vehículo de placa ' + this.registroParqueo.placa +
          ' se ha ingresado exitosamente.', '');
        this.cargarDatosIniciales();
      }, error => {
        this.toastr.error(error, 'Se ha presentado un error');
      });
    }
  }

  validarSolicitud(): boolean {
    if (this.solicitudIngreso.placa == null) {
      this.toastr.error('Digite la placa del vehículo', 'Se ha presentado un error');
      return false;
    }
    if (this.solicitudIngreso.tipoVehiculo == null) {
      this.toastr.error('Seleccione el tipo de vehículo', 'Se ha presentado un error');
      return false;
    }
    return true;
  }

  calcularSalida(template: TemplateRef<any>) {
    if (this.placaSalida == null) {
      this.toastr.error('Digite la placa del vehículo', 'Se ha presentado un error');
    } else {
      this.placaSalida = this.placaSalida.toUpperCase();
      this.registroParqueoService.calcularSalida(this.placaSalida).subscribe(data => {
        this.registroParqueo = data;
        this.modalSalida = this.modalService.show(template);
      }, error => {
        this.toastr.error(error, 'Se ha presentado un error');
      });
    }
  }

  sacarVehiculo() {
    this.registroParqueoService.sacarVehiculo(this.registroParqueo).subscribe(data => {
      this.registroParqueo = data;
      this.toastr.success('El vehículo de placa ' + this.registroParqueo.placa +
        ' se ha sacado exitosamente.', '');
      this.cerrarModal();
      this.cargarDatosIniciales();
    }, error => {
      this.toastr.error(error, 'Se ha presentado un error');
    });
  }

  cerrarModal() {
    this.modalSalida.hide();
  }
}

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

  constructor(private registroParqueoService: RegistroParqueoService, private modalService: BsModalService,
    private toastr: ToastrService) {
    this.solicitudIngreso = new SolicitudIngreso();
    this.cargarDatosIniciales();
   }

  ngOnInit() {
    this.esTipoMoto = false;
  }

  private cargarDatosIniciales() {
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

  darSalidaModal(template: TemplateRef<any>
  ) {
    this.modalSalida = this.modalService.show(template);
  }

  cerrarModal() {
    this.modalSalida.hide();
  }

  solicitarIngreso() {
    this.validarSolicitud();
    this.solicitudIngreso.fecha = new Date();
    this.solicitudIngreso.placa = this.solicitudIngreso.placa.toUpperCase();
    console.log(this.solicitudIngreso);
    this.registroParqueoService.ingresarVehiculo(this.solicitudIngreso).subscribe(data => {
      this.registroParqueo = data;
      this.toastr.success('El vehículo de placa ' + this.registroParqueo.placa +
        ' se ha ingresado exitosamente.', '');
      this.cargarDatosIniciales();
    }, error => {
      this.toastr.error(error, 'Se ha presentado un error');
    });
  }

  validarSolicitud() {
    if (this.solicitudIngreso.placa == null) {
      this.toastr.error('Digite la placa del vehículo', 'Se ha presentado un error');
    }
    if (this.solicitudIngreso.tipoVehiculo == null) {
      this.toastr.error('Seleccione el tipo de vehículo', 'Se ha presentado un error');
    }
  }

}

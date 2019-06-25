import { EstacionamientoPage } from './estacionamiento.po';


describe('Prueba a la página de estacionamiento', () => {

    let estacionamientoPo: EstacionamientoPage;

    beforeEach(() => {
        estacionamientoPo = new EstacionamientoPage();
        estacionamientoPo.navigateTo();
    });

    it('Solicitar ingreso de vehículo', async () => {
        await estacionamientoPo.clickTextPlaca();
        await estacionamientoPo.setTextPlaca('FRE123');
        await estacionamientoPo.clickComboTipo();
        await estacionamientoPo.setTipoVehiculo(0);
        await estacionamientoPo.clickBtnSolicitar();
        await estacionamientoPo.esperarExistenciaToast();
        // Assert
        const mensajeAparecido = await estacionamientoPo.getTextToastMessage();
        expect(mensajeAparecido.trim()).toEqual('El vehículo de placa FRE123 se ha ingresado exitosamente.');
        // await estacionamientoPo.esperarDesaparicionToast
    });
});

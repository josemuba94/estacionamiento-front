import { by, browser, ElementFinder, $, ProtractorExpectedConditions, ExpectedConditions, element } from 'protractor';
import { baseUrl } from '../protractor.conf.js';

export class EstacionamientoPage {

    public until: ProtractorExpectedConditions;

    constructor() {
        this.until = ExpectedConditions;
    }

    public async navigateTo(): Promise<void> {
        return await browser.get(baseUrl + 'appComponent');
    }

    public getElementPlaca(): ElementFinder {
        return $('#placa');
    }

    public getTipoVehiculo(): ElementFinder {
        return $('#tipoVehiculo');
    }

    public getBtnSolicitarIngreso(): ElementFinder {
        return $('#btnSolicitarIngreso');
    }

    public getElementToastMessage(): ElementFinder {
        return element(by.className('toast-message'));
    }

    public async esperarExistencia(elemento: ElementFinder): Promise<void> {
        const id = elemento.getId();
        await browser.wait(this.until.presenceOf(elemento), 5000, 'El elemento ' + id + ' no cargó.');
    }

    public async esperarDesaparicion(elemento: ElementFinder): Promise<void> {
        const id = elemento.getId();
        await browser.wait(this.until.stalenessOf(elemento), 5000, 'El elemento ' + id + ' no se borró.');
    }

    public async esperarExistenciaToast(): Promise<void> {
        browser.sleep(500);
        await this.esperarExistencia(this.getElementToastMessage());
    }

    public async esperarDesaparicionToast(): Promise<void> {
        await this.esperarDesaparicion(this.getElementToastMessage());
    }

    public async setTextPlaca(placa: string): Promise<void> {
        await this.getElementPlaca().sendKeys(placa);
    }

    public async getTextToastMessage(): Promise<string> {
        return await this.getElementToastMessage().getText();
    }

    public async clickBtnSolicitar() {
        this.getBtnSolicitarIngreso().click();
    }

    public async clickComboTipo() {
        this.getTipoVehiculo().click();
    }

    public async clickTextPlaca() {
        this.getElementPlaca().click();
    }

    public async setTipoVehiculo(optIndex: number): Promise<void> {
        await browser.sleep(500);
        const options: ElementFinder[] = await this.getTipoVehiculo().all(by.tagName('option'));
        options[optIndex].click();
    }

}

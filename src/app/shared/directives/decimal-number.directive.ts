import { Attribute, Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[decimalNumber]'
})
export class DecimalNumber {
    private regex: RegExp;
    private allowedKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    constructor(private el: ElementRef, @Attribute('decimalPlaces') private decimalPlaces: any) {
        const dVal = this.decimalPlaces;
        this.regex = new RegExp("^\\d*\\.?\\d{0," + dVal + "}$");
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.allowedKeys.indexOf(event.key) !== -1) {
            return;
        }

        let current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;

        const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
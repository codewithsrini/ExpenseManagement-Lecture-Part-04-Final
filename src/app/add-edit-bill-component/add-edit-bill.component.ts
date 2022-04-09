import { Component, ElementRef, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomValidators } from '../shared/custom-validators';
import { ExpenseDetails, Particulars } from '../shared/model/Expense';
import { Units } from '../shared/model/Units';

@Component({
  selector: 'app-add-edit-bill',
  templateUrl: './add-edit-bill.component.html',
  styleUrls: ['./add-edit-bill.component.scss']
})
export class AddEditBillComponent implements OnInit {

  expenseForm: FormGroup;
  units: Units[] = [];

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { units: Units[], row: ExpenseDetails },
    private dialogRef: MatDialogRef<AddEditBillComponent>) {

    this.expenseForm = this.fb.group({
      amount: [''],
      billNumber: [''],
      billSettled: true,
      gid: [null],
      purchaseDate: ['', Validators.required],
      particulars: this.fb.array([]),
      shopName: ['', [Validators.required, Validators.minLength(3), CustomValidators.checkForWhitespace]],
    });

    if (data.units) {
      this.units = data.units;
    }

    if (data.row) {
      // if row is present then go to edit mode
      console.log(this.particulars);
      this.populateForm(data.row);
    } else {
      // If not in edit mode then add a blank particular
      this.particulars.push(this.createParticulars());
    }
  }

  ngOnInit(): void {
  }

  populateForm(data: ExpenseDetails) {
    this.expenseForm.patchValue({
      billNumber: data.billNumber,
      billSettled: data.billSettled,
      gid: data.gid,
      purchaseDate: data.purchaseDate,
      shopName: data.shopName
    });

    data.particulars.forEach((el: Particulars) => {
      this.populateParticulars(el);
    });
  }

  populateParticulars(data: Particulars) {
    // List of particulars
    this.particulars.push(this.createParticulars(data));
  }

  onControlChange(event: any, itemIndex: number): void {
    if (event.srcElement) {
      const controlName = event.srcElement.name;

      if (controlName === 'quantity' || controlName === 'ratePerUnit') {
        this.calculateAmount(itemIndex);
      }
    }
  }

  calculateAmount(itemIndex: number) {
    const particularsList = this.particulars;
    const particularGroup = particularsList.controls[itemIndex] as FormGroup;

    const quantity = particularGroup.get('quantity');
    const ratePerUnit = particularGroup.get('ratePerUnit');
    const amount = particularGroup.get('amount');

    amount?.setValue('');

    if (quantity?.value && ratePerUnit?.value) {
      const amt = quantity.value * ratePerUnit.value;
      amount?.setValue(amt);
    }
  }

  onSave(): void {
    console.log(this.expenseForm);
    if (!this.expenseForm.invalid) {
      // Save the form
      this.dialogRef.close(this.expenseForm.getRawValue());
    }
  }

  createParticulars(data?: Particulars): FormGroup {
    return this.fb.group({
      id: [data && data.id ? data.id : null],
      amount: [data && data.amount ? data.amount : ''],
      particular: [data && data.particular ? data.particular : '', [Validators.required, Validators.minLength(3), CustomValidators.checkForWhitespace]],
      quantity: [data && data.quantity ? data.quantity : '', [Validators.required, Validators.pattern(/^\d+\.?\d*$/)]],
      ratePerUnit: [data && data.ratePerUnit ? data.ratePerUnit : '', Validators.required],
      unit: [data && data.unit ? data.unit : '', Validators.required],
    });
  }

  get particulars(): FormArray {
    return <FormArray>this.expenseForm.get('particulars');
  }

  addItem(): void {
    this.particulars.push(this.createParticulars());
  }

  onDeleteItem(itemIndex: number): void {
    console.log(itemIndex);
    this.particulars.removeAt(itemIndex);
  }
}

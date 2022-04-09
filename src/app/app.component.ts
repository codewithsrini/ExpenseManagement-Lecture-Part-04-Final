import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddEditBillComponent } from './add-edit-bill-component/add-edit-bill.component';
import { ExpenseService } from './expense.service';
import { ExpenseDetails, Particulars, ShopDetails } from './shared/model/Expense';
import { Units } from './shared/model/Units';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  units: Units[] = [];

  @ViewChild('expenseTable') table!: MatTable<any>;
  rawDataList: any[] = [];
  dataSource = new MatTableDataSource<Particulars>();
  particularsList: Particulars[] = [];
  displayedColumns: string[] = ['id', 'shopName', 'particular', 'purchaseDate', 'quantity', 'unit', 'ratePerUnit', 'amount', 'edit'];

  constructor(private dialog: MatDialog, private expenseService: ExpenseService) { }

  ngOnInit() {
    this.expenseService.getUnits().subscribe((data: any) => {
      this.units = data;
    })

    this.dataSource.data = this.particularsList = this.mockData;
    this.rawDataList = this.mockRawData;
  }

  onAddBill(row?: any): void {
    const addBillDialog = this.dialog.open(AddEditBillComponent, {
      disableClose: true,
      panelClass: 'add-bill-container',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: {
        units: this.units,
        row: row
      }
    });

    addBillDialog.afterClosed().subscribe(data => {
      console.log(data);
      this.prepareData(data);
    });
  }

  generateUniq() {
    return '' + Math.random().toString(36).substr(2, 4);
  }

  prepareData(data: ExpenseDetails) {
    if (data && data.particulars) {
      let isEditMode = false;
      if (data.gid) {
        isEditMode = true;
        this.modifyRow(data);
      } else {
        this.addNewRow(data);
      }
    }
  }

  addNewRow(data: ExpenseDetails) {
    const shopDetails = this.getShopDetailsAsObject(data);
    const gid = this.generateUniq();
    data.gid = gid;

    this.rawDataList.push(data);

    data.particulars.forEach((el: Particulars) => {
      el.id = this.generateUniq();
      el.gid = gid;
      el.shopDetails = shopDetails;
      this.particularsList.push(el);
    });

    this.dataSource.data = this.particularsList;
  }

  modifyRow(data: ExpenseDetails) {
    const foundIndex = this.rawDataList.findIndex(el => el.gid === data.gid);
    this.rawDataList[foundIndex] = data;

    const gid = data.gid;
    const shopDetails = this.getShopDetailsAsObject(data);

    data.particulars.forEach((el: Particulars) => {
      const foundIndex = this.particularsList.findIndex(elm => elm.id === el.id);
      el.gid = gid;
      this.particularsList[foundIndex] = el;
      this.particularsList[foundIndex].shopDetails = shopDetails
    });

    this.dataSource.data = this.particularsList;
  }

  getShopDetailsAsObject(data: ExpenseDetails): ShopDetails {
    const shopDetails = {} as ShopDetails;
    shopDetails.shopName = data.shopName;
    shopDetails.purchaseDate = data.purchaseDate;
    shopDetails.billSettled = data.billSettled;
    shopDetails.billNumber = data.billNumber;

    return shopDetails;
  }

  onEdit(row: Particulars) {
    console.log(this.rawDataList.find(el => el.gid === row.gid));
    const foundRow = this.rawDataList.find(el => el.gid === row.gid);
    this.onAddBill(foundRow);
  }

  mockData: Particulars[] = [
    {
      "id": "tjzn",
      "amount": 120,
      "particular": "Live Chicken",
      "quantity": 1,
      "ratePerUnit": 120,
      "unit": "KG",
      "gid": "umzg",
      "shopDetails": {
        "shopName": "Broiler Shop",
        "purchaseDate": "2021-11-07T18:30:00.000Z",
        "billSettled": true,
        "billNumber": "DDDD"
      }
    },
    {
      "id": "jdvf",
      "amount": 240,
      "particular": "Boneless",
      "quantity": 2,
      "ratePerUnit": 120,
      "unit": "KG",
      "gid": "umzg",
      "shopDetails": {
        "shopName": "Broiler Shop",
        "purchaseDate": "2021-11-07T18:30:00.000Z",
        "billSettled": true,
        "billNumber": "DDDD"
      }
    },
    {
      "id": "6pyu",
      "amount": 240,
      "particular": "Mint",
      "quantity": 2,
      "ratePerUnit": 120,
      "unit": "PACKS",
      "gid": "h90h",
      "shopDetails": {
        "shopName": "ACME",
        "purchaseDate": "2021-11-07T18:30:00.000Z",
        "billSettled": false,
        "billNumber": "AAAAAA"
      }
    },
    {
      "id": "g15r",
      "amount": 240,
      "particular": "Curd",
      "quantity": 2,
      "ratePerUnit": 120,
      "unit": "PACKS",
      "gid": "h90h",
      "shopDetails": {
        "shopName": "ACME",
        "purchaseDate": "2021-11-07T18:30:00.000Z",
        "billSettled": false,
        "billNumber": "AAAAAA"
      }
    }
  ];

  mockRawData = [
    {
      "amount": "",
      "billNumber": "DDDD",
      "billSettled": true,
      "purchaseDate": "2021-11-07T18:30:00.000Z",
      "particulars": [
        {
          "id": "tjzn",
          "amount": 120,
          "particular": "Live Chicken",
          "quantity": "1",
          "ratePerUnit": "120",
          "unit": "KG",
          "gid": "umzg",
          "shopDetails": {
            "shopName": "Broiler Shop",
            "purchaseDate": "2021-11-07T18:30:00.000Z",
            "billSettled": true,
            "billNumber": "DDDD"
          }
        },
        {
          "id": "jdvf",
          "amount": 240,
          "particular": "Boneless",
          "quantity": "2",
          "ratePerUnit": "120",
          "unit": "KG",
          "gid": "umzg",
          "shopDetails": {
            "shopName": "Broiler Shop",
            "purchaseDate": "2021-11-07T18:30:00.000Z",
            "billSettled": true,
            "billNumber": "DDDD"
          }
        }
      ],
      "shopName": "Broiler Shop",
      "gid": "umzg"
    },
    {
      "amount": "",
      "billNumber": "AAAAAA",
      "billSettled": false,
      "purchaseDate": "2021-11-07T18:30:00.000Z",
      "particulars": [
        {
          "id": "6pyu",
          "amount": 240,
          "particular": "Mint",
          "quantity": "2",
          "ratePerUnit": "120",
          "unit": "PACKS",
          "gid": "h90h",
          "shopDetails": {
            "shopName": "ACME",
            "purchaseDate": "2021-11-07T18:30:00.000Z",
            "billSettled": true,
            "billNumber": "AAAAAA"
          }
        },
        {
          "id": "g15r",
          "amount": 240,
          "particular": "Curd",
          "quantity": "2",
          "ratePerUnit": "120",
          "unit": "PACKS",
          "gid": "h90h",
          "shopDetails": {
            "shopName": "ACME",
            "purchaseDate": "2021-11-07T18:30:00.000Z",
            "billSettled": true,
            "billNumber": "AAAAAA"
          }
        }
      ],
      "shopName": "ACME",
      "gid": "h90h"
    }
  ];
}

export interface Particulars {
    amount: number;
    gid?: string;
    id: string;
    particular: string;
    quantity: number;
    ratePerUnit: number;
    shopDetails?: ShopDetails;
    unit: string;
}

export interface ShopDetails {
    shopName: string;
    purchaseDate: string;
    billSettled: boolean;
    billNumber: string;
}

export interface ExpenseDetails {
    amount: number;
    billSettled: boolean;
    billNumber: string;
    purchaseDate: string;
    gid?: string;
    particulars: Particulars[];
    shopName: string;
}

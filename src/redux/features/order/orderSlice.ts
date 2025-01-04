import { TCustomer } from "@/components/customers/CustomerTable";
import { IMenuItemConsumption } from "@/components/menu-item-consumption/TypesAndDefault";
import { TTableData } from "@/components/Table/Table";
import { createSlice, createAsyncThunk, Action } from "@reduxjs/toolkit";

export type IItems = {
  item: IMenuItemConsumption;
  qty: number;
  rate: number;
  discount: number;
  isDiscount: boolean;
  isVat: boolean;
};

export type IUnregisteredCustomerInfo = {
  name: string;
  address: string;
};

export type TBranch = {
  _id?: string;
  bid?: string;
  name: string;
  phone: string;
  email: string;
  vatNo: string;
  isActive: boolean;
  address1: string;
  address2: string;
};

export type IOrder = {
  _id?: string;
  billNo?: string;
  date: Date;
  tableName: TTableData;
  waiter: string; //!change
  items?: IItems[];
  guest: number;
  sCharge: number;
  vat: number;
  percentDiscount: number;
  discountAmount: number;
  totalBill: number;
  totalVat: number;
  serviceCharge: number;
  totalDiscount: number;
  netPayable: number;
  pPaymentMode: string;
  paid: number;
  pPayment: number;
  due: number;
  cashBack: number;
  cashReceived: number;
  paymentMode: string;
  remark: string;
  serviceChargeRate: number;
  discountCard?: string;
  customer: TCustomer | IUnregisteredCustomerInfo;
  guestType: string;
  status: string;
  branch: string | TBranch;
};

const initialState: IOrder = {
  billNo: 0,
  date: new Date(),
  guest: 0,
  sCharge: 0,
  vat: 5,
  percentDiscount: 0,
  discountAmount: 0,
  totalBill: 0,
  totalVat: 0,
  serviceCharge: 0,
  totalDiscount: 0,
  netPayable: 0,
  paid: 0,
  pPayment: 0,
  due: 0,
  cashBack: 0,
  cashReceived: 0,
  items: [],
  serviceChargeRate: 0,
  status: "not-Posted",
} as unknown as IOrder;

const balanceUpdater = (state: IOrder) => {
  if (state.items) {
    // 1. Total bill
    state.totalBill = state.items.reduce((total, item) => {
      return total + item.rate * item.qty;
    }, 0);

    // 2. discount
    state.totalDiscount = parseFloat(
      (
        state.items.reduce((total, item) => {
          const itemDiscount =
            item.rate *
            item.qty *
            (item.isDiscount
              ? (Number(item.discount) || Number(state.percentDiscount)) / 100
              : 0);

          return total + itemDiscount;
        }, 0) + Number(state.discountAmount)
      ).toPrecision(2)
    );

    // 3. vat
    state.totalVat = parseFloat(
      state.items
        .reduce((total, item) => {
          const itemDiscount =
            item.rate *
            item.qty *
            (item.isDiscount
              ? (Number(item.discount ?? 0) ||
                  Number(state.percentDiscount ?? 0)) / 100
              : 0);

          const itemGrossPrice = item?.rate * item?.qty;
          const itemCashDiscount =
            (state.discountAmount / state.totalBill) * itemGrossPrice;

          const vat = item?.isVat
            ? ((itemGrossPrice - itemDiscount - itemCashDiscount) *
                Number(state.vat ?? 0)) /
              100
            : 0;

          return total + vat;
        }, 0)
        .toPrecision(2)
    );

    // 4. Service Charge
    state.serviceCharge = parseFloat(
      (
        state.totalBill *
        (Number(state.serviceChargeRate ?? 0) / 100)
      ).toPrecision(2)
    );
    state.netPayable =
      state.totalBill +
      state.totalVat -
      state.totalDiscount +
      state.serviceCharge;

    state.due = state.netPayable - (state.paid ?? 0) - (state?.pPayment ?? 0);

    state.cashBack =
      state.cashReceived - state.netPayable > 0
        ? state.cashReceived - state.netPayable
        : 0;
  }
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    updateCustomerInfo: (state, { payload }) => {
      const customerInfo = Object.assign(state.customer ?? {}, payload);
      Object.assign(state, { customer: customerInfo });
    },
    updateBillDetails: (state, { payload }) => {
      Object.assign(state, payload);
      balanceUpdater(state);
    },
    addItem: (state, { payload }) => {
      if (state.items) {
        state.items.push(payload);
      } else {
        Object.assign(state, { items: [payload] });
      }

      balanceUpdater(state);
    },
    removeItem: (state, action) => {
      if (state.items?.length)
        state.items = state.items.filter(
          (item) => item.item.itemCode !== action.payload
        );

      balanceUpdater(state);
    },
    toggleDiscount: (state, action) => {
      if (state.items && state.items.length) {
        const item = state.items.find(
          (item) => item.item.itemCode === action.payload
        );
        if (item) {
          item.isDiscount = !item.isDiscount;
        }
      }
      balanceUpdater(state);
    },
    toggleVat: (state, action) => {
      if (state.items && state.items.length) {
        const item = state.items.find(
          (item) => item.item.itemCode === action.payload
        );
        if (item) {
          item.isVat = !item.isVat;
        }
      }
      balanceUpdater(state);
    },
    incrementQty: (state, action) => {
      if (state?.items?.length) {
        const index = state.items.findIndex(
          (item) => item.item.itemCode === action.payload
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            qty: state.items[index].qty + 1,
          };
          balanceUpdater(state);
        }
      }
    },
    decrementQty: (state, action) => {
      if (state?.items?.length) {
        const index = state.items.findIndex(
          (item) => item.item.itemCode === action.payload
        );
        if (index !== -1) {
          if (state.items[index].qty > 1) {
            state.items[index] = {
              ...state.items[index],
              qty: state.items[index].qty - 1,
            };
          } else {
            state.items.splice(index, 1);
          }
          balanceUpdater(state);
        }
      }
    },

    changeQty: (state, { payload }) => {
      if (state?.items?.length) {
        const index = state.items.findIndex(
          (item) => item.item.itemCode === payload?.itemCode
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            qty: payload?.qty,
          };

          balanceUpdater(state);
        }
      }
    },
    setItemDiscount: (state, { payload }) => {
      if (state?.items?.length) {
        const index = state.items.findIndex(
          (item) => item?.item?.itemCode == payload?.item?.itemCode
        );
        if (index !== -1) {
          state.items[index].discount = payload?.discount;
        }
      }
      balanceUpdater(state);
    },
    resetBill: () => initialState,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(saveBill.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(saveBill.fulfilled, (state) => {
  //       state.loading = false;
  //       state.error = null;
  //     })
  //     .addCase(saveBill.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload;
  //     });
  // },
});

export const {
  updateBillDetails,
  addItem,
  removeItem,
  toggleDiscount,
  toggleVat,
  resetBill,
  incrementQty,
  decrementQty,
  changeQty,
  setItemDiscount,
  updateCustomerInfo,
} = billSlice.actions;
export default billSlice.reducer;

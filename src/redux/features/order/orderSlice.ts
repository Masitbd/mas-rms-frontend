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

export type IOrder = {
  billNo: number;
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
  pPaymentMode: boolean;
  paid: number;
  pPayment: number;
  due: number;
  cashBack: number;
  cashReceived: number;
  paymentMode: string;
  remark: string;
};

const initialState: IOrder = {
  billNo: 0,
  date: new Date(),
  guest: 0,
  sCharge: 0,
  vat: 0,
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
} as unknown as IOrder;

// export const saveBill = createAsyncThunk(
//   "bill/saveBill",
//   async (billData, { rejectWithValue }) => {
//     try {
//       // API call simulation
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return billData;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
const balanceUpdater = (state: IOrder) => {
  if (state.items) {
    state.totalBill = state.items.reduce((total, item) => {
      return total + item.rate * item.qty;
    }, 0);

    state.totalVat = state.items.reduce((total, item) => {
      return total + item.rate * item.qty * (item.item ? state.vat : 0);
    }, 0);

    state.totalDiscount =
      state.items.reduce((total, item) => {
        return (
          total +
          item.rate *
            item.qty *
            (item.item.isDiscount ? state.percentDiscount : 0)
        );
      }, 0) + state.discountAmount;

    state.netPayable = state.totalBill + state.totalVat - state.totalDiscount;

    state.due = state.totalBill + state.paid;
  }
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
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
          item.item.isDiscount = !item.item.isDiscount;
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
          item.item.isVat = !item.item.isVat;
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
  resetBill,
  incrementQty,
  decrementQty,
  changeQty,
  setItemDiscount,
} = billSlice.actions;
export default billSlice.reducer;

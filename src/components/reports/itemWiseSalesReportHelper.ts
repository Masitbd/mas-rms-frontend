type ItemCategory = {
  _id: string;
  uid: string;
  name: string;
  menuGroup: string;
};

export type SalesItem = {
  _id: string;
  rate: number;
  qty: number;
  itemCategory: ItemCategory;
  itemName: string;
  itemCode: string;
};

type CategoryItemRow = SalesItem & { amount: number };

type CategoryGroup = {
  categoryId: string;
  category: ItemCategory;
  items: CategoryItemRow[];
  totalQty: number;
  totalAmount: number;
};

type CategoryGroupedSummary = {
  categories: CategoryGroup[];
  grandTotalQty: number;
  grandTotalAmount: number;
};

export function groupItemsByCategory(
  items: SalesItem[]
): CategoryGroupedSummary {
  const map = new Map<string, CategoryGroup>();

  let grandTotalQty = 0;
  let grandTotalAmount = 0;

  for (const it of items ?? []) {
    const catId = it.itemCategory?._id;
    if (!catId) continue;

    const qty = it.qty ?? 0;
    const rate = it.rate ?? 0;
    const amount = rate * qty;

    if (!map.has(catId)) {
      map.set(catId, {
        categoryId: catId,
        category: it.itemCategory,
        items: [],
        totalQty: 0,
        totalAmount: 0,
      });
    }

    const g = map.get(catId)!;

    g.items.push({ ...it, amount });
    g.totalQty += qty;
    g.totalAmount += amount;

    grandTotalQty += qty;
    grandTotalAmount += amount;
  }

  const categories = Array.from(map.values());

  // sort by category.uid (numeric)
  categories.sort((a, b) => {
    const au = Number(a.category.uid);
    const bu = Number(b.category.uid);

    // if both are valid numbers -> numeric sort
    if (!Number.isNaN(au) && !Number.isNaN(bu)) return au - bu;

    // fallback -> string sort
    return a.category.uid.localeCompare(b.category.uid);
  });

  return {
    categories: Array.from(map.values()),
    grandTotalQty,
    grandTotalAmount,
  };
}

type MenuItem = { rate?: number | string; qty?: number | string };
type MenuGroup = { items?: MenuItem[] };
type InputData = { result?: MenuGroup[] } | MenuGroup[];

export function calculateTotalForItemWiseSalesReport(data: InputData) {
  const groups: MenuGroup[] = Array.isArray(data) ? data : data.result ?? [];

  let totalItem = 0;
  let totalQuantity = 0;
  let totalAmount = 0;

  for (const g of groups) {
    const items = g.items ?? [];
    totalItem += items.length;

    for (const it of items) {
      const qty = Number(it.qty ?? 0) || 0;
      const rate = Number(it.rate ?? 0) || 0;

      totalQuantity += qty;
      totalAmount += rate * qty;
    }
  }

  return { totalItem, totalQuantity, totalAmount };
}

// Example:
// const totals = calcTotals(yourApiResponse);
// console.log(totals);

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  priceRange: [number, number];
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,
  priceRange: [0, 1000],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
} = productsSlice.actions;

export default productsSlice.reducer;
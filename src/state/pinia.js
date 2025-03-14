import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { useUserStore } from "./pinia/user";
import { useProductCategoryStore } from "./pinia/product-category";
import { useProductStore } from "./pinia/product";
import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export {
  useLayoutStore,
  useAuthStore,
  useUserStore,
  useProductCategoryStore,
  useProductStore,
};

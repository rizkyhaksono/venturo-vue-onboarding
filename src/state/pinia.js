import { useLayoutStore } from "./pinia/layout";
import { useAuthStore } from "./pinia/auth";
import { createPinia } from "pinia";

const pinia = createPinia();
export default pinia;

export { useLayoutStore, useAuthStore };

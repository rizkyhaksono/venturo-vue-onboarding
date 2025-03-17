import { defineStore } from "pinia";
import axios from "axios";
import { VUE_APP_APIURL } from "../api";

export const useProductCategoryStore = defineStore('category', {
  state: () => ({
    apiUrl: VUE_APP_APIURL,
    categories: [],
    error: {
      status: null,
      message: null,
      list: []
    },
    searchQuery: '',
    current: 1,
    perpage: 5,
    totalData: 0,
  }),
  actions: {
    async changePage(newPage) {
      this.current = newPage;
      await this.getCategories();
    },
    async getCategories() {
      try {
        const url = `${this.apiUrl}/api/v1/categories?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
        const res = await axios.get(url)
        this.categories = res.data.data.list
        this.totalData = res.data.data.meta.total
      } catch (error) {
        console.log(error);
      }
    },
    async updateCategory(category) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/categories`, category)
        this.error = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    async addCategory(category) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/categories`, category)
        this.error = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    async deleteCategory(id) {
      try {
        const res = await axios.delete(`${this.apiUrl}/api/v1/categories/${id}`)
        this.error = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        console.log(error);
        this.error = {
          status: error.response?.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    resetState() {
      this.categories = [];
      this.error = {
        status: null,
        message: null,
        list: []
      };
      this.searchQuery = '';
      this.current = 1;
      this.perpage = 5;
      this.totalData = 0;
    }
  }
})

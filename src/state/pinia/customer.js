import { defineStore } from "pinia";
import axios from "axios";
import { VUE_APP_APIURL } from "../api";

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    apiUrl: VUE_APP_APIURL,
    customers: [],
    customerById: '',
    response: {
      status: null,
      message: null,
      list: []
    },
    formAction: {
      'action': "",
      'form_title': "",
      'form_button': ""
    },
    totalData: 0,
    current: 1,
    perpage: 5,
    searchQuery: '',
    maxImageSize: 3 * 1024 * 1024
  }),
  actions: {
    openForm(newAction) {
      this.formAction.action = newAction
    },
    async getCustomers() {
      try {
        const url = `${this.apiUrl}/api/v1/customers?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
        const res = await axios.get(url)
        this.customers = res.data.data.list
        this.totalData = res.data.data.meta.total
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCustomer(id) {
      try {
        const res = await axios.delete(`${this.apiUrl}/api/v1/customers/${id}`);
        this.error = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    async changePage(newPage) {
      this.current = newPage;
    },
    async getCustomerById(id) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/v1/customers/${id}`);
        this.customerById = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async addCustomer(payload) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/customers`, payload);
        this.response = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    async updateCustomer(payload) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/customers/${payload.id}`, payload);
        this.response = {
          status: res.status,
          message: res.data.message
        };
      } catch (error) {
        console.log(error);
        this.response = {
          status: error.response.status,
          message: error.message,
          list: error.response.data.errors,
        };
      }
    },
    resetState() {
      this.customers = [];
      this.customerById = '';
      this.response = {
        status: null,
        message: null,
        list: []
      };
      this.formAction = {
        'action': "",
        'form_title': "",
        'form_button': ""
      };
      this.totalData = 0;
      this.current = 1;
      this.searchQuery = '';
    }
  }
})
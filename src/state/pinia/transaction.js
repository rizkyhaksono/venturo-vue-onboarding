import { defineStore } from "pinia";
import axios from "axios";
import { VUE_APP_APIURL } from "../api";

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    apiUrl: VUE_APP_APIURL,
    transactions: [],
    transactionById: '',
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
    async getTransactions() {
      try {
        const url = `${this.apiUrl}/api/v1/transactions?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
        const res = await axios.get(url)
        this.transactions = res.data.data.list
        this.totalData = res.data.data.meta.total
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTransaction(id) {
      try {
        const res = await axios.delete(`${this.apiUrl}/api/v1/transactions/${id}`);
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
    async getTransactionById(id) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/v1/transactions/${id}`);
        this.transactionById = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async createTransaction(data) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/transactions`, data);
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
    async updateTransaction(data) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/transactions/${data.id}`, data);
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
  }
})
import { defineStore } from "pinia";
import axios from "axios";
import { VUE_APP_APIURL } from "../api";

export const useSaleStore = defineStore('sale', {
  state: () => ({
    apiUrl: VUE_APP_APIURL,
    sales: [],
    saleById: '',
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
    async openForm(newAction) {
      this.formAction.action = newAction
      await this.getSales();
    },
    async getSales() {
      try {
        const url = `${this.apiUrl}/api/v1/sales?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`
        const res = await axios.get(url)
        this.sales = res?.data
        this.totalData = res?.data?.sales?.length
      } catch (err) {
        console.log(err)
      }
    },
    async deleteSale(id) {
      try {
        const res = await axios.delete(`${this.apiUrl}/api/v1/sales/${id}`)
        this.error = {
          status: res.status,
          message: res.data.message
        }
      } catch (err) {
        this.error = {
          status: err.response?.status,
          message: err.message,
          list: err.response.data
        }
      }
    },
    async changePage(newPage) {
      this.current = newPage
    },
    async searchUsers(query) {
      this.searchQuery = query
      this.current = 1;
    },
    async addSale(sale) {
      try {
        const res = await axios.post(`${this.apiUrl}/api/v1/sales`, sale)
        this.error = {
          status: res.status,
          message: res.data.message
        }
      } catch (err) {
        this.error = {
          status: err.response?.status,
          message: err.message,
          list: err.response.data.errors
        }
      }
    },
    async getSaleById(id) {
      try {
        const res = await axios.get(`${this.apiUrl}/api/v1/sales/${id}`)
        console.log(res)
        this.saleById = res
      } catch (err) {
        console.log(err)
      }
    },
    async updateSales(sale) {
      try {
        const res = await axios.put(`${this.apiUrl}/api/v1/sales`, sale)
        console.log(res)
        this.error = {
          status: res.status,
          message: res.data.message
        }
      } catch (err) {
        this.error = {
          status: err.response?.status,
          message: err.message,
          list: err.response.data.errors
        }
      }
    },
    resetState() {
      this.sales = []
      this.saleById = ''
      this.response = {
        status: null,
        message: null,
        list: []
      }
      this.formAction = {
        'action': "",
        'form_title': "",
        'form_button': ""
      }
      this.totalData = 0
      this.current = 1
      this.perpage = 5
      this.searchQuery = ''
      this.isEmpy = false
    }
  }
})
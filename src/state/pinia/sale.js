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
    openForm(newAction) {
      this.formAction.action = newAction
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
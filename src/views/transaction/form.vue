<template>
  <Layout>
    <span v-if="action_button">
      <PageHeader title="Edit Transaction" pageTitle="Edit Transaction" />
    </span>
    <span v-else>
      <PageHeader title="Form Transaction" pageTitle="Transaction" />
    </span>
    <BCard>
      <BCol>
        <BForm class="form-horizontal" role="form">
          <BRow class="mb-3">
            <label class="col-md-2 col-form-label" for="form-customer-id">Customer ID</label>
            <BCol md="10">
              <select class="form-control" v-model="formModel.m_customer_id"
                :class="{ 'is-invalid': !!(errorList && errorList.m_customer_id) }">
                <option value="" disabled>Pilih Customer</option>
                <option v-for="customer in customerList" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>
            </BCol>
          </BRow>
        </BForm>

        <BCol>
          <div class="table-responsive">
            <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="sale-list">
              <BThead>
                <BTr>
                  <BTh scope="col">
                    <span class="d-flex justify-content-center">
                      <BButton class="btn btn-sm btn-soft-info" @click="addDetail"><i class="mdi mdi-plus"></i>
                      </BButton>
                    </span>
                  </BTh>
                  <BTh scope="col">Product ID</BTh>
                  <BTh scope="col">Product Detail ID</BTh>
                  <BTh scope="col">Price</BTh>
                  <BTh scope="col">Total Item</BTh>
                </BTr>
              </BThead>
              <BTbody>
                <BTr v-for="(detail, i) in productDetail" :key="i">
                  <BTh>
                    <span class="d-flex justify-content-center">
                      <BButton @click="removeRow(detail.id, i)" class="btn btn-sm btn-soft-danger">
                        <i class="mdi mdi-minus"></i>
                      </BButton>
                    </span>
                  </BTh>
                  <BTh>
                    <select class="form-control" v-model="detail.m_product_id"
                      :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.m_product_id`]) }">
                      <option value="" disabled>Pilih Produk</option>
                      <option v-for="product in productList" :key="product.id" :value="product.id">
                        {{ product.name }}
                      </option>
                    </select>
                    <template v-if="!!(errorList && errorList[`details.${i}.m_product_id`])">
                      <div class="invalid-feedback" v-for="(err, index) in errorList[`details.${i}.m_product_id`]"
                        :key="index">
                        <span>{{ err }}</span>
                      </div>
                    </template>
                  </BTh>
                  <BTh>
                    <select class="form-control" v-model="detail.m_product_detail_id"
                      :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.m_product_detail_id`]) }">
                      <option value="" disabled>Pilih Detail Produk</option>
                      <option v-for="category in productCategoryList" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                    <template v-if="!!(errorList && errorList[`details.${i}.m_product_detail_id`])">
                      <div class="invalid-feedback"
                        v-for="(err, index) in errorList[`details.${i}.m_product_detail_id`]" :key="index">
                        <span>{{ err }}</span>
                      </div>
                    </template>
                  </BTh>
                  <BTh>
                    <input class="form-control" v-model="detail.price" type="number"
                      :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.price`]) }"
                      placeholder="Masukkan Harga" />
                    <template v-if="!!(errorList && errorList[`details.${i}.price`])">
                      <div class="invalid-feedback" v-for="(err, index) in errorList[`details.${i}.price`]"
                        :key="index">
                        <span>{{ err }}</span>
                      </div>
                    </template>
                  </BTh>
                  <BTh>
                    <input class="form-control" v-model="detail.total_item" type="number"
                      :class="{ 'is-invalid': !!(errorList && errorList[`details.${i}.total_item`]) }"
                      placeholder="Masukkan Total Item" />
                    <template v-if="!!(errorList && errorList[`details.${i}.total_item`])">
                      <div class="invalid-feedback" v-for="(err, index) in errorList[`details.${i}.total_item`]"
                        :key="index">
                        <span>{{ err }}</span>
                      </div>
                    </template>
                  </BTh>
                </BTr>
              </BTbody>
            </BTableSimple>
          </div>
        </BCol>
      </BCol>

      <BCardFooter>
        <div class="d-flex justify-content-end">
          <span>
            <BButton variant="secondary" class="me-2"
              @click="router.push({ name: 'transaction' }); saleStore.resetState()">
              Kembali
            </BButton>
            <BButton variant="primary" @click="addEditSale">Simpan</BButton>
          </span>
        </div>
      </BCardFooter>
    </BCard>
  </Layout>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useSaleStore, useProductStore, useProductCategoryStore, useCustomerStore } from "../../state/pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useProgress } from "@/helpers/progress";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js"

const route = useRoute();
const router = useRouter();
const saleStore = useSaleStore();
const productStore = useProductStore();
const productCategoryStore = useProductCategoryStore();
const customerStore = useCustomerStore();
const { startProgress, finishProgress, failProgress } = useProgress();
const transactionId = route.params.id;

const transactionDetail = ref([
  {
    m_product_id: "",
    m_product_category_id: "",
    total_item: "",
    price: "",
  }
])
const formModel = reactive({
  m_customer_id: "",
  product_detail: transactionDetail.value,
})

const action_button = ref();
const errorList = computed(() => saleStore.response.errorList || {});
const saleById = computed(() => saleStore.saleById || {});
const productById = computed(() => productStore.productById || {});
const action = computed(() => saleStore.formAction.action);

const productList = computed(() => productStore.products || []);
const productCategoryList = computed(() => productCategoryStore.categories || []);
const customerList = computed(() => customerStore.customers || []);

watch(() => route.params.id, async (newId) => {
  if (newId) {
    action_button.value = true;
    try {
      startProgress();
      await productStore.getProductById(newId);

      if (productById.value?.data?.product) {
        const product = productById.value.data.product;
        formModel.m_category_id = product.m_category_id;

        transactionDetail.value = product.details.map(detail => ({
          m_variant_id: detail.m_variant_id,
          stock: detail.stock,
          price: detail.price
        }));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      showErrorToast("Failed to fetch product details");
    } finally {
      finishProgress();
    }
  } else {
    action_button.value = false;
  }
}, { immediate: true });

const getSale = async () => {
  await saleStore.getSales();
}

const getProducts = async () => {
  await productStore.getProducts();
};

const getProductCategories = async () => {
  await productCategoryStore.getCategories();
};

const getCustomers = async () => {
  await customerStore.getCustomers();
};

const addDetail = () => {
  transactionDetail.value.push({
    m_product_id: "",
    m_product_detail_id: "",
    total_item: "",
    price: ""
  })
}

const addEditSale = async () => {
  try {
    if (action.value === "add") {
      startProgress();
      const response = await saleStore.addSale(formModel)
      if (response?.status === 201) {
        showSuccessToast("Sale saved successfully!");
        router.push({ name: "transaction" });
      } else {
        showErrorToast("Failed to save sale");
        failProgress();
      }
    }
    if (action.value === "edit") {
      startProgress();
      const response = await saleStore.updateSales(formModel, saleById.value.data.sale.id);
      if (response?.status === 200) {
        showSuccessToast("Sale updated successfully!");
        router.push({ name: "transaction" });
      } else {
        showErrorToast("Failed to update sale");
        failProgress();
      }
    }
  } catch (error) {
    console.error("Error:", error);
    showErrorToast("An error occurred");
  } finally {
    finishProgress();
  }
};

const removeRow = (id, index) => {
  transactionDetail.value.splice(index, 1);
}

onMounted(async () => {
  await getSale();
  await getProducts();
  await getProductCategories();
  await getCustomers();
})

console.log("Received Transaction ID:", transactionId); 
</script>
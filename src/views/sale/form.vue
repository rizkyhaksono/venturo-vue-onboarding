<template>
  <Layout>
    <span v-if="action_button">
      <PageHeader title="Edit Sale" pageTitle="Edit Sale" />
    </span>
    <span v-else>
      <PageHeader title="Form Sale" pageTitle="Sale" />
    </span>
    <BCard>
      <BRow>
        <BCol lg="6" md="12">
          <div v-if="imageEdit" class="mb-4">
            <div class="d-flex">
              <div>
                <BButton class="btn btn-sm btn-danger"><i class="mdi mdi-delete-outline"></i></BButton>
              </div>
              <img src="" alt="">
            </div>
          </div>
        </BCol>
      </BRow>
    </BCard>
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useSaleStore } from "../../state/pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import { useProgress } from "@/helpers/progress"
import { useRouter } from "vue-router";

const router = useRouter();

const saleStore = useSaleStore();

const productDetail = ref([
  {
    m_product_id: "",
    m_product_detail_id: "",
    total_item: "",
    price: ""
  }
])
const formOdel = reactive({
  m_customer_id: "",
  product_detail: productDetail.value
})

const action_button = ref();
const saleById = computed(() => saleStore.saleById || {});
const action = computed(() => saleStore.formAction.action);
const { startProgress, finishProgress, failProgress } = useProgress();

const watchAction = () => {
  if (action.value === "edit") {
    action_button.value = "Change";
    let sale = saleById.value;

    productDetail.value = sale.detail.map(detail => ({
      m_product_id: detail.m_product_id,
      m_product_detail_id: detail.m_product_detail_id,
      total_item: detail.total_item,
      price: detail.price
    }))

    formOdel.m_customer_id = sale.m_customer_id;
    formOdel.product_detail = productDetail.value;
  }
}

watch(productDetail, (newDetails) => {
  newDetails.forEach((detail, index) => {
    if (index === newDetails.length - 1) {
      return;
    }
    if (detail.m_product_id === "" || detail.m_product_detail_id === "" || detail.total_item === "" || detail.price === "") {
      return;
    }
    productDetail.value.push({
      m_product_id: "",
      m_product_detail_id: "",
      total_item: "",
      price: ""
    })
  })
})

const getSale = async () => {
  await saleStore.getSales();
}

onMounted(async () => {
  await getSale();
  watchAction();
})
</script>
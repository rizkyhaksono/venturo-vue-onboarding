<template>
  <Layout>
    <PageHeader title="Sale" pageTitle="Sale" />
    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody class="border-bottom">
            <div class="d-flex align-items-center">
              <BCardTitle class="mb-0 flex-grow-1">Sale List</BCardTitle>
              <div class="flex-shrink-0">
                <BButton class="btn btn-primary me-1">Add Sale</BButton>
                <BButton class="btn btn-light me-1" @click="getSales">
                  <i class="mdi mdi-refresh"></i>
                </BButton>
              </div>
            </div>
          </BCardBody>

          <BCardBody class="border-bottom">
            <BRow class="g-3">
              <BCol xxl="10" lg="8">
                <BFormInput type="text" class="form-control search" placeholder="Search for ..." />
              </BCol>
              <BCol xxl="2" lg="4">
                <BButton variant="soft-secondary" class="w-100">
                  <i class="mdi mdi-magnify align-middle"></i>
                  Cari
                </BButton>
              </BCol>
            </BRow>
          </BCardBody>

          <BCardBody>
            <div class="table-responsive">
              <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="sale-list">
                <BThead>
                  <BTr>
                    <BTh scope="col">Customer</BTh>
                    <BTh scope="col">Date</BTh>
                    <BTh scope="col">Detail</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="sale in rows" :key="sale.id">
                    <BTd>{{ sale.m_customer_id || "Unknown" }}</BTd>
                    <BTd>{{ sale.date || "N/A" }}</BTd>
                    <BTd>
                      <div class="sale-details">
                        <div v-for="detail in sale.details" :key="detail.id"
                          class="detail-card mb-2 p-3 border rounded">
                          <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-bold">ID: #{{ detail.id }}</span>
                            <span class="text-muted">Sales ID: #{{ detail.t_sales_id }}</span>
                          </div>
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <span class="text-primary">Product: {{ detail.m_product_id }}</span>
                              <small class="d-block text-muted">Detail: {{ detail.m_product_detail_id }}</small>
                            </div>
                            <div class="text-end">
                              <span class="d-block">Quantity: {{ detail.total_item }}</span>
                              <span class="fw-bold text-success">Price: ${{ detail.price }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
            <Pagination :currentPage="saleStore.current" :totalRows="saleStore.totalData" />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";
import { useSaleStore } from "../../state/pinia";
import { onMounted, ref } from "vue";
import { useProgress } from "@/helpers/progress";

const saleStore = useSaleStore();
const { startProgress, finishProgress, failProgress } = useProgress();
const rows = ref([]);

const getSales = async () => {
  try {
    startProgress();
    await saleStore.getSales();
    rows.value = saleStore.sales?.sales || []; // Ensure correct data access
    finishProgress();
  } catch (error) {
    failProgress();
    console.error("Error fetching sales:", error);
    rows.value = [];
  }
};

onMounted(getSales);
</script>

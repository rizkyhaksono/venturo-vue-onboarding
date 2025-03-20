<template>
  <Layout>
    <PageHeader title="Transaction" pageTitle="Transaction" />
    <BRow>
      <BCol lg="12">
        <BCard no-body>
          <BCardBody class="border-bottom">
            <div class="d-flex align-items-center">
              <BCardTitle class="mb-0 flex-grow-1">Transaction List</BCardTitle>
              <div class="flex-shrink-0">
                <BButton class="btn btn-primary me-1" @click="handleAddProduct">Add Transaction</BButton>
                <BLink href="#!" class="btn btn-light me-1" @click="getSaleMenu"><i class="mdi mdi-refresh"></i></BLink>
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

          <BCardBody class="border-bottom">
            <BRow class="g-3">
              <BCol v-for="product in productRows" :key="product.id" lg="3" md="6" class="mb-3">
                <BCard class="product-card h-100 transition-card" hover @click="handleTransactionClick(product.id)">
                  <BCardBody>
                    <h5 class="card-title">{{ product.name }}</h5>
                    <div class="mt-3">
                      <p class="mb-2">Price: Rp {{ product.price }}</p>
                      <p class="mb-0">{{ product.description }}</p>
                    </div>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
          </BCardBody>

          <BCardBody class="border-bottom">
            <div class="d-flex align-items-center">
              <BCardTitle class="mb-0 flex-grow-1">Sales Chart</BCardTitle>
            </div>
            <div class="mt-4">
              <VueApexCharts type="line" height="350" :options="chartLineOptions" :series="processLineChartData" />
            </div>
            <div class="mt-4">
              <VueApexCharts type="bar" height="350" :options="barChartOptions" :series="processBarChartData" />
            </div>
          </BCardBody>

          <BCardBody class="border-bottom">
            <div class="d-flex align-items-center">
              <BCardTitle class="mb-0 flex-grow-1">Sale Menu</BCardTitle>
              <div class="flex-shrink-0">
                <BButton class="btn btn-dark me-1" @click="getExportSalesCategory">
                  Export Sale Category <i class="mdi mdi-download"></i>
                </BButton>
              </div>
            </div>
          </BCardBody>
          <BCardBody class="border-bottom">
            <div class="table-responsive">
              <BTableSimple class="align-middle dt-responsive nowrap w-100 table-check" id="user-list">
                <BThead>
                  <BTr>
                    <BTh>Date</BTh>
                    <BTh>Category</BTh>
                    <BTh>Product</BTh>
                    <BTh>Total Sales</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(transaction, index) in formattedTransactions" :key="index">
                    <BTd>{{ transaction.date }}</BTd>
                    <BTd>{{ transaction.category }}</BTd>
                    <BTd>{{ transaction.product }}</BTd>
                    <BTd>{{ transaction.total_sales }}</BTd>
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import VueApexCharts from "vue3-apexcharts";
import { useSaleStore, useProductStore } from "../../state/pinia";
import { useRouter } from "vue-router";
import { useProgress } from "@/helpers/progress";
import { computed, onMounted, ref } from "vue";

const router = useRouter();
const saleMStore = useSaleStore();
const productStore = useProductStore();
const { startProgress, finishProgress, failProgress } = useProgress();

const productRows = ref([]);
const saleMenuRows = ref([]);

const getProducts = async () => {
  startProgress();
  await productStore.getProducts()
  if (productStore.products) {
    finishProgress();
    productRows.value = productStore.products || [];
  } else {
    failProgress();
    productRows.value = [];
  }
}

const getSaleMenu = async () => {
  try {
    startProgress();
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const res = await saleMStore.saleMenu("2025-03-01", endDate);
    finishProgress();
    saleMenuRows.value = res?.data.data || [];
  } catch (err) {
    failProgress();
    saleMenuRows.value = [];
  }
}

const getExportSalesCategory = async () => {
  try {
    startProgress();
    const res = await saleMStore.downloadSaleCategory();
    const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "sales-category-report.xlsx";
    link.click();
    window.URL.revokeObjectURL(link.href);
    finishProgress();
  } catch (err) {
    failProgress();
  }
}

const formattedTransactions = computed(() => {
  let transactions = [];
  saleMenuRows.value.forEach((category) => {
    category.products.forEach((product) => {
      product.transactions.forEach((transaction) => {
        transactions.push({
          date: transaction.date_transaction,
          category: category.category_name,
          product: product.product_name,
          total_sales: transaction.total_sales,
        });
      });
    });
  });
  return transactions;
});

const handleAddProduct = () => {
  saleMStore.openForm("add");
  router.push({ name: "sale-form" });
}

const handleTransactionClick = (id) => {
  saleMStore.openForm("add");
  router.push({ name: "transaction-form", params: { id: id.toString() } });
}

const processLineChartData = computed(() => {
  if (!saleMenuRows.value[0]?.products) return [];

  return saleMenuRows.value[0].products.map((product) => ({
    name: product.product_name,
    data: product.transactions.map((t) => t.total_sales),
  }));
});

const chartLineOptions = computed(() => ({
  chart: { height: 350, type: "line", toolbar: { show: true } },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
  xaxis: {
    categories:
      saleMenuRows.value[0]?.products[0]?.transactions
        ? saleMenuRows.value[0].products[0].transactions.map((t) =>
          new Date(t.date_transaction).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        )
        : [],
    tickAmount: 10,
  },
  tooltip: {
    y: { formatter: (value) => `Rp ${value.toLocaleString()}` },
  },
  colors: ["#f87979", "#7367f0"],
  legend: { position: "top", horizontalAlign: "right", floating: true, offsetY: -25, offsetX: -5 },
}));

const processBarChartData = computed(() => {
  if (!saleMenuRows.value[0]?.products) return [];

  return saleMenuRows.value[0].products.map((product) => ({
    name: product.product_name,
    data: product.transactions?.map((t) => t.total_sales) || [],
  }));
});

const barChartOptions = computed(() => ({
  chart: { type: "bar", height: 350, toolbar: { show: true }, stacked: false },
  plotOptions: { bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories:
      saleMenuRows.value[0]?.products[0]?.transactions
        ? saleMenuRows.value[0].products[0].transactions.map((t) =>
          new Date(t.date_transaction).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        )
        : [],
    tickAmount: 10,
  },
  yaxis: { title: { text: "Total Sales (Rp)" } },
  fill: { opacity: 1 },
  tooltip: {
    y: { formatter: (value) => `Rp ${value.toLocaleString()}` },
  },
}));

onMounted(async () => {
  await getProducts();
  await getSaleMenu();
});
</script>

<style scoped>
.transition-card {
  transition: all 0.3s ease;
}

.transition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
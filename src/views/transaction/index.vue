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
                <BButton class="btn btn-primary me-1">Add Transaction</BButton>
                <BLink href="#!" class="btn btn-light me-1"><i class="mdi mdi-refresh"></i></BLink>
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

        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
</script>
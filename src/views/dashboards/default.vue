<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

/**
 * Dashboard Component
 */
export default {
  components: {
    Layout,
    PageHeader,
  },
}
</script>

<template>
  <Layout>
    <PageHeader title="Default" pageTitle="Dashboards" />
    <h1 class="h4 fw-bold mb-4">Dashboard</h1>
    <!-- KPI Cards -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="small text-muted">Users</div>
              <div class="fs-4 fw-bold">8,412</div>
            </div>
            <div class="text-success fs-5">+5%</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="small text-muted">New Signups</div>
              <div class="fs-4 fw-bold">342</div>
            </div>
            <div class="text-primary fs-5">+2%</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="small text-muted">Revenue</div>
              <div class="fs-4 fw-bold">$24,890</div>
            </div>
            <div class="text-success fs-5">+12%</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="small text-muted">Conversion</div>
              <div class="fs-4 fw-bold">3.8%</div>
            </div>
            <div class="text-danger fs-5">-0.4%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content: chart + activity -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-lg-8">
        <div class="card p-3 h-100">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h2 class="h6 mb-0">Traffic (last 30 days)</h2>
            <div class="small text-muted">Updated just now</div>
          </div>

          <!-- Chart placeholder: replace with your chart component -->
          <div class="bg-light rounded d-flex align-items-center justify-content-center text-muted"
            style="height:16rem;">
            Chart placeholder
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card p-3 h-100">
          <h3 class="h6 mb-3">Recent Activity</h3>
          <ul class="list-unstyled mb-0">
            <li class="d-flex align-items-start mb-3">
              <span class="rounded-circle bg-success me-3"
                style="width:10px; height:10px; display:inline-block; margin-top:.35rem;"></span>
              <div>
                <div class="fw-semibold">Payment received</div>
                <div class="small text-muted">Order #1245 — 2 hours ago</div>
              </div>
            </li>

            <li class="d-flex align-items-start mb-3">
              <span class="rounded-circle bg-warning me-3"
                style="width:10px; height:10px; display:inline-block; margin-top:.35rem;"></span>
              <div>
                <div class="fw-semibold">New user signup</div>
                <div class="small text-muted">Jane Doe — 4 hours ago</div>
              </div>
            </li>

            <li class="d-flex align-items-start">
              <span class="rounded-circle bg-danger me-3"
                style="width:10px; height:10px; display:inline-block; margin-top:.35rem;"></span>
              <div>
                <div class="fw-semibold">Failed payment</div>
                <div class="small text-muted">Order #1242 — 1 day ago</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Recent orders table -->
    <div class="card p-3">
      <h3 class="h6 mb-2">Recent Orders</h3>
      <div class="table-responsive">
        <table class="table table-sm mb-0">
          <thead class="text-muted">
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1254</td>
              <td>2025-09-29</td>
              <td>$320.00</td>
              <td><span class="text-success">Completed</span></td>
            </tr>
            <tr>
              <td>#1253</td>
              <td>2025-09-28</td>
              <td>$89.50</td>
              <td><span class="text-warning">Pending</span></td>
            </tr>
            <tr>
              <td>#1252</td>
              <td>2025-09-27</td>
              <td>$150.00</td>
              <td><span class="text-danger">Failed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>

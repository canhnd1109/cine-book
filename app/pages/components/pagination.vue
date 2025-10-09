<script setup lang="ts">
// Example 1: Basic usage
const currentPage1 = ref(1)
const itemsPerPage1 = 10
const totalItems1 = 100

// Example 2: With custom styling
const currentPage2 = ref(1)
const itemsPerPage2 = 20
const totalItems2 = 250

// Example 3: With first/last buttons
const currentPage3 = ref(1)
const itemsPerPage3 = 5
const totalItems3 = 50

// Example 4: Different info positions
const currentPage4 = ref(1)
const itemsPerPage4 = 15
const totalItems4 = 150

const handlePageChange = (example: number, page: number) => {
  console.log(`Example ${example}: Changed to page ${page}`)
}
</script>

<template>
  <div class="space-y-8 p-6">
    <h1 class="text-3xl font-bold mb-6">BasePagination Examples (Using Nuxt UI)</h1>

    <!-- Example 1: Basic Usage -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">1. Basic Usage</h2>
      <BasePagination
        :current-page="currentPage1"
        :items-per-page="itemsPerPage1"
        :total="totalItems1"
        @update:page="
          page => {
            currentPage1 = page
            handlePageChange(1, page)
          }
        "
      />
      <p class="text-sm text-gray-600">Current page: {{ currentPage1 }}</p>
    </div>

    <!-- Example 2: Custom Styling -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">2. Custom Styling (Primary Color, Outline Variant)</h2>
      <BasePagination
        :current-page="currentPage2"
        :items-per-page="itemsPerPage2"
        :total="totalItems2"
        variant="outline"
        color="primary"
        size="lg"
        @update:page="
          page => {
            currentPage2 = page
            handlePageChange(2, page)
          }
        "
      />
      <p class="text-sm text-gray-600">Current page: {{ currentPage2 }}</p>
    </div>

    <!-- Example 3: With First/Last Buttons -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">3. With First/Last Buttons</h2>
      <BasePagination
        :current-page="currentPage3"
        :items-per-page="itemsPerPage3"
        :total="totalItems3"
        :show-first-last="true"
        :max-buttons="3"
        @update:page="
          page => {
            currentPage3 = page
            handlePageChange(3, page)
          }
        "
      />
      <p class="text-sm text-gray-600">Current page: {{ currentPage3 }}</p>
    </div>

    <!-- Example 4: Info Position Variants -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold">4. Info Position Variants</h2>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Left (Default)</h3>
        <BasePagination
          :current-page="currentPage4"
          :items-per-page="itemsPerPage4"
          :total="totalItems4"
          info-position="left"
          @update:page="page => (currentPage4 = page)"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Right</h3>
        <BasePagination
          :current-page="currentPage4"
          :items-per-page="itemsPerPage4"
          :total="totalItems4"
          info-position="right"
          @update:page="page => (currentPage4 = page)"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Top</h3>
        <BasePagination
          :current-page="currentPage4"
          :items-per-page="itemsPerPage4"
          :total="totalItems4"
          info-position="top"
          @update:page="page => (currentPage4 = page)"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Bottom</h3>
        <BasePagination
          :current-page="currentPage4"
          :items-per-page="itemsPerPage4"
          :total="totalItems4"
          info-position="bottom"
          @update:page="page => (currentPage4 = page)"
        />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Without Info</h3>
        <BasePagination
          :current-page="currentPage4"
          :items-per-page="itemsPerPage4"
          :total="totalItems4"
          :show-info="false"
          @update:page="page => (currentPage4 = page)"
        />
      </div>
    </div>

    <!-- Example 5: Disabled State -->
    <div class="space-y-3">
      <h2 class="text-xl font-semibold">5. Disabled State</h2>
      <BasePagination :current-page="5" :items-per-page="10" :total="100" :disabled="true" />
    </div>

    <!-- Example 6: Different Sizes -->
    <div class="space-y-6">
      <h2 class="text-xl font-semibold">6. Different Sizes</h2>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Extra Small</h3>
        <BasePagination :current-page="1" :items-per-page="10" :total="100" size="xs" />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Small</h3>
        <BasePagination :current-page="1" :items-per-page="10" :total="100" size="sm" />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Medium (Default)</h3>
        <BasePagination :current-page="1" :items-per-page="10" :total="100" size="md" />
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-medium text-gray-600">Large</h3>
        <BasePagination :current-page="1" :items-per-page="10" :total="100" size="lg" />
      </div>
    </div>
  </div>
</template>

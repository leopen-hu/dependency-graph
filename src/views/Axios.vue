<template>
  <div class="axios-container page-container">
    <div class="page-title">Axios Test Page</div>
    <div class="user-info-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-input
              v-model="packageName"
              v-loading="loading"
              :disabled="loading"
              @input="onInput"
              @change="getPackageInfo"
              placeholder="Please input"
            >
              <template #prepend>Package</template>
            </el-input>
            <el-select-v2
              v-model="packageVersion"
              :options="options"
              :disabled="loading"
              @change="onSelect"
              filterable
              placeholder="Please select"
              style="width: 300px"
            />
          </div>
        </template>
        <div class="text item" v-if="allDependencies">
          <div v-for="key in Object.keys(allDependencies)" :key="key">
            {{ key }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useDependenciesStore } from '@/stores/dependencies'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, type Ref, computed, watch } from 'vue'
// import axios from '../utils/axios'

export default defineComponent({
  name: 'AxiosPage',
  setup() {
    const packageName = ref<string>()
    const packageVersion = ref<string>()
    const packageInfo: Ref = ref(null)
    const loading = ref(false)
    const useDependencies = useDependenciesStore()
    const { allDependencies, versions, currentVersion, currentName } =
      storeToRefs(useDependencies)
    const options = computed(() =>
      versions.value.map((version) => ({
        label: version,
        value: version,
      }))
    )
    const { reset, analysisPackageDeep } = useDependencies

    watch(
      () => currentVersion?.value,
      () => {
        console.log('currentVersion', currentVersion?.value)
        packageVersion.value = currentVersion?.value
      }
    )

    watch(
      () => currentName?.value,
      () => {
        packageName.value = currentName?.value
      }
    )

    watch(
      () => packageName.value,
      () => {
        reset()
      }
    )

    const onInput = () => {
      reset()
      packageVersion.value = undefined
    }

    const onSelect = () => {
      reset()
      getPackageInfo()
    }

    const getPackageInfo = async () => {
      if (packageName.value) {
        loading.value = true
        await analysisPackageDeep(packageName.value, packageVersion.value)
        loading.value = false
      }
    }

    return {
      packageName,
      packageVersion,
      packageInfo,
      loading,
      allDependencies,
      options,
      getPackageInfo,
      reset,
      onInput,
      onSelect,
    }
  },
})
</script>

<style scoped lang="scss">
.axios-container {
  .user-info-container {
    display: 'flex';
    justify-content: 'center';
    width: 100%;

    .info-list-box {
      padding: 10px;

      .text {
        font-size: 14px;
      }

      .item {
        margin-bottom: 18px;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .box-card {
      width: 480px;
    }
  }
  :global(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.3);
  }

  :global(.el-loading-mask .el-loading-spinner) {
    text-align: right;
  }

  :global(.el-loading-mask .circular) {
    width: 24px;
    margin-right: 12px;
  }
}
</style>
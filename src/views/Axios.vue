<template>
  <div class="axios-container page-container">
    <div class="container">
      <el-card class="card">
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
        <el-tabs v-model="activeTab">
          <el-tab-pane label="列表" name="list">
            <ul v-if="allDependencies">
              <li
                class="text item"
                v-for="key in Object.keys(allDependencies)"
                :key="key"
              >
                {{ key }}
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="树状图" name="tree">
            <div
              class="tree-container"
              v-if="!!Object.keys(allDependencies).length"
            >
              <dependency-tree />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useDependenciesStore } from '@/stores/dependencies'
import { storeToRefs } from 'pinia'
import { defineComponent, ref, computed, watch } from 'vue'
import DependencyTree from '@/components/DependencyTree.vue'
// import axios from '../utils/axios'

export default defineComponent({
  name: 'AxiosPage',
  setup() {
    const packageName = ref<string>()
    const packageVersion = ref<string>()
    const loading = ref(false)
    const useDependencies = useDependenciesStore()
    const { allDependencies, versions, currentVersion, currentName } =
      storeToRefs(useDependencies)
    const { analysisPackageDeep } = useDependencies

    const options = computed(() =>
      versions.value.map((version) => ({
        label: version,
        value: version,
      }))
    )

    watch(
      () => currentVersion?.value,
      () => {
        packageVersion.value = currentVersion?.value
      }
    )

    watch(
      () => currentName?.value,
      () => {
        packageName.value = currentName?.value
      }
    )

    const onInput = () => {
      console.log(JSON.stringify(allDependencies.value))
      allDependencies.value = {}
      versions.value = []
      packageVersion.value = undefined
    }

    const onSelect = () => {
      allDependencies.value = {}
      getPackageInfo()
    }

    const getPackageInfo = async () => {
      if (packageName.value) {
        loading.value = true
        await analysisPackageDeep(packageName.value, packageVersion.value)
        loading.value = false
      }
    }

    const activeTab = ref('list')
    // const onTabClick = (name: string) => {
    //   activeTab.value = name
    // }

    return {
      packageName,
      packageVersion,
      loading,
      allDependencies,
      options,
      getPackageInfo,
      onInput,
      onSelect,
      DependencyTree,
      activeTab,
    }
  },
})
</script>

<style scoped lang="scss">
.axios-container {
  height: 80vh;
  .container {
    display: 'flex';
    justify-content: 'center';
    width: 100%;
    height: 100%;

    .card {
      height: 100%;
    }

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

    .tree-container {
      padding-left: 12px;
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
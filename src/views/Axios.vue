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
          <div class="card-header">
            <el-button class="button" @click="extractTgz"
              >下载tgz文件
            </el-button>
          </div>

          <div class="card-header">
            <el-input v-model="git_url" placeholder="Please input git address">
              <template #prepend>git:</template>
            </el-input>
            <el-button class="button" @click="cloneGitLib2">Clone </el-button>
          </div>
        </template>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="平铺列表" name="list">
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
          <el-tab-pane label="树形列表" name="tree">
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
import axios from '@/utils/axios'
import { Archive } from 'libarchive.js'
import type { CompressedFile } from 'libarchive.js/src/compressed-file'
import type { FilesObject } from 'libarchive.js/src/libarchive'
// import { clone } from 'isomorphic-git'
import http from 'isomorphic-git/http/web'
import FS from '@isomorphic-git/lightning-fs'

interface WindowWithGit extends Window {
  git: any
}
declare var window: WindowWithGit

Archive.init({
  workerUrl: './dist/worker-bundle.js',
})

export default defineComponent({
  name: 'AxiosPage',
  setup() {
    const packageName = ref<string>()
    const packageVersion = ref<string>()
    const git_url = ref('https://github.com/hyin08/dependency-graph')
    const loading = ref(false)
    const useDependencies = useDependenciesStore()
    const { allDependencies, versions, currentVersion, currentName } =
      storeToRefs(useDependencies)
    const { analysisPackageDeep } = useDependencies
    const fs = new FS('testfs')

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
    async function isDir(path: string) {
      return new Promise((resolve, reject) => {
        // 判断文件还是目录
        fs.stat(path, undefined, (error, stats) => {
          if (error) {
            console.log(error)
            reject(error)
          }

          if (stats.isDirectory()) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
    }

    // 使用 isomorphic-git 库获取
    const cloneGitLib2 = async () => {
      var s = git_url.value
      const dir = s.substring(s.lastIndexOf('/')).replaceAll('-', '_')
      await window.git.clone({
        fs,
        http,
        dir,
        url: git_url.value,
        corsProxy: 'https://cors.isomorphic-git.org',
      })
      fs.readdir(dir, undefined, async (err, files) => {
        if (err) console.log(err)
        else {
          console.log('\nCurrent directory filenames:')
          for (let i = 0; i < files.length; i++) {
            if ((await isDir(`${dir}/${files[i]}`)) === false) {
              await fs.readFile(`${dir}/${files[i]}`, 'utf8', (err, data) => {
                if (err) console.log(err)
                else {
                  console.log('\nCurrent file:', files[i])
                  console.log(data)
                }
              })
            }
          }
        }
      })
    }

    const extractTgz = () => {
      loading.value = true
      // let tgz = versionInfo.value.dist.tarball
      const tgz = 'https://registry.npmjs.org/vue/-/vue-3.2.39.tgz'
      const filename = tgz.split('/').at(-1)

      if (!filename) {
        return
      }

      axios
        .get(tgz, {
          responseType: 'blob',
        })
        .then(async (response) => {
          console.log('response: ', response.data)
          const file = new File([response.data], filename, {
            type: 'application/x-compressed',
          })

          const archive = await Archive.open(file)
          const filesObj = await archive.getFilesObject()
          const files = filesObj.package as FilesObject
          const packageJsonFile = files['package.json'] as CompressedFile
          const ex_file = await packageJsonFile.extract()
          const package_info = await ex_file.text()
          console.log(package_info)
          loading.value = false
        })
        .catch((error) => {
          loading.value = false
          console.error(error)
        })
    }

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
      cloneGitLib2,
      extractTgz,
      git_url,
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
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getNpmPackageJson } from '@/utils/api'
import semver from 'semver'
import { isEmpty } from 'lodash'

export type PackageVersion = string
export type PackageName = string
export type PackageNameWithVersion = string

export interface PackageDependencies {
  [packageName: PackageName]: PackageVersion
}

export interface PackageJson {
  name: PackageName
  version: PackageVersion
  dependencies: PackageDependencies
  devDependencies?: PackageDependencies
  peerDependencies?: PackageDependencies
}

export interface DependencyMap {
  [packageName: PackageVersion]: PackageJson
}

export const useDependenciesStore = defineStore('packages', () => {
  const allDependencies = ref<DependencyMap>({})

  function reset() {
    allDependencies.value = {}
  }

  function analysisPackageJson(
    packageJson: PackageJson,
    packageNameWithVersion?: PackageNameWithVersion
  ) {
    const { name, version, dependencies, devDependencies, peerDependencies } =
      packageJson
    const dependencyKey = packageNameWithVersion || name

    allDependencies.value[dependencyKey] = {
      name,
      version,
      dependencies,
      devDependencies: devDependencies || {},
      peerDependencies: peerDependencies || {},
    }
  }

  async function analysisPackageDeep(
    packageName: PackageName,
    version?: PackageVersion
  ) {
    // TODO 支持 version 为 url 或 git
    let packageJson: PackageJson | undefined

    // 处理 packageName
    if (/^@?.+@.+/g.test(packageName)) {
      const array = packageName.split('@')
      packageName = array.length === 3 ? `@${array[1]}` : array[0]
      version = array.length === 3 ? array[2] : array[1]
    }

    // 如果在 allDependencies 找到适配版本，则结束处理
    if (
      version &&
      !!semver.maxSatisfying(
        Object.values(allDependencies.value)
          .filter((value) => value?.name === packageName)
          .map((value) => {
            return value.version
          }),
        version
      )
    ) {
      return
    }

    // 无 version 或 version 符合 semver 规则，通过 npm registry 获取 package.json
    if (!version || semver.valid(version) || semver.validRange(version)) {
      packageJson = await getNpmPackageJson({
        packageName,
        version: version || 'latest',
      })
      if (packageJson) {
        analysisPackageJson(
          packageJson,
          `${packageName}@${version || 'latest'}`
        )
      }
    }

    // 递归处理非空 dependencies
    if (packageJson && !isEmpty(packageJson.dependencies)) {
      const list = Object.entries(packageJson.dependencies)
      for (let i = 0; i < list.length; i++) {
        const [_name, _version] = list[i]
        await analysisPackageDeep(_name, _version)
      }
    }
  }

  return { allDependencies, reset, analysisPackageJson, analysisPackageDeep }
})

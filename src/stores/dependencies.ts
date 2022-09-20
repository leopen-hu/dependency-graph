import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getNpmPackageJson,
  getNpmVersionsAndMaxPackageJson,
} from '@/utils/npm-registry-api'
import semver from 'semver'
import { isEmpty } from 'lodash'
// import { setPackageVersions } from '@/utils/local-package-json'

// TODO 支持 version 为 url 或 git
export type PackageVersion = string // 1.0.0
export type PackageVersionRange = string // ~1.0.0
export type InputPackageVersion = PackageVersion | PackageVersionRange

export type PackageName = string // vue @vue/compile
export type PackageNameWithVersion = string // vue@3.0.0 @vue/compile@3.0.0
export type PackageNameWithVersionRange = string // vue@^3.0.0 @vue/compile@^3.0.0
export type InputPackageName =
  | PackageName
  | PackageNameWithVersion
  | PackageNameWithVersionRange

export type PackageDependencies = Record<PackageName, InputPackageVersion>

export interface PackageJson {
  name: PackageName
  version: PackageVersion
  dependencies: PackageDependencies
  devDependencies?: PackageDependencies
  peerDependencies?: PackageDependencies
}

export type PackageJsonMap = Record<PackageVersion, PackageJson>

export const useDependenciesStore = defineStore('packages', () => {
  const allDependencies = ref<PackageJsonMap>({})
  const versions = ref<PackageVersion[]>([])
  const currentVersion = ref<string>()
  const currentName = ref<string>()

  async function analysisPackageDeep(
    inputPackageName: InputPackageName,
    inputVersion?: InputPackageVersion,
    root = true
  ) {
    const { packageName, version, versionRange } = processParams(
      inputPackageName,
      inputVersion
    )

    // 如果在 allDependencies 找到适配版本，则结束处理
    if (inputVersion && hasLoaded(packageName, inputVersion)) {
      return
    }

    let packageJson: PackageJson | undefined

    // 有确定的 version，获取 package.json
    if (version) {
      packageJson = await getNpmPackageJson({
        packageName,
        version,
      })
      // 记录 root
      if (root) {
        versions.value = versions.value.length ? versions.value : [version]
        currentName.value = packageName
        currentVersion.value = version
      }
    }

    // 没有 version, 可被视为有 versionRange 或 两者皆无
    // TODO 添加其他类型后需要修改此处
    if (!version) {
      const { maxPackageJson, allVersions } =
        await getNpmVersionsAndMaxPackageJson({
          packageName: packageName,
          versionRange,
        })

      // 记录 root
      if (root) {
        versions.value = Object.keys(allVersions)
        currentVersion.value = maxPackageJson.version
        currentName.value = packageName
      }

      // TODO 缓存下载的所有依赖文件说明
      // setPackageVersions(purePackageName, allVersions)
      packageJson = maxPackageJson
    }

    if (!packageJson) {
      return
    }

    analysisPackageJson(
      packageJson,
      `${packageName}@${versionRange || version || packageJson.version}`
    )

    // 递归处理非空 dependencies
    if (!isEmpty(packageJson.dependencies)) {
      const list = Object.entries(packageJson.dependencies)
      for (let i = 0; i < list.length; i++) {
        const [_name, _version] = list[i]
        await analysisPackageDeep(_name, _version, false)
      }
    }
  }

  function processParams(
    inputPackageName: InputPackageName,
    inputVersion?: InputPackageVersion
  ) {
    let result: {
      packageName: PackageName
      version?: PackageVersion
      versionRange?: PackageVersionRange
    } = { packageName: inputPackageName }

    // 处理 inputPackageName
    const inputNameResult = processInputPackageName(inputPackageName)
    result = { ...result, ...inputNameResult }

    // 处理 inputVersion
    if (inputVersion) {
      const inputVersionResult = processInputPackageVersion(inputVersion)
      result = { ...result, ...inputVersionResult }
    }

    return result
  }

  function hasLoaded(packageName: PackageName, version: InputPackageVersion) {
    return !!semver.maxSatisfying(getLoadedVersions(packageName), version)
  }

  function analysisPackageJson(
    packageJson: PackageJson,
    packageName?: PackageNameWithVersion
  ) {
    const { name, version, dependencies, devDependencies, peerDependencies } =
      packageJson
    const dependencyKey = packageName || name
    const dependencyValue = {
      name,
      version,
      dependencies,
      devDependencies: devDependencies || {},
      peerDependencies: peerDependencies || {},
    }

    allDependencies.value[dependencyKey] = dependencyValue
  }

  function processInputPackageName(packageName: InputPackageName) {
    const result: {
      packageName: PackageName
      version?: PackageVersion
      versionRange?: PackageVersionRange
    } = { packageName }
    // 除去第一个字符串后不含有 "@"，表示不携带版本号
    if (!packageName.substring(1).includes('@')) {
      result.packageName = packageName
      return result
    }

    // @vue/cli@3.0.0 => ['', 'vue/cli', '3.0.0']
    // vue@~3.0.0 => ['vue', '~3.0.0']
    const array = packageName.split('@')
    result.packageName = array.length === 3 ? `@${array[1]}` : array[0]
    const tempVersion = array.length === 3 ? array[2] : array[1]

    const { version, versionRange } = processInputPackageVersion(tempVersion)
    result.version = version
    result.versionRange = versionRange

    return result
  }

  function processInputPackageVersion(inputVersion: InputPackageVersion) {
    const result: {
      version?: PackageVersion
      versionRange?: PackageVersionRange
    } = {}

    if (semver.valid(inputVersion)) {
      result.version = inputVersion
      return result
    }

    if (semver.validRange(inputVersion)) {
      result.versionRange = inputVersion
    }

    return result
  }

  function getLoadedVersions(packageName: PackageName) {
    return Object.values(allDependencies.value)
      .filter((dependency) => dependency?.name === packageName)
      .map((dependency) => {
        return dependency.version
      })
  }

  return {
    allDependencies,
    versions,
    currentVersion,
    currentName,
    analysisPackageDeep,
  }
})

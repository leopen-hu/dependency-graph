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

export type PackageName = string // vue @vue/compile
export type PackageNameWithVersion = string // vue@3.0.0 @vue/compile@3.0.0
export type PackageNameWithVersionRange = string // vue@^3.0.0 @vue/compile@^3.0.0

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
  const versions = ref<PackageVersion[]>([])
  const currentVersion = ref<string>()
  const currentName = ref<string>()

  function reset() {
    allDependencies.value = {}
    versions.value = []
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
    packageName:
      | PackageName
      | PackageNameWithVersion
      | PackageNameWithVersionRange,
    versionOrPath?: PackageVersion | PackageVersionRange,
    first = true
  ) {
    // 处理 packageName
    const packageNameResult = processPackageName(packageName)
    const { name: purePackageName } = packageNameResult
    let { version, versionRange } = packageNameResult

    // 处理 versionOrPath
    if (versionOrPath) {
      const versionResult = processVersionOrPath(versionOrPath)
      versionRange = versionResult.versionRange
      version = versionResult.version
    }

    // 如果在 allDependencies 找到适配版本，则结束处理
    const versionOrRange = version || versionRange
    if (versionOrRange && hasLoaded(purePackageName, versionOrRange)) {
      return
    }

    let packageJson: PackageJson | undefined

    // 有确定的 version，获取 package.json
    if (version) {
      packageJson = await getNpmPackageJson({
        packageName,
        version: version,
      })
      // 记录第一个包的所有类型
      if (first) {
        versions.value = Object.keys(version)
        currentName.value = purePackageName
        currentVersion.value = version
      }
    }

    if (!versionOrRange || versionRange) {
      // versionRange 或无 versionOrRange
      const { maxPackageJson, allVersions } =
        await getNpmVersionsAndMaxPackageJson({
          packageName: purePackageName,
          versionRange,
        })

      // 记录第一个包的所有类型
      if (first) {
        versions.value = Object.keys(allVersions)
        currentVersion.value = maxPackageJson.version
        currentName.value = purePackageName
      }

      // setPackageVersions(purePackageName, allVersions)
      packageJson = maxPackageJson
    }

    if (!packageJson) {
      return
    }

    analysisPackageJson(
      packageJson,
      `${purePackageName}@${versionRange || version || packageJson.version}`
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

  function processPackageName(
    packageName:
      | PackageName
      | PackageNameWithVersion
      | PackageNameWithVersionRange
  ) {
    const result: {
      name: PackageName
      version?: PackageVersion
      versionRange?: PackageVersionRange
    } = { name: packageName }
    // 除去第一个字符串后不含有 "@"，表示不携带版本号
    if (!packageName.substring(1).includes('@')) {
      result.name = packageName
      return result
    }

    // @vue/cli@3.0.0 => ['', 'vue/cli', '3.0.0']
    // vue@~3.0.0 => ['vue', '~3.0.0']
    const array = packageName.split('@')
    result.name = array.length === 3 ? `@${array[1]}` : array[0]
    const tempVersion = array.length === 3 ? array[2] : array[1]

    const { version, versionRange } = processVersionOrPath(tempVersion)
    result.version = version
    result.versionRange = versionRange

    return result
  }

  function processVersionOrPath(
    versionOrPath: PackageVersion | PackageVersionRange
  ) {
    const result: {
      version?: PackageVersion
      versionRange?: PackageVersionRange
    } = {}

    if (semver.valid(versionOrPath)) {
      result.version = versionOrPath
    }

    if (semver.validRange(versionOrPath)) {
      result.versionRange = versionOrPath
    }

    return result
  }

  function hasLoaded(
    packageName: PackageName,
    version: PackageVersion | PackageVersionRange
  ) {
    return !!semver.maxSatisfying(getLoadedVersions(packageName), version)
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
    reset,
    analysisPackageJson,
    analysisPackageDeep,
  }
})

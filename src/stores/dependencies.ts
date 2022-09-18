import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getPackageJson } from './http.mock'

export type PackageVersion = string
export type PackageSemverVersion = string
export type PackageName = string
export type PackageNameWithVersion = string
export type PackageNameWithSemverVersion = string

export interface PackageDependencies {
  [packageName: PackageName]: PackageSemverVersion
}

export interface PackageJson {
  name: PackageName
  version: PackageVersion
  dependencies: PackageDependencies
  devDependencies?: PackageDependencies
  peerDependencies?: PackageDependencies
}

export interface DependencyMap {
  [packageName: PackageNameWithSemverVersion]: PackageJson
}

export const useDependencies = defineStore('packages', () => {
  const allDependencies = ref<DependencyMap>({})

  function analysisPackageJson(
    packageJson: PackageJson,
    packageNameWithVersion?:
      | PackageNameWithSemverVersion
      | PackageNameWithVersion
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
      | PackageNameWithSemverVersion
      | PackageNameWithVersion
      | PackageName
    // TODO {name: '', version: version | http | github | git}
  ) {
    // TODO 根据不同的 version 类型，获取对应的url
    // TODO 如果 allDependencies 有匹配（~1.2.3 === >=1.2.3 且 < 2.0.0）的版本，跳过请求，直接复制该匹配版本的值

    const packageJson = await getPackageJson(packageName)
    console.log('analysisPackageDeep', packageName, packageJson)
    analysisPackageJson(packageJson, packageName)

    if (Object.keys(packageJson.dependencies).length) {
      const list = Object.entries(packageJson.dependencies)
      for (let i = 0; i < list.length; i++) {
        const [_name, _version] = list[i]
        await analysisPackageDeep(`${_name}@${_version}`)
      }
    }
  }

  return { allDependencies, analysisPackageJson, analysisPackageDeep }
})

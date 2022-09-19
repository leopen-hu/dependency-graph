/**
 * API 说明
 * https://registry.npmjs.org/:packageName 可以获取所有版本的package.json，含dependency
 * https://registry.npmjs.org/:packageName/:version 可以获取指定版本的package.json，含dependency
 */

import axios from './axios'
import semver from 'semver'
import type {
  PackageName,
  PackageVersion,
  PackageJson,
  PackageVersionRange,
} from '@/stores/dependencies'

const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

/**
 * 通过 registry api 获取 package.json
 */
export const getNpmPackageJson = async ({
  packageName,
  version,
  registry = DEFAULT_REGISTRY,
}: {
  packageName: PackageName
  version: PackageVersion
  registry?: string
}) => {
  const response: { data: PackageJson } = await axios.get(
    `${registry}/${packageName}/${version}`
  )
  return response.data
}

export const getNpmVersionsAndMaxPackageJson = async ({
  packageName,
  versionRange,
  registry = 'https://registry.npmjs.org',
}: {
  packageName: PackageName
  versionRange?: PackageVersionRange
  registry?: string
}) => {
  const response: {
    data: {
      versions: Record<PackageVersion, PackageJson>
      'dist-tags': Record<string, PackageVersion>
    }
  } = await axios.get(`${registry}/${packageName}`)

  const { versions } = response.data
  const maxVersionTag = 'latest'
  const maxVersion =
    (versionRange &&
      semver.maxSatisfying(Object.keys(versions), versionRange)) ||
    response.data['dist-tags'][maxVersionTag]

  return { allVersions: versions, maxPackageJson: versions[maxVersion] }
}

/**
 * API 说明
 * https://registry.npmjs.org/:packageName 可以获取所有版本的package.json，含dependency
 * https://registry.npmjs.org/:packageName/:version 可以获取指定版本的package.json，含dependency
 */

import axios from './axios'
import type {
  PackageName,
  PackageVersion,
  PackageJson,
} from '@/stores/dependencies'
import semver from 'semver'

/**
 * 通过 registry api 获取 package.json
 */
export const getNpmPackageJson = async ({
  packageName,
  version,
  registry = 'https://registry.npmjs.org',
}: {
  packageName: PackageName
  version: PackageVersion
  registry?: string
}) => {
  if (version === 'latest') {
    const response: { data: PackageJson } = await axios.get(
      `${registry}/${packageName}/latest`
    )
    return response.data
  }

  const response: {
    data: { versions: { [key: PackageVersion]: PackageJson } }
  } = await axios.get(`${registry}/${packageName}`)

  const { versions } = response.data
  const maxVersion = semver.maxSatisfying(Object.keys(versions), version)
  return maxVersion ? versions[maxVersion] : undefined
}

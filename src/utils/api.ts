import axios from './axios'
import type {
  PackageName,
  PackageVersion,
  PackageJson,
} from '@/stores/dependencies'
import semver from 'semver'

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

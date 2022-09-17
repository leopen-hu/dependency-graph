import type { PackageJson } from './dependencies'

const randomVersion = () => {
  const randomNode = () => parseInt(`${Math.random() * 99}`)
  return `${randomNode()}.${randomNode()}.${randomNode()}`
}

const randomSemverVersion = () => {
  const randomNode = () => parseInt(`${Math.random() * 99}`)
  return `${randomNode()}.${randomNode()}.${randomNode()}`
}

export const getPackageJson = async (packageName: string) =>
  Promise.resolve({
    name: packageName.includes('@') ? packageName.split('@')[0] : packageName,
    version: randomVersion(),
    dependencies:
      packageName === 'packageOne'
        ? {
            test: '^1.0.1',
            'test-2': '^2.0.1',
          }
        : Math.random() > 0.75
        ? {
            [`${
              packageName.includes('@')
                ? packageName.split('@')[0]
                : packageName
            }-1`]: randomSemverVersion(),
            [`${
              packageName.includes('@')
                ? packageName.split('@')[0]
                : packageName
            }-2`]: randomSemverVersion(),
          }
        : Math.random() > 0.5
        ? { test: '^1.0.1' }
        : {},
  } as PackageJson)

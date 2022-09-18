// TODO
// https://registry.npmjs.org/:packageName 可以获取所有版本的package.json，含dependency
// https://registry.npmjs.org/:packageName/:version 可以获取指定版本的package.json，含dependency
// https://github.com/mochajs/mocha/blob/4727d357ea5/package.json
// https://github.com/<user>/<repositry>/blob/<commit-ish>/package.json 可以获取github上的package.json，含dependency

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

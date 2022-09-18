import { describe, it, beforeEach, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDependenciesStore } from '../../dependencies'
import { packageJson, piniaPackageJson, result, result2 } from './package.mock'

describe('测试 package.json 的分析函数', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('依赖分析，返回正确分析结果', () => {
    const { allDependencies, analysisPackageJson } = useDependenciesStore()
    analysisPackageJson(packageJson)
    expect(allDependencies).toStrictEqual(result)
  })

  it('第二层依赖分析，返回正确分析结果', () => {
    const { allDependencies, analysisPackageJson } = useDependenciesStore()
    analysisPackageJson(packageJson)
    expect(allDependencies).toStrictEqual(result)
    analysisPackageJson(piniaPackageJson, 'pinia@^2.0.21')
    expect(allDependencies).toStrictEqual(result2)
  })

  // it('递归调用，返回正确的分析结果', async () => {
  //   const { allDependencies, analysisPackageDeep } = useDependenciesStore()
  //   await analysisPackageDeep('packageOne')
  //   console.log(allDependencies)
  //   expect(Object.keys(allDependencies).length).greaterThan(2)
  // })
})

<script setup lang="ts">
import {
  useDependenciesStore,
  type InputPackageName,
} from '@/stores/dependencies'
import type Node from 'element-plus/es/components/tree/src/model/node'
import isEmpty from 'lodash-es/isEmpty'

interface Tree {
  label: string
  children?: Tree[]
}

const props = {
  isLeaf: 'isLeaf',
}

const { allDependencies } = useDependenciesStore()

const genChildren = (packageName: InputPackageName) => {
  const packageJson = allDependencies[packageName]
  const children = Object.keys(packageJson?.dependencies).map((key) => {
    console.log(
      `${key}@${packageJson?.dependencies[key]}`,
      isEmpty(
        allDependencies[`${key}@${packageJson?.dependencies[key]}`]
          ?.dependencies
      )
    )
    return {
      label: `${key}@${packageJson?.dependencies[key]}`,
      isLeaf: isEmpty(
        allDependencies[`${key}@${packageJson?.dependencies[key]}`]
          ?.dependencies
      ),
    }
  })
  console.log(children)
  return children
}

const genDefaultTree = () => {
  const [rootName] = Object.keys(allDependencies)
  return {
    label: rootName,
    children: genChildren(rootName),
  }
}

// eslint-disable-next-line no-unused-vars
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    return resolve([genDefaultTree()])
  }

  if (node.level >= 1) return resolve(genChildren(node.label))
}
</script>

<template>
  <div class="greetings">
    <el-tree :props="props" :load="loadNode" lazy />
  </div>
</template>

const randomVersion = () => {
  const randomNode = () => parseInt(`${Math.random() * 99}`)
  return `${randomNode()}.${randomNode()}.${randomNode()}`
}

const randomSemverVersion = () => {
  const randomNode = () => parseInt(`${Math.random() * 99}`)
  return `${randomNode()}.${randomNode()}.${randomNode()}`
}

export const generatePackageJson = (packageName: string) => ({
  name: packageName,
  version: randomVersion(),
  dependencies:
    Math.random() > 0.7
      ? {
          [`${packageName}-1`]: randomSemverVersion(),
          [`${packageName}-2`]: randomSemverVersion(),
        }
      : Math.random() > 0.5
      ? { test: '^1.0.1' }
      : {},
})

export const packageJson = {
  name: 'package-dependency',
  version: '0.0.0',
  scripts: {
    dev: 'vite',
    build: 'run-p type-check build-only',
    preview: 'vite preview --port 4173',
    'test:unit': 'vitest --environment jsdom',
    'test:e2e':
      "start-server-and-test preview http://localhost:4173/ 'cypress open --e2e'",
    'test:e2e:ci':
      "start-server-and-test preview http://localhost:4173/ 'cypress run --e2e'",
    'build-only': 'vite build',
    'type-check': 'vue-tsc --noEmit -p tsconfig.vitest.json --composite false',
    lint: 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore',
  },
  dependencies: {
    pinia: '^2.0.21',
    vue: '^3.2.38',
    'vue-router': '^4.1.5',
  },
  devDependencies: {
    '@rushstack/eslint-patch': '^1.1.4',
    '@testing-library/vue': '^6.6.1',
    '@types/jsdom': '^20.0.0',
    '@types/node': '^16.11.56',
    '@vitejs/plugin-vue': '^3.1.0',
    '@vitejs/plugin-vue-jsx': '^2.0.1',
    '@vue/eslint-config-prettier': '^7.0.0',
    '@vue/eslint-config-typescript': '^11.0.0',
    '@vue/test-utils': '^2.0.2',
    '@vue/tsconfig': '^0.1.3',
    cypress: '^10.7.0',
    eslint: '^8.22.0',
    'eslint-plugin-cypress': '^2.12.1',
    'eslint-plugin-vue': '^9.3.0',
    jsdom: '^20.0.0',
    'npm-run-all': '^4.1.5',
    prettier: '^2.7.1',
    'start-server-and-test': '^1.14.0',
    typescript: '~4.7.4',
    vite: '^3.0.9',
    vitest: '^0.23.0',
    'vue-tsc': '^0.40.7',
  },
}

export const piniaPackageJson = {
  name: 'pinia',
  version: '2.0.22',
  description: 'Intuitive, type safe and flexible Store for Vue',
  main: 'index.js',
  module: 'dist/pinia.mjs',
  unpkg: 'dist/pinia.iife.js',
  jsdelivr: 'dist/pinia.iife.js',
  types: 'dist/pinia.d.ts',
  exports: {
    '.': {
      node: {
        import: {
          production: './dist/pinia.prod.cjs',
          development: './dist/pinia.mjs',
          default: './dist/pinia.mjs',
        },
        require: {
          production: './dist/pinia.prod.cjs',
          development: './dist/pinia.cjs',
          default: './index.js',
        },
      },
      import: './dist/pinia.mjs',
      require: './index.js',
      types: './dist/pinia.d.ts',
    },
    './package.json': './package.json',
    './dist/*': './dist/*',
  },
  sideEffects: false,
  author: {
    name: 'Eduardo San Martin Morote',
    email: 'posva13@gmail.com',
  },
  funding: 'https://github.com/sponsors/posva',
  keywords: [
    'vue',
    'vuex',
    'store',
    'pinia',
    'piña',
    'pigna',
    'composition',
    'api',
    'setup',
    'typed',
    'typescript',
    'ts',
    'type',
    'safe',
  ],
  license: 'MIT',
  devDependencies: {
    '@microsoft/api-extractor': '7.28.6',
    '@vue/test-utils': '^2.0.2',
  },
  dependencies: {
    '@vue/devtools-api': '^6.2.1',
    'vue-demi': '*',
  },
  peerDependencies: {
    '@vue/composition-api': '^1.4.0',
    typescript: '>=4.4.4',
    vue: '^2.6.14 || ^3.2.0',
  },
  peerDependenciesMeta: {
    typescript: {
      optional: true,
    },
    '@vue/composition-api': {
      optional: true,
    },
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/vuejs/pinia.git',
  },
  bugs: {
    url: 'https://github.com/vuejs/pinia/issues',
  },
  homepage: 'https://github.com/vuejs/pinia#readme',
  scripts: {
    build:
      'rimraf dist && rollup -c ../../rollup.config.js --environment TARGET:pinia',
    'build:dts':
      'api-extractor run --local --verbose && tail -n +3 ./src/globalExtensions.ts >> dist/pinia.d.ts',
    changelog:
      'conventional-changelog -p angular -i CHANGELOG.md -s --commit-path . -l pinia -r 1',
    'test:dts': 'tsc -p ./test-dts/tsconfig.json',
    test: 'yarn run build && yarn run build:dts && yarn test:dts',
  },
  _id: 'pinia@2.0.22',
  _integrity:
    'sha512-u+b8/BC+tmvo3ACbYO2w5NfxHWFOjvvw9DQnyT0dW8aUMCPRQT5QnfZ5R5W2MzZBMTeZRMQI7V/QFbafmM9QHw==',
  _resolved:
    '/private/var/folders/vz/93zczm2s0f9ds4p7d5bzxymc0000gn/T/95928aa341b1206f990891845d103ca5/pinia-2.0.22.tgz',
  _from: 'file:pinia-2.0.22.tgz',
  _nodeVersion: '16.17.0',
  _npmVersion: '8.15.0',
  dist: {
    integrity:
      'sha512-u+b8/BC+tmvo3ACbYO2w5NfxHWFOjvvw9DQnyT0dW8aUMCPRQT5QnfZ5R5W2MzZBMTeZRMQI7V/QFbafmM9QHw==',
    shasum: '435468e8e6d6aa6f319cb727b23bd51db0844c4a',
    tarball: 'https://registry.npmjs.org/pinia/-/pinia-2.0.22.tgz',
    fileCount: 12,
    unpackedSize: 381854,
    signatures: [
      {
        keyid: 'SHA256:jl3bwswu80PjjokCgh0o2w5c2U4LhQAE57gj9cz1kzA',
        sig: 'MEUCIDp9uX7eSRrzuZ1Mle8OLJTbftH3Ld/zTmSUYNxLGDnjAiEAgQ6CL05L8ITzvshRvtfnhGTBKCrxz1rVXL9qOwMaLm8=',
      },
    ],
    'npm-signature':
      '-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.10.10\r\nComment: https://openpgpjs.org\r\n\r\nwsFzBAEBCAAGBQJjFwSKACEJED1NWxICdlZqFiEECWMYAoorWMhJKdjhPU1b\r\nEgJ2VmoKtBAAmvH+IRA781iHiSrzEmFzvlIxqu1yJ9dSey0P5tSdb7XpLdqE\r\n9mv6rfXNob75nKXykuyW1gzoEGFRhUGkROuNNopJoQ83+hou2pHv7uWpQWrE\r\nJQJiVuBWujAvIZoCyohNmdzS4DaQFSQNoGnT2PQS+sys+phYbQs3+7tTAWGx\r\nYAAu26jQAOxRsqDwOdtoSaQhtH4cvhNDOPdeVTKOyUtXV7KfR5PtjlmOE4n9\r\nD8ihzTr3gVtkhilgYCsitEmT3QtmHkexi92rGaWTYNhzBmzuZTQAc0p3dPR6\r\nvOIWzaaDgvzZQsqK7p+cyUW2ZLrgvixYWQn67MO42GGD9ZOxuCuvChuZcq/t\r\npMG8NuFLkw/F0gLPvUSTnLEvSq4N9a/rmewQdGiD/QtdkFYeiQJZjBSTucV/\r\nsiI/v3zPFw3gqmE8jjV6ICeZsY3JlA4GzoC1GQHeHuLBmycZ99WvxPnrT9WM\r\nLCxXXmzLs4EtzC+/eEeGkBtZSe6j3wC3fvAS+l9bOUxVitsGHEeueMxGC90B\r\nGoZ04ixcUOX++YoMZvx1n7w4DwSdr0hv14yb2dZNr7IXTEPtX7b4omgYsP2S\r\nHXcLJqPBr20QsgZZFbZI1YjEjo4xhiwDDwrjT5KBUy3tnAURvBgBJoUNKWbA\r\nBv+k3hb8MEw3Wrak5QZq9GQak5icVJJukPI=\r\n=C5vY\r\n-----END PGP SIGNATURE-----\r\n',
  },
  _npmUser: {
    name: 'posva',
    email: 'posva13@gmail.com',
  },
  directories: {},
  maintainers: [
    {
      name: 'posva',
      email: 'posva13@gmail.com',
    },
  ],
  _npmOperationalInternal: {
    host: 's3://npm-registry-packages',
    tmp: 'tmp/pinia_2.0.22_1662452874533_0.05183861126046341',
  },
  _hasShrinkwrap: false,
}

export const result = {
  'package-dependency': {
    name: 'package-dependency',
    version: '0.0.0',
    dependencies: {
      pinia: '^2.0.21',
      vue: '^3.2.38',
      'vue-router': '^4.1.5',
    },
    devDependencies: {
      '@rushstack/eslint-patch': '^1.1.4',
      '@testing-library/vue': '^6.6.1',
      '@types/jsdom': '^20.0.0',
      '@types/node': '^16.11.56',
      '@vitejs/plugin-vue': '^3.1.0',
      '@vitejs/plugin-vue-jsx': '^2.0.1',
      '@vue/eslint-config-prettier': '^7.0.0',
      '@vue/eslint-config-typescript': '^11.0.0',
      '@vue/test-utils': '^2.0.2',
      '@vue/tsconfig': '^0.1.3',
      cypress: '^10.7.0',
      eslint: '^8.22.0',
      'eslint-plugin-cypress': '^2.12.1',
      'eslint-plugin-vue': '^9.3.0',
      jsdom: '^20.0.0',
      'npm-run-all': '^4.1.5',
      prettier: '^2.7.1',
      'start-server-and-test': '^1.14.0',
      typescript: '~4.7.4',
      vite: '^3.0.9',
      vitest: '^0.23.0',
      'vue-tsc': '^0.40.7',
    },
    peerDependencies: {},
  },
}

export const result2 = {
  'package-dependency': {
    name: 'package-dependency',
    version: '0.0.0',
    dependencies: {
      pinia: '^2.0.21',
      vue: '^3.2.38',
      'vue-router': '^4.1.5',
    },
    devDependencies: {
      '@rushstack/eslint-patch': '^1.1.4',
      '@testing-library/vue': '^6.6.1',
      '@types/jsdom': '^20.0.0',
      '@types/node': '^16.11.56',
      '@vitejs/plugin-vue': '^3.1.0',
      '@vitejs/plugin-vue-jsx': '^2.0.1',
      '@vue/eslint-config-prettier': '^7.0.0',
      '@vue/eslint-config-typescript': '^11.0.0',
      '@vue/test-utils': '^2.0.2',
      '@vue/tsconfig': '^0.1.3',
      cypress: '^10.7.0',
      eslint: '^8.22.0',
      'eslint-plugin-cypress': '^2.12.1',
      'eslint-plugin-vue': '^9.3.0',
      jsdom: '^20.0.0',
      'npm-run-all': '^4.1.5',
      prettier: '^2.7.1',
      'start-server-and-test': '^1.14.0',
      typescript: '~4.7.4',
      vite: '^3.0.9',
      vitest: '^0.23.0',
      'vue-tsc': '^0.40.7',
    },
    peerDependencies: {},
  },
  'pinia@^2.0.21': {
    name: 'pinia',
    version: '2.0.22',
    devDependencies: {
      '@microsoft/api-extractor': '7.28.6',
      '@vue/test-utils': '^2.0.2',
    },
    dependencies: {
      '@vue/devtools-api': '^6.2.1',
      'vue-demi': '*',
    },
    peerDependencies: {
      '@vue/composition-api': '^1.4.0',
      typescript: '>=4.4.4',
      vue: '^2.6.14 || ^3.2.0',
    },
  },
}

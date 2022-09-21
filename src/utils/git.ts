// import { downloadUnpkg, downloadHttp } from '../utils/download'
// import cacheDB from '../utils/cacheFile'
// import { Archive } from 'libarchive.js/main.js'
// import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
// import FS from '@isomorphic-git/lightning-fs'

// Archive.init({
//   workerUrl: './dist/worker-bundle.js',
// })
// // git web worker init
// const worker = new Worker('dist/libgit2_webworker.js')

// const fs = new FS('testfs')

// // const git_url = 'https://wasm-git.petersalomonsen.com/test'

// const cloneGitLib2 = async (gitUrl: string) => {
//   const dir = gitUrl
//     .substr(gitUrl.lastIndexOf('/'), gitUrl.length - gitUrl.lastIndexOf('/'))
//     .replaceAll('-', '_')
//   // const dir2='/empty_react_project'
//   await window.git
//     .clone({
//       fs,
//       http,
//       dir,
//       // url: 'https://github.com/isomorphic-git/lightning-fs',
//       url: gitUrl,
//       corsProxy: 'https://cors.isomorphic-git.org',
//     })
//     .then(console.log)
//   fs.readdir(dir, (err, files) => {
//     if (err) console.log(err)
//     else {
//       File.forEach((file) => {
//         console.log(file)
//       })
//     }
//   })
//   fs.readFile(`${dir}/package.json`, 'utf8', (err, data) => {
//     if (err) console.log(err)
//     else {
//       console.log('\nCurrent file:')
//       console.log(data)
//     }
//   })
// }
// const downloadFile = () => {
//   loading.value = true
//   console.log('user input', input1.value)
//   // 写入cache
//   cache.cacheModel('https://registry.npmjs.org/vue/-/vue-3.2.39.tgz')
//   axios
//     .get('https://registry.npmjs.org/vue/-/vue-3.2.39.tgz', {
//       responseType: 'blob',
//     })
//     .then((response) => {
//       console.log('response: ', response.data)
//       // Let's create a link in the document that we'll
//       // programmatically 'click'.
//       const link = document.createElement('a')
//       // Tell the browser to associate the response data to
//       // the URL of the link we created above.
//       link.href = window.URL.createObjectURL(new Blob([response.data]))
//       // Tell the browser to download, not render, the file.
//       link.setAttribute('download', 'vue-3.2.39.tgz')
//       // Place the link in the DOM.
//       document.body.appendChild(link)
//       // Make the magic happen!
//       link.click()
//       loading.value = false
//     })
//     .catch((error) => {
//       loading.value = false
//       console.error(error)
//     })
// }
// const extractTgz = () => {
//   loading.value = true
//   // 写入cache
//   cache.cacheModel('https://registry.npmjs.org/vue/-/vue-3.2.39.tgz')
//   axios
//     .get('https://registry.npmjs.org/vue/-/vue-3.2.39.tgz', {
//       responseType: 'blob',
//     })
//     .then(async (response) => {
//       console.log('response: ', response.data)
//       const file = new window.File([response.data], 'vue-3.2.39.tgz', {
//         type: 'application/x-compressed',
//       })
//       const archive = await Archive.open(file)
//       // let obj = await archive.extractFiles()
//       // console.log(obj)
//       const filesObj = await archive.getFilesObject()
//       const package_file = await filesObj['package']['package.json']
//       console.log(package_file)
//       const ex_file = await package_file.extract()
//       console.log(ex_file)
//       const package_info = await ex_file.text()
//       console.log(package_info)
//       loading.value = false
//     })
//     .catch((error) => {
//       loading.value = false
//       console.error(error)
//     })
// }

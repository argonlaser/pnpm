'use strict'
const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')

const pkgPath = path.resolve(process.cwd(), 'package.json')
const rawPkgJSON = fs.readFileSync(pkgPath, 'UTF8')
const pkgJSON = JSON.parse(rawPkgJSON)

const result = spawn.sync('npm', ['list', '--json', '--prod'])

if (result.status !== 0) {
  console.log('failed')
  return
}

const depsTreeJSON = JSON.parse(result.stdout.toString())

const uniqueDeps = Array.from(new Set(getAllDeps(depsTreeJSON)))
uniqueDeps.sort()

pkgJSON.bundledDependencies = uniqueDeps

fs.writeFileSync(pkgPath, JSON.stringify(pkgJSON, null, 2), 'UTF8')

function getAllDeps (json) {
  if (!json.dependencies) return []
  return Object.keys(json.dependencies)
    .map(depName => [depName].concat(getAllDeps(json.dependencies[depName])))
    .reduce((prev, curr) => prev.concat(curr), [])
}

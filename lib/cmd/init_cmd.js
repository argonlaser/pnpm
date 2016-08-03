var readPkgUp = require('read-pkg-up')
var resolve = require('path').resolve
var dirname = require('path').dirname
var thenify = require('thenify')
var lock = thenify(require('lockfile').lock)
var unlock = thenify(require('lockfile').unlock)

var logger = require('../logger')
var storeJsonController = require('../fs/store_json_controller')
var mkdirp = require('../fs/mkdirp')

module.exports = function (opts) {
  var cmd = {
    ctx: {}
  }
  var lockfile
  return readPkgUp()
    .then(_ => { cmd.pkg = _ })
    .then(_ => updateContext())
    .then(_ => mkdirp(cmd.ctx.store))
    .then(_ => lock(lockfile))
    .then(_ => cmd)

  function updateContext () {
    var root = cmd.pkg.path ? dirname(cmd.pkg.path) : process.cwd()
    cmd.ctx.root = root
    cmd.ctx.store = resolve(root, opts.store_path)
    lockfile = resolve(cmd.ctx.store, 'lock')
    cmd.unlock = () => unlock(lockfile)
    cmd.storeJson = storeJsonController(opts.store_path)
    Object.assign(cmd.ctx, cmd.storeJson.read())
    if (!opts.quiet) cmd.ctx.log = logger(opts.logger)
    else cmd.ctx.log = function () { return function () {} }
  }
}

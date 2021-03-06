import {PublicInstallationOptions} from './api/install'
export type DependenciesType = 'dependencies' | 'devDependencies' | 'optionalDependencies'

export default function getSaveType (opts: PublicInstallationOptions): DependenciesType | null {
  if (opts.save || opts.global) return 'dependencies'
  if (opts.saveDev) return 'devDependencies'
  if (opts.saveOptional) return 'optionalDependencies'
  return null
}

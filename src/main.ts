import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as exec from '@actions/exec'
import os from 'os'
// import * as path from 'path'
import * as fs from 'fs'

const name = 'tosutil'
const platform = os.platform()
const arch = getArch(os.arch())

const configs: { input: string; flag: string; value?: string }[] = [
  { input: 'endpoint', flag: '-e' },
  { input: 'region', flag: '-re' },
  { input: 'access-key-id', flag: '-i' },
  { input: 'access-key-secret', flag: '-k' },
  { input: 'token', flag: '-t' }
]
for (const config of configs) {
  config.value = core.getInput(config.input)
}

function getArch(arch: string): string {
  // 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', and 'x64'.

  // wants amd64, 386, arm64, armv61, ppc641e, s390x
  // currently not supported by runner but future proofed mapping
  switch (arch) {
    case 'x64':
      arch = 'amd64'
      break
    case 'arm':
      arch = 'arm64'
      break
  }
  return arch
}

function getUrl(): string {
  switch (platform) {
    case 'linux':
      return `https://tos-tools.tos-cn-beijing.volces.com/linux/${arch}/${name}`
    case 'darwin':
      return `https://tos-tools.tos-cn-beijing.volces.com/darwin/${arch}/${name}`
    case 'win32':
      return `https://tos-tools.tos-cn-beijing.volces.com/windows/${name}`
    default:
      throw new Error(`Unexpected OS ${platform}`)
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const url = getUrl()
    const downloadedPath = await tc.downloadTool(url)
    fs.chmodSync(downloadedPath, 0o755)
    const executable = platform === 'win32' ? `${name}.exe` : name
    await tc.cacheFile(downloadedPath, executable, name, '1.0.0', platform)
    const dir = tc.find(executable, '1.0.0', platform)
    core.addPath(dir)

    const args = ['config']
    for (const config of configs) {
      if ((config.value?.length ?? 0) > 0) {
        // args.push(config.flag, config.value);
        args.push(`${config.flag}=${config.value}`)
      }
    }

    if (args.length > 1) {
      await exec.exec(executable, args)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

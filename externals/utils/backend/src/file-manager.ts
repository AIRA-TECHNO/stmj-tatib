import * as fs from 'fs'
import { join } from 'path'


class FileManager {
  public write(blob: Buffer, destination: string) {
    destination = `storage/${destination}`.replace(/(\/)\//, "/").replace(/^\//, '')
    let dirs = destination.split('/').slice(0, -1)
    if (!fs.existsSync(join(process.cwd(), dirs.join('/')))) {
      let newDir = process.cwd()
      for (const newFolder of dirs) {
        newDir = join(newDir, newFolder)
        if (!fs.existsSync(newDir)) fs.mkdirSync(newDir)
      }
    }
    return fs.writeFileSync(destination, blob);
  }


  public read(path: string, options?: { encoding?: BufferEncoding }) {
    return fs.readFileSync(path, options).toString()
  }
}

export default new FileManager;
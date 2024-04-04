import { xata } from '@/lib/db'
import type { BinaryFile } from '@xata.io/client'

export const downloadFile = async (fileName: string) => {
  const file = await xata.db.File.filter({ name: fileName }).getFirst()
  if (!file) return null

  return await xata.files.download({
    table: 'File',
    column: 'file',
    record: file.id,
  })
}

export const saveFile = async (fileName: string, fileContent: BinaryFile) => {
  let file = await xata.db.File.filter({ name: fileName }).getFirst()
  if (!file) file = await xata.db.File.create({ name: fileName })

  return await xata.files.upload(
    {
      table: 'File',
      column: 'file',
      record: file.id,
    },
    fileContent
  )
}

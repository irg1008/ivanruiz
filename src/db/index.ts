import type { EditableData, Identifiable, XataRecord } from '@xata.io/client'
import { XataClient } from './xata'

export type Update<T extends XataRecord<XataRecord>> = Omit<EditableData<T>, 'id'> &
	Partial<Identifiable>

export const xata = new XataClient({
	apiKey: import.meta.env.XATA_API_KEY,
	branch: import.meta.env.XATA_BRANCH,
})

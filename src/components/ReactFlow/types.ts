export type SnapshotName = 'events' | 'education' | 'jobs' | 'footer'

export type NavigableSnapshotName = Extract<SnapshotName, 'events' | 'education' | 'jobs'>

import type { FlowDTO } from '@/lib/db/dto/reactflow.dto'
import { searchMe } from '@/lib/services/search.service'
import { removeQueryParam, updateQueryParam } from '@/lib/utils/url.utils'
import { Input, Spinner, useDisclosure } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { ResultsModal } from './ResultsModal'

export type FlowSearchProps = {
  initQuery?: string
}

export function FlowSearch({ initQuery = '' }: FlowSearchProps) {
  const { isOpen, onOpen: openResultModal, onOpenChange: closeModal } = useDisclosure()

  const [query, setQuery] = useState<string>(initQuery)
  const [searchResult, setSearchResult] = useState<FlowDTO | null>(null)
  const [loading, setLoading] = useState(false)

  const setQueryDebounce = useDebounceCallback(setQuery, 500)
  const isEmptySearch = !searchResult?.flowObject?.nodes?.length

  const search = useCallback(async () => {
    if (!query) return

    setLoading(true)
    const result = await searchMe(query)
    setLoading(false)

    setSearchResult(result)
  }, [query])

  const onInputChange = (value: string) => {
    setQueryDebounce(value)
    updateQueryParam(value)
  }

  const onModalClose = () => {
    removeQueryParam()
  }

  useEffect(() => {
    if (query) search()
  }, [query, search])

  useEffect(() => {
    if (!isEmptySearch) openResultModal()
  }, [searchResult, isEmptySearch, openResultModal])

  return (
    <>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className='flex flex-col items-center gap-4'
      >
        <Input
          type='search'
          variant='faded'
          autoFocus
          defaultValue={initQuery}
          classNames={{ mainWrapper: 'mt-8' }}
          placeholder='Search my skills, jobs, etc'
          startContent={<SearchIcon size={18} />}
          onChange={(e) => onInputChange(e.target.value)}
        />
        {isEmptySearch && query && !loading && (
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='line-clamp-2 shrink break-all text-center text-foreground-500'
          >
            No results found for <em title={query} className='text-secondary'>{`"${query}"`}</em>
          </motion.p>
        )}

        {loading && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='flex justify-center gap-2'
          >
            <Spinner size='sm' color='secondary' />
            <p className='text-foreground-500'>Searching for</p>
            <p className='text-secondary'>{`"${query}"`}</p>
          </motion.div>
        )}
      </motion.div>

      <ResultsModal
        query={query}
        flow={searchResult!}
        isOpen={isOpen}
        onOpenChange={() => {
          onModalClose()
          closeModal()
        }}
      />
    </>
  )
}

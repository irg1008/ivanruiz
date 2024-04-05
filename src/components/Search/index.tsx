import type { FlowDTO } from '@/lib/db/dto/reactflow.dto'
import { searchMe } from '@/lib/services/search.service'
import { removeQueryParam, updateQueryParam } from '@/lib/utils/url.utils'
import { Input, Spinner, useDisclosure } from '@nextui-org/react'
import { t } from 'astro-i18n'
import { motion } from 'framer-motion'
import { SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { ResultsModal } from './ResultsModal'

export type FlowSearchProps = {
  initQuery?: string
  autoFocus?: boolean
}

export default function FlowSearch({ initQuery = '', autoFocus = false }: FlowSearchProps = {}) {
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
      <div className='flex flex-col items-center gap-4'>
        <Input
          type='search'
          variant='faded'
          defaultValue={initQuery}
          placeholder={t('search.placeholder')}
          startContent={<SearchIcon size={18} />}
          onChange={(e) => onInputChange(e.target.value)}
          autoFocus={autoFocus}
        />
        {isEmptySearch && query && !loading && (
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='line-clamp-2 shrink break-all text-center text-foreground-500'
          >
            {t('search.no_results')}{' '}
            <em title={query} className='text-secondary'>{`"${query}"`}</em>
          </motion.p>
        )}

        {loading && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='flex justify-center gap-2'
          >
            <Spinner size='sm' color='secondary' />
            <p className='text-foreground-500'>{t('search.searching')}</p>
            <p className='text-secondary'>{`"${query}"`}</p>
          </motion.div>
        )}
      </div>

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

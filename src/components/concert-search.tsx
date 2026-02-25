import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchIcon, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { DateInput } from '@/components/ui/date-input'
import { searchConcerts, ConcertSearchResult } from '@/server/setlistfm'
import { cn } from '@/lib/utils'

interface ConcertSearchProps {
  onSelect: (concert: ConcertSearchResult) => void
}

export function ConcertSearch({ onSelect }: ConcertSearchProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  // Local state for the inputs before triggering a search
  const [artistInput, setArtistInput] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [dateInput, setDateInput] = useState<Date | undefined>(undefined)

  // The actual query states passed to TanStack query upon pressing Search
  const [queryArtist, setQueryArtist] = useState('')
  const [queryCity, setQueryCity] = useState('')
  const [queryDate, setQueryDate] = useState('')

  const hasQuery = queryArtist.trim() !== ''
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['searchConcerts', queryArtist, queryCity, queryDate],
    queryFn: () =>
      searchConcerts({
        data: {
          artistName: queryArtist,
          cityName: queryCity,
          eventDate: queryDate,
        },
      }),
    enabled: hasQuery,
  })

  const triggerSearch = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setQueryArtist(artistInput)
    setQueryCity(cityInput)
    setQueryDate(dateInput ? dateInput.toISOString() : '')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      triggerSearch()
    }
  }

  const handleSelect = (concert: ConcertSearchResult) => {
    setSearchOpen(false)
    onSelect(concert)
  }

  const isLoading = isSearchLoading || isFetching

  const searchContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        triggerSearch()
      }}
      className="flex flex-col w-full"
    >
      <div className="text-neutral-500">
        Search for a concert using at least the artist's name
      </div>
      <div className="space-y-3">
        <div className="flex gap-3 flex-col md:flex-row">
          <div className="space-y-2">
            <Label
              htmlFor="search-artist"
              className="text-xs uppercase font-bold text-neutral-500"
            >
              Artist Name
            </Label>
            <Input
              id="search-artist"
              placeholder="Harry Styles"
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="search-city"
              className="text-xs uppercase font-bold text-neutral-500"
            >
              City
            </Label>
            <Input
              id="search-city"
              placeholder="London"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="search-date"
              className="text-xs uppercase font-bold text-neutral-500"
            >
              Exact Date
            </Label>
            <DateInput
              id="search-date"
              value={dateInput}
              onChange={(date) => {
                setDateInput(date)
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className=" animate-spin" />
          ) : (
            <SearchIcon className="" />
          )}
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Results Container */}
      {hasQuery && isError && (
        <div className="p-4 text-sm text-center text-red-500 border border-red-200 bg-red-50 rounded-md mt-2">
          An error occurred while searching for concerts. Please try again.
        </div>
      )}

      {hasQuery && !isLoading && !isError && searchResults?.length === 0 && (
        <div className="p-4 text-sm text-center text-neutral-500 border rounded-md">
          No concerts found for these details.
        </div>
      )}

      {searchResults && searchResults.length > 0 && (
        <div
          className={cn('mt-4 flex flex-col gap-2 overflow-y-auto pr-1', {
            'max-h-60': isDesktop,
          })}
        >
          <div className="text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">
            Results
          </div>
          {searchResults.map((concert) => (
            <div
              key={concert.id}
              onClick={() => handleSelect(concert)}
              className="cursor-pointer items-start flex flex-col gap-1 p-3 py-1 rounded-md hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
            >
              <div className="font-bold text-neutral-900 text-sm">
                {concert.artist}
              </div>
              <div className="text-xs text-neutral-500">
                {new Date(concert.date).toLocaleDateString()} • {concert.venue},{' '}
                {concert.city}
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  )

  if (isDesktop) {
    return (
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger
          render={
            <Button
              onClick={() => setSearchOpen(true)}
              size="lg"
              className="w-full md:w-auto"
            >
              <SearchIcon />
              Search a concert
            </Button>
          }
        />
        <PopoverContent
          className="w-[90vw] md:w-[600px] lg:w-xl p-4 flex flex-col gap-4"
          align="start"
        >
          {searchContent}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={searchOpen} onOpenChange={setSearchOpen}>
      <DrawerTrigger asChild>
        <Button
          onClick={() => setSearchOpen(true)}
          size="lg"
          className="w-full md:w-auto"
        >
          <SearchIcon />
          Search a concert
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4 flex flex-col gap-4  overflow-y-auto w-full">
          {searchContent}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

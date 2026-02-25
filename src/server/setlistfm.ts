import { createServerFn } from '@tanstack/react-start'

export type ConcertSearchResult = {
  id: string
  artist: string
  artistId: string
  date: Date
  venue: string
  venueId: string
  dateStr: string
  city: string
  openers: string[]
  startTime?: string
  url?: string
}

export const searchConcerts = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (d: { artistName?: string; cityName?: string; eventDate?: string }) => d,
  )
  .handler(async ({ data }) => {
    // Requires at least one parameter
    if (
      !data.artistName?.trim() &&
      !data.cityName?.trim() &&
      !data.eventDate?.trim()
    ) {
      return []
    }

    const apiKey = process.env.SETLIST_FM_KEY

    if (!apiKey) {
      console.warn('SETLIST_FM_KEY is not defined in environment variables')
      return []
    }

    try {
      const params = new URLSearchParams()
      if (data.artistName?.trim())
        params.append('artistName', data.artistName.trim())
      if (data.cityName?.trim()) params.append('cityName', data.cityName.trim())
      if (data.eventDate?.trim()) {
        const d = new Date(data.eventDate)
        // Setlist.fm expects DD-MM-YYYY
        const formatted = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
        params.append('date', formatted)
      }

      const response = await fetch(
        `https://api.setlist.fm/rest/1.0/search/setlists?${params.toString()}`,
        {
          headers: {
            'x-api-key': apiKey,
            Accept: 'application/json',
          },
        },
      )

      console.log({ response })

      if (!response.ok) {
        if (response.status === 404) {
          return []
        }
        throw new Error(`Setlist.fm API error: ${response.status}`)
      }

      const json = await response.json()

      console.log({ json })
      const setlists = json.setlist || []

      const resultsMap = new Map<string, ConcertSearchResult>()

      for (const item of setlists) {
        if (!item.eventDate || !item.venue) continue

        const [day, month, year] = item.eventDate.split('-')
        const formattedDate = new Date(`${year}-${month}-${day}T12:00:00Z`)

        const key = `${item.venue.id}-${item.eventDate}`
        if (!resultsMap.has(key)) {
          resultsMap.set(key, {
            id: item.id,
            artist: item.artist.name,
            artistId: item.artist.mbid,
            date: formattedDate,
            venue: item.venue.name,
            venueId: item.venue.id,
            dateStr: item.eventDate,
            city: item.venue.city?.name || '',
            openers: [],
            url: item.url,
          })
        }
      }

      return Array.from(resultsMap.values()).slice(0, 15)
    } catch (e) {
      console.error('Failed to search setlists:', e)
      return []
    }
  })

export const getConcertDetails = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (d: { venueId: string; dateStr: string; headlinerId: string }) => d,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.SETLIST_FM_KEY
    if (!apiKey) {
      throw new Error('No API key')
    }

    try {
      const response = await fetch(
        `https://api.setlist.fm/rest/1.0/search/setlists?venueId=${data.venueId}&date=${data.dateStr}`,
        {
          headers: {
            'x-api-key': apiKey,
            Accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`API error: ${response.status}`)
      }

      const json = await response.json()
      const setlists: any[] = json.setlist || []

      if (setlists.length === 0) return null

      console.log(data.headlinerId, setlists)

      //   const headliner = setlists.find(
      //     (setlist) => setlist.artist.mbid === data.headlinerId,
      //   ).artist
      const openers = setlists
        .filter((setlist) => setlist.artist.mbid !== data.headlinerId)
        .map((s: any) => s.artist.name)

      return {
        // artist: headliner,
        openers: openers,
      }
    } catch (e) {
      console.error('Failed to get concert details:', e)
      return null
    }
  })

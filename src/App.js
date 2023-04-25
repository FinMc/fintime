import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import { getAuth } from './accessToken'

const spotifyApi = new SpotifyWebApi()

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const access_token = await getAuth()
      spotifyApi.setAccessToken(access_token)
    }
    fetchData()
  }, [])

  const handleSearch = async () => {
    const { tracks } = await spotifyApi.searchTracks(searchTerm)
    setSearchResults(tracks.items)
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((track) => (
          <li key={track.id}>{track.name} - {track.artist}</li>
        ))}
      </ul>
    </div>
  )
}

export default App

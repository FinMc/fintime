import React, { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import { getAuth } from './accessToken'
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  TextField,
  List,
  ListItemText,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  ListItemButton
} from '@mui/material'
import './App.css'
import { result } from './fakeQuery'

const spotifyApi = new SpotifyWebApi()

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searches, setSearches] = useState([])
  const song = new Audio(result[0].preview_url)
  const song_id = result[0].uri

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const access_token = await getAuth()
  //     spotifyApi.setAccessToken(access_token)
  //   }
  //   fetchData()
  // }, [])

  const handleSelection = (val, uri) => {
    // const { tracks } = await spotifyApi.searchTracks(searchTerm)
    if (uri === song_id) {
      alert('You win')
      return
    } else if (searches.length >= 4) {
      alert('You lose')
      setSearches([])
    } else {
      setSearches((cur) => {
        const tempSearches = [...cur]
        tempSearches.push(val)
        return tempSearches
      })
    }
  }

  const handleSearch = async () => {
    // const { tracks } = await spotifyApi.searchTracks(searchTerm)
    const tracks = result
    setSearchResults(result)
  }

  const handlePlay = async () => {
    song.play()
    await new Promise((res) => setTimeout(res, 1000))
    song.pause()
    song.currentTime = 0
  }

  return (
    <div className="parent">
      <TableContainer className="guesses">
        <Table>
          <TableBody>
            {searches.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="Music">
        <Button variant="outlined" onClick={handlePlay}>
          Play
        </Button>
      </div>

      <div className="searchBox">
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="searchButton">
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="searchResults">
        <List>
          {searchResults.map((track) => (
            <ListItemButton
              key={track.id}
              onClick={() =>
                handleSelection(
                  `${track.name} - ${track.artists[0].name}`,
                  track.uri
                )
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={track.album.name}
                  src={track.album.images[2].url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${track.name} - ${track.artists[0].name}`}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
    </div>
  )
}

export default App

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
  ListItemButton,
  IconButton,
  LinearProgress,
  Box
} from '@mui/material'
import PlayCircleFilledSharpIcon from '@mui/icons-material/PlayCircle'
import './App.css'
import { result } from './fakeQuery'

const spotifyApi = new SpotifyWebApi()

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searches, setSearches] = useState(['', '', '', '', ''])
  const [searchNum, setSearchNum] = useState(0)
  const [progress, setProgress] = useState(0)
  const [play, setPlay] = useState(false)
  const [finished, setFinished] = useState(false)
  const songData =
    result[
      Math.ceil(
        Math.abs(new Date('04/26/2023') - Date.now()) / (1000 * 60 * 60 * 24)
      ) %
        (result.length - 1)
    ]
  const song = new Audio(songData.preview_url)

  useEffect(() => {
    const fetchData = async () => {
      const access_token = await getAuth()
      spotifyApi.setAccessToken(access_token)
    }
    fetchData()
  }, [])

  const handleSelection = (val, name, artist) => {
    if (finished) return
    if (songData.name == name && songData.artists[0].name == artist) {
      alert('You win')
      setFinished(true)
      setSearches((cur) => {
        const tempSearches = [...cur]
        tempSearches[searchNum] = '🍑 ' + val
        return tempSearches
      })
      return
    } else if (songData.artists[0].name == artist) {
      setSearches((cur) => {
        const tempSearches = [...cur]
        tempSearches[searchNum] = '🔥 ' + val
        return tempSearches
      })
      setSearchNum(searchNum + 1)
    } else {
      setSearches((cur) => {
        const tempSearches = [...cur]
        tempSearches[searchNum] = '💩 ' + val
        return tempSearches
      })
      setSearchNum(searchNum + 1)
    }
    if (searchNum >= 4) {
      alert('You lose')
      setFinished(true)
    }
  }

  const handleSearch = async (s) => {
    if (finished) return
    setSearchTerm(s)
    const { tracks } = await spotifyApi.searchTracks(s, { limit: 10 })
    console.log(tracks)
    // const tracks = result
    setSearchResults(tracks.items)
  }

  const handlePlay = async () => {
    if (play) return
    setPlay(true)
    const timer = [1, 2, 5, 10, 15][searchNum]
    setProgress(0)
    song.play()
    let percent = 0
    while (percent < (timer / 15) * 100) {
      await new Promise((res) => setTimeout(res, 150))
      percent += 1
      setProgress((cur) => cur + 1)
    }
    song.pause()
    song.currentTime = 0
    setPlay(false)
    setProgress((timer / 15) * 100)
  }

  return (
    <div className="parent">
      <TableContainer className="guessesParent">
        <Table className="guesses">
          <TableBody>
            {searches.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="progress">
        <Box sx={{ width: '500px', height: '20px' }} className="bar">
          <LinearProgress
            variant="buffer"
            value={progress}
            valueBuffer={([1, 2, 5, 10, 15][searchNum] / 15) * 100}
            sx={{ height: '20px' }}
            color="success"
          />
        </Box>
        <div className="progressVal">{(progress / 6.66666).toFixed(2)}s</div>
      </div>

      <div className="music">
        <IconButton onClick={handlePlay}>
          <PlayCircleFilledSharpIcon color="success" />
        </IconButton>
      </div>

      <div className="searchBox">
        <TextField
          id="outlined-basic"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* <div className="searchButton">
        <Button variant="outlined" onClick={handleSearch}>
          Search
        </Button>
      </div> */}

      <div className="searchResults">
        {searchResults.length > 0 && (
          <List>
            {searchResults.map((track) => (
              <ListItemButton
                key={track.id}
                onClick={() =>
                  handleSelection(
                    `${track.name} - ${track.artists[0].name}`,
                    track.name,
                    track.artists[0].name
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
        )}
      </div>
    </div>
  )
}

export default App

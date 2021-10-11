import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getRandomPokemonID, getPokemonItem } from 'utils';
import { TOTAL_ROUNDS, MAX_POKEMON_NUMBER, POKE_API } from 'constants/index';
import './App.css';

export interface PokemonItem {
  name: string
  imgUri: string
}

export interface StartScreenProps {
  onStart: () => void
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="app">
      Name that Pokemon!
      <button onClick={onStart}>START GAME</button>
    </div>
  )
}

export interface GameOverScreenProps {
  onRestart: () => void
  total: number
  correct: number
}

const GameOverScreen = ({onRestart, total, correct}: GameOverScreenProps) => {
  return (
    <div className="app">
      <span>FINAL SCORE</span>
      <span>{correct}  / { total}</span>
      Play Again?
      <button onClick={onRestart}>START GAME</button>
    </div>
  )
}

enum PLAY_PHASE {
  START = "START",
  PLAY = "PLAY",
  END = "END"
}

const App = () => {
  const [gamePhase, setGamePhase] = useState<PLAY_PHASE>(sessionStorage.getItem('game_phase') as PLAY_PHASE || 'START')
  const [pending, setPending] = useState(true)
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState<number>(sessionStorage.getItem('time') ? Number(sessionStorage.getItem('time')) : 5000)
  const [pokemon, setPokemon] = useState<PokemonItem>()
  const [choices, setChoices] = useState<PokemonItem[]>([])
  const [total, setTotal] = useState(sessionStorage.getItem('total') ? Number(sessionStorage.getItem('total')) : 0)
  const [numCorrect, setNumCorrect] = useState(sessionStorage.getItem('numCorrect') ? Number(sessionStorage.getItem('numCorrect')) : 0)

  useEffect(() => {
    if (gamePhase === 'PLAY') {
      const interval = setInterval(() => {
        setTimeRemaining(currTimeRemaining => {
          sessionStorage.setItem('time', `${currTimeRemaining - 1000}`)
          return currTimeRemaining - 1000
        })
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [total, gamePhase]);

  useEffect(() => {
    sessionStorage.setItem('numCorrect', `${numCorrect}`)
    sessionStorage.setItem('total', `${total}`)
  }, [numCorrect, total])

  useEffect(() => {
    if (gamePhase === 'PLAY' && timeRemaining <= 0) {
      sessionStorage.removeItem('pokemon')
      sessionStorage.removeItem('pokemon_choices')
      setTotal(total + 1)
      if (total + 1 === TOTAL_ROUNDS) {
        setGamePhase(PLAY_PHASE.END)
      }
      setTimeRemaining(5000)
    }
  }, [timeRemaining, total, gamePhase])

  useEffect(() => {
    const getRandomPokemon = async () => {
      try {
        const randomPokemonID = getRandomPokemonID()
        const randomChoices = [...Array(3)].map((_, index,arr) => {
          const randomChoiceID = getRandomPokemonID()
          // TODO: revisit this logic
          if (randomChoiceID === randomPokemonID && randomChoiceID === MAX_POKEMON_NUMBER && arr.indexOf(randomChoiceID) === -1) {
            return randomChoiceID - 1
          }
          if (randomChoiceID === randomPokemonID && randomChoiceID < MAX_POKEMON_NUMBER && arr.indexOf(randomChoiceID) === -1) {
            return randomChoiceID + 1
          }
          return randomChoiceID
        })
        const { data } = await axios.get(`${POKE_API}/${randomPokemonID}`)
        const correctPokemon = getPokemonItem(data)
        const pokemonChoices = await Promise.all(randomChoices.map( choiceID => axios.get(`${POKE_API}/${choiceID}`).then(({data}) => getPokemonItem(data) )))
        const randomCorrectAnswerIndex = Math.floor(Math.random() * pokemonChoices.length)
        pokemonChoices.splice(randomCorrectAnswerIndex, 0, correctPokemon)
        setPokemon(correctPokemon)
        setChoices(pokemonChoices)
        sessionStorage.setItem('pokemon', JSON.stringify(correctPokemon))
        sessionStorage.setItem('pokemon_choices', JSON.stringify(pokemonChoices))
        setPending(false)
      } catch (err) {
        setError('problem fetching pokemon, try reloading the page!')
        setPending(false)
      }
    }
    // if found in session storage (say from browser reload) don't refetch on page reload (until game is "over")
    const pokemonFromSession = sessionStorage.getItem('pokemon')
    const pokemonChoicesFromSession = sessionStorage.getItem('pokemon_choices')
    if ((!pokemonFromSession || !pokemonChoicesFromSession)) {
      getRandomPokemon() 
      return
    }
    setPokemon(JSON.parse(pokemonFromSession))
    setChoices(JSON.parse(pokemonChoicesFromSession))
    setPending(false)
  }, [total])
  const onSelect = (name: string) => {
    if (name === pokemon?.name) {
      setNumCorrect(numCorrect + 1)
    }
    sessionStorage.removeItem('pokemon')
    sessionStorage.removeItem('pokemon_choices')
    if (total + 1 === TOTAL_ROUNDS) {
      setGamePhase(PLAY_PHASE.END)
      sessionStorage.setItem('game_phase', 'END')
    }
    setTimeRemaining(5000)
    setTotal(total + 1)
  }
  const onStart = () => {
    sessionStorage.removeItem('pokemon')
    sessionStorage.removeItem('pokemon_choices')
    sessionStorage.setItem('game_phase', 'PLAY')
    setNumCorrect(0)
    setTotal(0)
    setGamePhase(PLAY_PHASE.PLAY)
    setPending(true)
  }
  const onRestart = () => {
    sessionStorage.removeItem('pokemon')
    sessionStorage.removeItem('pokemon_choices')
    sessionStorage.setItem('game_phase', 'START')
    setGamePhase(PLAY_PHASE.START) 
  }
  if (pending) {
    return <div className="app">loading...</div>
  }
  if (error) {
    return <div className="app">{error}</div>
  }
  if (gamePhase === PLAY_PHASE.START) {
    return <StartScreen onStart={onStart}/>
  }
  if (gamePhase === PLAY_PHASE.PLAY) {
    return (
      <div className="app">
        <span>CORRECT: {numCorrect} / TOTAL: {total}</span>
        <span>TIME REMAINING: {timeRemaining}</span>
        <img src={pokemon?.imgUri} width={96} height={96} alt='pokemon to guess'/>
        {choices.map(({name}) => {
          return (
            <div className='choices-container'>
              <button className='choice-button' type='button' onClick={() => onSelect(name)}>
                {name}
              </button>
            </div>
          )
        })}
      </div>
    )
  }
  if (gamePhase === PLAY_PHASE.END) {
    return <GameOverScreen total={total} correct={numCorrect} onRestart={onRestart} />
  }
  return null
}

export default App;

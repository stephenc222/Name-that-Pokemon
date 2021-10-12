import { PokemonItem } from "@types"
import './Play.css'

export interface PlayProps {
  numCorrect: number
  total: number
  timeRemaining: number
  choices: PokemonItem[]
  onSelect: (name: string) => void
  pokemon?: PokemonItem
}

const Play = ({ numCorrect, total, timeRemaining, choices, onSelect, pokemon}: PlayProps) => {
  return (
    <div className="app">
      <span className='score-text'>
        Score: {numCorrect} / {total}
      </span>
      <span className='time-remaining-text'>Time Remaining: {timeRemaining}</span>
      <img
        src={pokemon?.imgUri}
        width={96}
        height={96}
        alt="pokemon to guess"
      />
      {choices.map(({ name }) => {
        return (
          <div key={name} className="choices-container">
            <button
              className="choice-button"
              type="button"
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Play

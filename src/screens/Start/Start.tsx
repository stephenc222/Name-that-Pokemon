import './Start.css'

export interface StartProps {
  onStart: () => void
}

const Start = ({ onStart }: StartProps) => {
  return (
    <div className="app">
      <span className='start-text'>Name that Pokemon!</span>
      <img className='star-img' src='/pokemon-star.png' alt='game start icon' />
      <button onClick={onStart}>START GAME</button>
    </div>
  )
}

export default Start
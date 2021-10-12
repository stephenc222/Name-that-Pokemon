import './GameOver.css'

export interface GameOverProps {
  onRestart: () => void
  total: number
  correct: number
}

const GameOver = ({onRestart, total, correct}: GameOverProps) => {
  return (
    <div className="app">
      <img src='/game-over.png' className='game-over-title' alt='game over' />
      <span className='game-over-text'>Final Score: {correct}  / { total}</span>
      <span className='game-over-text'>Play Again?</span>
      <button onClick={onRestart}>START GAME</button>
    </div>
  )
}

export default GameOver
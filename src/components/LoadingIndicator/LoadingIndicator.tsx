import Loader from "react-loader-spinner";
import './LoadingIndicator.css'

const LoadingIndicator = () => {
  return (
    <div className='app'>
      <div className='loading-indicator'>
        <img className='pokeball' width={48} height={48} src="/pokeball.png" alt='pokeball' />
        <Loader color="blue" type='TailSpin'/>
      </div>
    </div>
  )
}

export default LoadingIndicator

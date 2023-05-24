import Confetti from 'react-confetti';

const ConfettiDrop = ({width, height}) => {
  return (
    <div>
        <Confetti
            width={width}
            height={height}
            numberOfPieces={600}
            recycle={false}
        />
    </div>
  )
}

export default ConfettiDrop
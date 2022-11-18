import { useState } from "react";
import PortalReactDom from "react-dom";
import ReactPlayer from "react-player";

const Trailer = ({ openTrailer, setOpenTrailer, trailerKey }) => {
  if (!openTrailer) return null;

  const [min,setMin] = useState(false);
  const [minText,setMinText] = useState("Minimize");
  
  function handleMin(){
    setMin(!min)

    if(min){
      setMinText("Minimize")
    }else{
      setMinText("Maximize")
    }
  }

  return PortalReactDom.createPortal(
    <div className={min? 'min' : 'trailer'}>
      <button className="trailer-btn close-btn" onClick={() => {setOpenTrailer(false)}}>Close X</button>      
      <button className="trailer-btn min-btn" onClick={() => {handleMin()}}>{minText}</button>      
      <ReactPlayer url={`https://www.youtube.com/watch?v=${trailerKey}`}     
      width="100%"
      height="100%"
      controls
      playing
      />
    </div>,
    document.querySelector(".portal")
  );
};

export default Trailer;

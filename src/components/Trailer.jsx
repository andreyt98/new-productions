import PortalReactDom from "react-dom";
import ReactPlayer from "react-player";

const Trailer = ({ openTrailer, setOpenTrailer, trailerKey }) => {
  if (!openTrailer) return null;

  return PortalReactDom.createPortal(
    <div className="trailer">
      <button className="close-btn" onClick={() => {setOpenTrailer(false)}}>Close X</button>      
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

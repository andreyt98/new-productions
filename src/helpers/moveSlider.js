export function moveSlider(event, sliderRef) {
    event.target.matches('.right') ? sliderRef.current.scrollBy(window.innerWidth / 2, 0) : sliderRef.current.scrollBy(-(window.innerWidth / 2), 0);
  }
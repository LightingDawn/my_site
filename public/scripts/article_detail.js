const imageBackground = document.getElementById("image-back");


function setDefaultBackgroundImage() {
  let string = "url(" + "'" + imageBackground.value + "'" + ")";
  document.body.style.backgroundImage = string;
  document.body.style.backgroundSize = "100vw 120vh";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.opacity = 0.5;
}

window.addEventListener('load', setDefaultBackgroundImage);
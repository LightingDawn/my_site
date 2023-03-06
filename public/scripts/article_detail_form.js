const displayFunctionBtn = document.querySelector('.tools button');
const functionContainer = document.querySelector('.tools .container');
const span = document.querySelector('.tools #function span');
const html = document.querySelector('html');

function displayFunction(event) {
  event.preventDefault();
  const target = event.target.parentElement;

  if (functionContainer.classList.contains('open')) {
    functionContainer.classList.remove('open');
    target.classList.remove('click');
  } else {
    functionContainer.classList.add('open');
    target.classList.add('click');
  }
}

function checkIsPointingFunc(event) {
  if(event.target !== span) {
    functionContainer.classList.remove('open');
    target.classList.remove('click');
  }
}

displayFunctionBtn.addEventListener('click', displayFunction);
html.addEventListener('click', checkIsPointingFunc);

const selectValue = document.querySelector('select');

function changeCategory(event) {
  event.preventDefault();
  console.log(selectValue.classList.value);
  for (const child of selectValue.children) {
    if (child.textContent === selectValue.classList.value) {
      child.selected = true;
    }
  }
}

window.onload = changeCategory;
const traversalButton = document.querySelector("#traversal-btn");
const traversalPopup = document.querySelector("#traversal-popup");
const closePopupButton = document.querySelector("#close-popup-btn");

traversalButton.addEventListener("click", () => {
  traversalPopup.style.display = "block";
});

closePopupButton.addEventListener("click", () => {
  traversalPopup.style.display = "none";
});
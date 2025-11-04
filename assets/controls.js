export function toggleNavbar() {
  const nav = document.querySelector("nav");
  nav.classList.toggle("show");
}

// Get the button:
const myButton = document.getElementById("home-btn");

// When the user scrolls down 20px from the top of the document, show the button
window.addEventListener("scroll", () => {
  scrollFunction();
});



export const scrollFunction = () => {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    // myButton.style.display = "block";
    myButton.classList.add("show");
  } else {
    // myButton.style.display = "none";
    myButton.classList.remove("show");
  }
};

// When the user clicks on the button, scroll to the top of the document
export const topScroll = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

window.toggleNavbar = toggleNavbar
window.topScroll = topScroll
window.scrollFunction = scrollFunction

// login.js
document.addEventListener("DOMContentLoaded", () => {
  const rememberMeCheckbox = document.querySelector('input[name="remember"]');

  rememberMeCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  });
});

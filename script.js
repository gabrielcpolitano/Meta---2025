function rodar() {
  timer = setTimeout(() => {
    document.querySelector('.demo').innerHTML = "Rodou"
  }, 2000);
}
function parar() {
  clearTimeout(timer)
}
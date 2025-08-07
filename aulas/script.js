function pegarTemperatura() {
  return new Promise(function(resolve, reject) {
    console.log("pegando temperatura...");

    setTimeout(() => {
      resolve('40 na sombra');
    }, 2000);
  })
}
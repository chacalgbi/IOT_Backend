const alertaMail = require('./utils/email')

async function alertaEmail() {
  await alertaMail('thomelucasa@gmail.com', "Alerta Donizete", "A torre está com a porta aberta!")
  .then((resp) => {
    console.log(resp)
  })
  .catch((err) => {
    console.error(err)
  })
}

alertaEmail()
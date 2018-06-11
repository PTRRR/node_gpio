import Client from './client'
var client = new Client('app')
// 
client.onMessage(data => {
  switch (data.type) {
  case 'click':
    console.log(data.message.text)
    break
  default:
    console.log(data)
    break
  }
})
window.onclick = () => {
  client.send('*', 'click', {text: 'dummy text'})
}

document.body.addEventListener('touchend', () => {
  client.send('*', 'click', {text: 'dummy text'})
})
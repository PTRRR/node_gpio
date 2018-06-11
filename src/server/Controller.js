export default class Controller {
  constructor () {
    this.onFeedbackHandler = null
  }

  onMessage(msg) {
    console.log(msg)
  }

  onFeedback(handler) {
    this.onFeedbackHandler = handler
  }
}
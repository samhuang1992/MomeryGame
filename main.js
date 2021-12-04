const GAME_STATE = {
  FirstCardAwaits:  'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

// 花色圖片
const Symbols = [
  'https://cdn-icons-png.flaticon.com/512/105/105223.png', // 黑桃
  'https://cdn-icons-png.flaticon.com/512/105/105220.png', // 愛心
  'https://cdn-icons-png.flaticon.com/512/105/105212.png', // 方塊
  'https://cdn-icons-png.flaticon.com/512/105/105219.png' // 梅花
]

//  View
const view = {
  getCardContent (index) {
    // 將52張牌分為四列
    const number = this.transFormNumber((index % 13) +1)
    // 
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
    `
  },

  getCardElement (index) {
   return `<div class="card back" data-index="${index}"></div>`
  },

  transFormNumber (number) {
  switch(number) {
    case 1: 
      return 'A'
    case 11:
      return 'J'
    case 12:
      return 'Q'
    case 13:
      return 'K'  
    default:
      return number
  }
},
  displayCards (indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  },
  flipCards (...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
      //如果按了，回傳正面
      card.classList.remove('back')
      card.innerHTML = this.getCardContent(Number(card.dataset.index))
      return
      }
      //如果沒按，回傳背面 
      card.classList.add('back')
      card.innerHTML = null  
    })
  },

  pairCards (...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })   
  },
  renderScore(score) {
    document.querySelector('.score').innerHTML = `Score: ${score}`
  },
  renderTriedTimes(times) {
    document.querySelector('.tried').innerHTML = `You've tried: ${times} times`
  },
  appendWrongAnimation (...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', e => 
      e.target.classList.remove('wrong'),{once: true})
    })
  },
  showGameFinished () {
    const div = document.createElement('div')
    // 若加上completed element就加上css設定樣式
    div.classList.add('completed')
    div.innerHTML =`
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
} 

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length-1; index > 0; index--) {
     let randomIndex = Math.floor(Math.random() * (index +1))
     ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

// Controller
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  dispatchCardAction(card) {
    if(!card.classList.contains('back')){
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(model.triedTimes++)
        view.flipCards(card)
        model.revealedCards.push(card)
        // 翻完第二張牌後判斷配對是否成功
        // 配對成功
        if (model.isRevealedCardMatched()) {
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards=[]
          // 如果滿分就顯示畫面
          if (model.score === 10) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        }else{
        // 配對失敗
        this.currentState = GAME_STATE.CardsMatchFailed
        view.appendWrongAnimation(...model.revealedCards)
        setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log('this.currentState:', this.currentState)
    console.log('revealedCards:', model.revealedCards.map(card => card.dataset.index))
  },

  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards=[]
    controller.currentState = GAME_STATE.FirstCardAwaits    
    // console.log('Controller :', controller.currentState)
  }
}


// Model
const model = {
  // 暫存牌區,每次翻牌時就先把卡片丟進這個牌組,檢查完後，暫存牌組就須清空
  revealedCards:[],
  isRevealedCardMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

controller.generateCards()


// Node List
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
   controller.dispatchCardAction(card)
  })
  
});


const user = {
  name: ['Peter', 'Lee'],
  gender: 'Male',
  age: 41,
  greet: function () {
    console.log(`Hello! I am ${this.name}.`)
  },
  run: function () { console.log('run!')}
}
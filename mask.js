
let creditCard = "38383948484848";

function maskCard(card){
          let cardArr = card.split("");
          let cardLen = card.length;
          let startIndex = 4;
          let endIndex = cardLen - 5;
          for(let i = startIndex; i <= endIndex; i++){
             cardArr[i] = "*";
             
          }
  return  cardArr
}

let newCard =  maskCard(creditCard);
console.log(newCard.join(""));

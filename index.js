

var suits = ["spade","heart","diamond","clover"];
var values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var deck = [];
var legend = [];
var employeeList = [];
//By default the dealer is player[0]
var players = new Array();

var gameEnded = false;

function generatePlayers(num){
    for (let k = 0; k < num; k++){
        if(k == 0){
            var player = {
                Hand: [],
                Score: 0,
                Name: 'Dealer'
            }
            players.push(player);
        }else{
            var player = {
                Hand: [],
                Score: 0,
                Name: 'Player'
            }
            players.push(player);
        }
    }
}


function clickHitMe(){
    if(!gameEnded){
        let curCard = deck.pop();
        let curPlayer = players[1];
        console.log(deck.length);
        console.log(deck);
        console.log(curCard);
        curPlayer.Hand.push(curCard);
        generateCardUI(curCard,"dealer_layout");
    }
}


function generateCardUI(card,layout){
        var playCard = document.createElement("div");
        playCard.id = 'card';
        console.log(card);

        var img = document.createElement("img");
        var iconTopLeft = document.createElement("img");
        iconTopLeft.src = 'icons/' +  card.Color + "-" + card.Suit + '.png';
        iconTopLeft.id = 'iconTopLeft';

        var iconTopRight = document.createElement("img");
        iconTopRight.src = 'icons/' +  card.Color + "-" + card.Suit + '.png';
        iconTopRight.id = 'iconTopRight';

        var iconBottomRight = document.createElement("img");
        iconBottomRight.src = 'icons/' +  card.Color + "-" + card.Suit + '.png';
        iconBottomRight.id = 'iconBottomRight';

        var iconBottomLeft = document.createElement("img");
        iconBottomLeft.src = 'icons/' +  card.Color + "-" + card.Suit + '.png';
        iconBottomLeft.id = 'iconBottomLeft';

        img.src = card.Person.imgUrl;
        img.id = 'cardFace';
        playCard.appendChild(img);
        playCard.appendChild(iconBottomLeft);
        playCard.appendChild(iconBottomRight);
        playCard.appendChild(iconTopLeft);
        playCard.appendChild(iconTopRight);

        var src = document.getElementById(layout);
        src.appendChild(playCard);
}


function generateDeck(){
    //Get 13 random employees
    for(let z = 0; z < values.length; z++){
        var min = 0;
        var max = employeeList.length;
        var random = Math.floor(Math.random() * (+max - +min)) + +min;
        //console.log("Min: "+ min + " Max: "+ max+ " Random: " +random);
        legend[z] = employeeList[random];
    }
    //console.log(legend);
    //Iterate through our suits/values arrays
    for(let i = 0; i < values.length; i++){
        for(let j = 0; j < suits.length; j++){
            //Grab the current variable for testing
            var trueValue = values[i];
            //If not a face card/A store numerical value 
            if(trueValue!='J'&& trueValue!='Q' && trueValue!='K'&& trueValue!='A'){
                trueValue  = parseInt(values[i]);
            }
            //If face card assign value of ten, if A have a choice between 1 or 11
            else{
                if(trueValue == 'J' || trueValue == 'Q' || trueValue == 'K'){
                    trueValue = 10;
                    console.log("TrueValue: "+ trueValue);
                }
                if(trueValue == 'A'){
                    trueValue = [1,11];
                }
            }
            //Create a card object with the suit,value,weight,employee
            var card = {
                Value: values[i],
                Suit: suits[j],
                Weight: trueValue,
                Person: legend[i],
                Color: null,
        
            }
            //Add the card to the deck
            deck.push(card);
        }
    }
    for(let z = 0; z < deck.length;z++){
        if(deck[z].Suit == 'heart' || deck[z].Suit == 'diamond'){
            deck[z].Color = 'red';
        }else{
            deck[z].Color = 'black';
        }
    }
}



// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();


// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://willowtreeapps.com/api/v1.0/profiles/', true);

request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  //Iterate through the JSON data and store the relevant information in an Employee object
  data.forEach(per => {
      var employee = {
      id: per.id,
      firstName: per.firstName,
      lastName: per.lastName,
      jobTitle: per.jobTitle,
      imgUrl: per.headshot.url
      }
      //Add the Employee object to the employeeList 
      employeeList.push(employee);
    });
    generateDeck();
    console.log("Deck Length: " + deck.length);
    console.log(deck);
    generatePlayers(2);
    console.log("Dealer: "+ players[0].Name + " Player: "+ players[1].Name);
    //document.getElementById("button_hit").addEventListener("onclick", clickHitMe());
    
  }
// Send request
request.send();

 
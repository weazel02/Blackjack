/*
Created by: Wesley Thompson
Employee Blackjack: A simple memorization game inspired by the rules of Blackjack
*/
var suits = ["spade","heart","diamond","clover"]; /*Suits array used for deck building*/
var values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]; /*Value array used for deck building*/
var deck = []; /*Array to store our deck*/
var legend = []; /*Array for generating legend ui*/
var employeeList = []; /*Array of employee objects*/
var players = new Array(); /*Array of player, players[0] is the dealer*/
var gameEnded = false; /*Boolean used to maintain game state*/
var hasHitMe = false; /*Boolean used to maintain game state*/
var dealerScoreTotal = 0; /*Dealers number of wins*/
var playerScoreTotal = 0; /*Player number of wins*/ 
var dealerCardElements = [];/*Array holding dom elements for dealer*/ 
var playerCardElements = [];/*Array holding dom elements for player*/ 
var cheatsEnabled = false;/*Boolean for maintaing game state*/ 
var scoreToWin = 5; /*Score necesary to determine a winner*/
var hasBusted = false; /*Boolean used to see if the player has busted*/
var numDecks = 2; /* The number of decks you wish to play with*/
var numPlayers = 2; /*The number of players.... keep at 2 please*/

/*Toolkit Functions*/ 

/*Function to shuffle the global deck*/ 
function shuffle(){
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++){
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}
/*Async function used to temporarily sleep the UI and then remove unnecessary card elements */
const waitForLoad = async () => {
    await sleep(2000)
    removeCardsUI();
  }
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
/*General async function used whenever i want to make the browser wait for a given input*/
const waitFor = async(time) =>{
    await(time);
}
/*Generation Function*/
/*Create and add players to the players array, dealer is player[0]*/
function generatePlayers(num){
    for (let k = 0; k < num; k++){
        if(k == 0){
            var player = {
                Hand: new Array(),
                Score: 0,
                Name: 'Dealer'
            }
            players.push(player);
        }else{
            var player = {
                Hand: new Array(),
                Score: 0,
                Name: 'Player'
            }
            players.push(player);
        }
    }
}

/*Function for rendering legend UI*/
function renderLegend(){
    for(person of legend){
        if(!cheatsEnabled){
        //Get the legend DOM element and append with with the current employee's name/weight 
        var leg = document.getElementById("legend");
        var name = person.firstName +" "+person.lastName + ": "+ person.cardValue;
        var nameElement = document.createElement("div");
        nameElement.innerHTML = name;
        nameElement.className = "legend_element"
        leg.appendChild(nameElement);
        }
    }
}
/* Function used to see if the player has busted*/
function checkForBust(){
    //Set up our initial scores
    let playerScore = 0;
    let playerScoreA = 0;
    let curPlayer = players[1];

    //Iterate through the player's hand and calculate his score with/without an Ace
    for(let card of curPlayer.Hand){
        if(card.Weight.length == 2){
            playerScore += card.Weight[0];
            playerScoreA += card.Weight[1];
        }
        else{
            playerScore += card.Weight[0];
            playerScoreA += card.Weight[0];
        }
    }
    //Check to see if the player busted
    if(playerScore > 21 && playerScoreA >21){
        hasBusted = true;
    }
}
/*Function used to check if the game has ended... if so make some UI updates */
function hasGameEnded(){
    if(playerScoreTotal == scoreToWin || dealerScoreTotal == scoreToWin){
        waitFor(2000);
        gameEnded = true;
        console.log("GAME ENDED");
        document.getElementById("button_hit").disabled = true;
        document.getElementById("button_stay").disabled = true;
        if(playerScoreTotal>dealerScoreTotal){
        document.getElementById("title_subtext").innerHTML = "You are the Winner!";
        document.getElementById("player_layout").innerHTML = "";
        document.getElementById("dealer_layout").innerHTML = "";

        }else{
            document.getElementById("title_subtext").innerHTML = "The Dealer Won!";
            document.getElementById("player_layout").innerHTML = "";
            document.getElementById("dealer_layout").innerHTML = "";
        }
    }
}
/* Function that handles the logic for when Hit Me is clicked */
function clickHitMe(){
    if(!gameEnded){
        if(hasHitMe){
            //Get the card on the top of the deck and render it for the player if they have hit before
            let curCard = deck.pop();
            let curPlayer = players[1];
            curPlayer.Hand.push(curCard);
            generateCardUI(curCard,"player_layout");
            checkForBust();
            if(hasBusted){
                clickStay();
                hasBusted = false;
            }
        }else{
            //If they have not hit before then the dealer and the player get 2 cards each 
            let dealerFirstCard = deck.pop();
            let playerFirstCard = deck.pop();
            let dealerSecondCard = deck.pop();
            let playerSecondCard = deck.pop();
            //Add the cards to the players hands
            for(let player of players){
                if(player.Name == 'Dealer'){
                    player.Hand = new Array();
                    player.Hand.push(dealerFirstCard);
                    player.Hand.push(dealerSecondCard);
                }else{
                    player.Hand = new Array();
                    player.Hand.push(playerFirstCard);
                    player.Hand.push(playerSecondCard);
                }
            }
            //Render all the cards 
            generateCardUI(dealerFirstCard,"dealer_layout");
            generateCardUI(dealerSecondCard,"dealer_layout");
            generateCardUI(playerFirstCard,"player_layout");
            generateCardUI(playerSecondCard,"player_layout");
            hasHitMe = true;
        }
    }
}
//Funtion that creates the logic for when stay is clicked. Disables the buttons and calculates scores to determine a winner
function clickStay(){
    if(!gameEnded && hasHitMe){
        //Disbale buttons
        document.getElementById("button_hit").disabled = true;
        document.getElementById("button_stay").disabled = true;
        //Set up variables for scoring
        let playerScore = 0;
        let playerScoreA = 0;
        let dealerScore = 0;
        //Get our players
        let dealer = players[0];
        let curPlayer = players[1];
        //Calculate the dealers hand value 
        for(let card of dealer.Hand){
            dealerScore+=card.Weight[0];
        }
        //If the the player hasnt busted then the dealer draws until has hand is greater than 17
        if(!hasBusted){
            while(dealerScore<=17){
                let curCard = deck.pop();
                dealerScore+= curCard.Weight[0];
                dealer.Hand.push(curCard);
                generateCardUI(curCard,"dealer_layout");
            }
        }
        //Caculate the players hand value with/without and ace
        for(let card of curPlayer.Hand){
            if(card.Weight.length == 2){
                playerScore += card.Weight[0];
                playerScoreA += card.Weight[1];
            }
            else{
                playerScore += card.Weight[0];
                playerScoreA += card.Weight[0];
            }
        }
        //Else if chain determining who won the hand. Updates UI accordingly 
        if(playerScore < 22 && dealerScore < 22 && playerScore>dealerScore){
            playerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Won!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }else if(playerScoreA < 22 && dealerScore < 22 && playerScoreA>dealerScore){
            playerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScoreA + "  You Won!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }
        else if(playerScore<22 && dealerScore>22){
            playerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Won!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }
        else if(playerScoreA<22 && dealerScore>22){
            playerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScoreA + "  You Won!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }else if(playerScore == 21 && dealerScore == 21 && dealer.Hand.length == 2 && curPlayer.Hand.length!= 2){   
            dealerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Lost!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);         
        }else if(playerScoreA == 21 && dealerScore == 21 && dealer.Hand.length == 2 && curPlayer.Hand.length!= 2){   
            dealerScoreTotal++;   
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScoreA + "  You Lost!";
            console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }else if(playerScore == dealerScore){
                document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
                document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
                document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
                document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Tie!";
                console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
            } else if(playerScoreA == dealerScore){
                document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
                document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
                document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
                document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Tie!";
                console.log("Player Hand Value: " + playerScoreA+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal); 
        }   
        else{
            dealerScoreTotal++;
            document.getElementById("player_score").innerHTML = "Player Score: " + playerScoreTotal;
            document.getElementById("dealer_score").innerHTML = "Dealer Score: "  + dealerScoreTotal;
            document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: "  + dealerScore;
            document.getElementById("player_title").innerHTML = "Player Hand Value: "  + playerScore + "  You Lost!";
            console.log("Player Hand Value: " + playerScore+ " Player Score: "+ playerScoreTotal + "\n"+ "Dealer Hand Value: "+ dealerScore + " Dealer Score: "+ dealerScoreTotal);
        }
    waitForLoad().then(hasGameEnded);
    }
}




/*Function used to remove the playing cards from both dealer/player layouts*/  
function removeCardsUI(){
    for(var i = dealerCardElements.length - 1; i >= 0; i--){
        dealerCardElements[i].parentNode.removeChild(dealerCardElements[i]);
        dealerCardElements.pop();
    }
    for(var a = playerCardElements.length - 1; a >= 0; a--){
        playerCardElements[a].parentNode.removeChild(playerCardElements[a]);
        playerCardElements.pop();
    }
    document.getElementById("dealer_title").innerHTML = "Dealer Hand Value: ";
    document.getElementById("player_title").innerHTML = "Player Hand Value: ";
    document.getElementById("button_hit").disabled = false;
    document.getElementById("button_stay").disabled = false; 
    hasHitMe = false;
}


/*Function used to generate the UI for a card element*/
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
        if(layout == "dealer_layout"){
            dealerCardElements.push(playCard);
        }
        if(layout == "player_layout"){
            playerCardElements.push(playCard);
        }
}

/*Function used to generate the a deck with a variable amount of cards depending on input*/
function generateDeck(numOfDecks){
    let i = 0;
    while(i < numOfDecks){
        //Get 13 random employees
        let z = 0;
        var sameEmployee = false;
        while(legend.length<values.length){
            console.log(legend.length);
            var min = 0;
            var max = employeeList.length;
            var random = Math.floor(Math.random() * (+max - +min)) + +min;
            //Check to see if this employee has already been added
            for(let a = 0; a < legend.length; a++){
                if(legend[a].id==employeeList[random].id){
                    console.log("SAME EMPLOYEE" + legend[a].id + "  --- "+ employeeList[random].id);
                    sameEmployee = true;
                    continue;
                }
            }
            //If they havent been added, add them to the legend 
            if(!sameEmployee){
            legend[z] = employeeList[random];
            z++;
            }else{
                sameEmployee = false;
                continue;
            }
        }
        console.log(legend);
        //Iterate through our suits/values arrays
        for(let i = 0; i < values.length; i++){
            for(let j = 0; j < suits.length; j++){
                //Grab the current variable for testing
                var trueValue = values[i];
                legend[i].cardValue = trueValue;
                //If not a face card/A store numerical value 
                if(trueValue!='J'&& trueValue!='Q' && trueValue!='K'&& trueValue!='A'){
                    tempValue  = parseInt(values[i]);
                    trueValue = new Array();
                    trueValue.push(tempValue);
                    
                }
                //If face card assign value of ten, if A have a choice between 1 or 11
                else{
                    if(trueValue == 'J' || trueValue == 'Q' || trueValue == 'K'){
                        trueValue = [10];
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
        i++;
    }
    shuffle();
}

/********************************************************************************/
/*API request that setups the website*/
/********************************************************************************/

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
      imgUrl: per.headshot.url,
      cardValue: null
      }
      //Add the Employee object to the employeeList 
      if(typeof(employee.imgUrl)!= 'undefined')
      employeeList.push(employee);
    });
    //Lets set up our decks and render our legend 
    generateDeck(numDecks);
    generatePlayers(numPlayers);
    renderLegend();
    
  }
// Send request
request.send();

 
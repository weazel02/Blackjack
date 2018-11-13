

var suits = ["Spades","Hearts","Diamonds","Club"];
var values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
var deck = [];

function generateDeck(){

    for(let i = 0; i < values.length; i++){
        for(let j = 0; j < suits.length; j++){
            var trueValue = values[i];
            console.log("TrueValue: "+ trueValue);
            if(trueValue == 'J'){
                console.log("HERE!!!!!!!!!!!");
            }
           
            if(trueValue!='J'&& trueValue!='Q' && trueValue!='K'&& trueValue!='A'){
                trueValue  = parseInt(values[i]);
            }else{
                if(trueValue == 'J' || trueValue == 'Q' || trueValue == 'K'){
                    trueValue = 10;
                    console.log("TrueValue: "+ trueValue);
                }
                if(trueValue == 'A'){
                    trueValue = [1,11];
                }
            }
            
            var card = {
                Value: values[i],
                Suit: suits[j],
                Weight: trueValue
            }
            deck.push(card);
        }
    }

}
generateDeck();
console.log("Deck Length: " + deck.length);
console.log(deck);


// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();
var employeeList = [];

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
    console.log(employeeList.length);
  }
// Send request
request.send();
 
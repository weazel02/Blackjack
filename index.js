

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();
var employeeList = [];
var Employee = {
    id: null,
    jobTitle: null,
    firstName:null,
    lastName:null,
    imgUrl:null
}
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://willowtreeapps.com/api/v1.0/profiles/', true);

request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  
  data.forEach(per => {
      var curEmployee = {
      id: per.id,
      firstName: per.firstName,
      lastName: per.lastName,
      jobTitle: per.jobTitle,
      imgUrl: per.headshot.url
      }
      employeeList.push(curEmployee);
      console.log(curEmployee);
  // 
  
});
  }
 


// Send request
request.send();
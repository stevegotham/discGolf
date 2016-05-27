var $http = require('request');
$http = $http.defaults({jar: true})

module.exports = {

  search : function(req, res) {
    console.log(req)
    $http({
      url: 'https://api.pdga.com/services/json/user/login',
      method: 'POST',
      form: {
        'username' : 'stevieg',
        'password' : ''
      }
    },function(err, response, body) {
      $http('http://api.pdga.com/services/json/course?postal_code=81212&limit=200', function(err, response, body) {
        var result = JSON.parse(body)
        res.send(result)
      })
    })
  }

}

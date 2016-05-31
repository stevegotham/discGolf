var $http = require('request');
$http = $http.defaults({jar: true});
var Course = require('../models/courseModel.js')

module.exports = {

  search: function(req,res) {

  }

  // search : function(req, res) {
  //   console.log(req.query)
  //   $http({
  //     url: 'https://api.pdga.com/services/json/user/login',
  //     method: 'POST',
  //     form: {
  //       'username' : 'stevieg',
  //       'password' : pw.pw
  //     }
  //   },function(err, response, body) {
  //     $http('http://api.pdga.com/services/json/course?state_prov=WY&limit=200', function(err, response, body) {
  //       var result = JSON.parse(body)
  //       var courses = result.courses
  //       // console.log(courses[0].state_prov)
  //       for (var i=0;i<courses.length;i++) {
  //         var course = {
  //           city: courses[i].city,
  //           description: courses[i].course_description,
  //           name: courses[i].course_name,
  //           directions: courses[i].directions,
  //           holes: courses[i].holes,
  //           teeTypes: courses[i].tee_types,
  //           zipCode: courses[i].postal_code,
  //           state: courses[i].state_province,
  //           lat: courses[i].latitude,
  //           long: courses[i].longitude
  //         }
  //         var newCourse = new Course(course)
  //         newCourse.save()
  //       }
  //       res.send(result)
  //     })
  //   })
  // }

}

var $http = require('request');
$http = $http.defaults({jar: true});
var Course = require('../models/courseModel.js')

module.exports = {

// -=-=-=-=-=-=-=-=-=- search database for multiple courses -=-=-=-=-=-
  search: function(req,res) {
    var query = {}
    if(req.query.city) query.city = req.query.city;
    if(req.query.name) query.name = req.query.name;
    if(req.query.state) query.state = req.query.state;
    if(req.query.zipCode) query.zipCode = req.query.zipCode;

    Course.find(query, function(err, course) {
      if (err) res.json({error: err})
      res.json(course)
    })
  },
// -=-=-=-=-=-=-=-=-=- search database for singular course, to be used in single course page -=-=-=-=-=-=-=-
  searchOne: function(req,res) {
    Course.findById(req.params.id, function(err, course) {
      if (err) res.json({error: err})
      res.json(course)
    })
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

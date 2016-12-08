var mysql = require('mysql');
var config = require('./config')['production'];

var connection = mysql.createConnection(
    {
	host : config.database.host,
	user : config.database.user,
	password : config.database.password,
	database : config.database.name,
    }
);

connection.connect();

var express = require('express')
var app=express()
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
, logger = require('morgan')
, app = express()
, home = require('jade').compileFile(__dirname + '/templates/homepage.jade')
, company = require('jade').compileFile(__dirname + '/templates/company.jade')
, directory = require('jade').compileFile(__dirname + '/templates/directory.jade')
, about = require('jade').compileFile(__dirname + '/templates/about.jade')
, compare = require('jade').compileFile(__dirname + '/templates/compare.jade')

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'text/html' }))

app.get('/', function (req, res, next) {
    var html = home({ title: 'Home'})	    
    try {
	res.send(html)
    } catch (e) {
	next(e)
   }
})

app.get('/about', function (req, res, next) {
    try {
	var html = about({ title: 'About' })
	res.send(html)
    } catch (e) {
	next(e)
    }
})
/*
app.get('/company_new', function (req, res, next) {
    try {
	res.render(__dirname + '/templates/company_new.jade',
		   {issue_names: ['Abortion', 'Immigration']})
    } catch (e) {
	next(e)
    }
})
*/
app.get('/directory', function (req, res) {
    var queryString = 'Select Orgname from organization'
    console.log(queryString)
    connection.query(queryString, function(err_query, data){
	var arr = []
	for(var i = 0; i < data.length; i++)
	    arr.push(data[i].Orgname)
	console.log("First val: " + arr[42])
	console.log(arr)
	res.render(
	    __dirname + '/templates/directory.jade',
	    {list: arr})
    })
})
		  
app.post('/company', function (req, res) {
    var userSearch = req.body.comp_name
    var queryString = 'SELECT * from  organization, org_score, issue  where organization.Orgname like \'' + userSearch + "' AND organization.Id=org_score.org_id AND issue.id=org_score.issue_id";
    console.log(queryString)
    connection.query(queryString, function(err_query, data) {
	console.log(data)
	if(typeof data[0] != 'undefined' && data){
	    var desc  = []
	    for(var i = 0; i < 10; i++)
	    {
		if(data[i].score < 0){
		    console.log("NEGATIVE")
		    desc.push(data[i].issue_negative_desc)
		}
		else if(data[i].score > 0){
		    console.log("POSITIVE")
		    desc.push(data[i].issue_positive_desc)
		}
		else{
		    desc.push("No calculated lean.")
		    console.log("NO LEAN")
		}
	    }
	    res.render(
		__dirname + '/templates/company.jade',
		{company: data[0].Orgname, total_amount: data[0].total_amount, total_contr: data[0].total_contr,
		 abortion: data[0].score, abortion_lean: desc[0],  financial_regulation: data[1].score, financial_regulation_lean: desc[1],
		 STI: data[2].score, STI_lean: desc[2], immigration: data[3].score, immigration_lean: desc[3],
		 foreign_trade: data[4].score, foreign_trade_lean: desc[4], healthcare_score: data[5].score, healthcare_lean: desc[5],
		gun_control_score: data[6].score, gun_control_lean: desc[6], taxation_score: data[7].score, taxation_lean: desc[7],
		 labor_score: data[8].score, labor_lean: desc[8], environment_score: data[9].score, environment_lean: desc[9]})
	}
	else{
	    console.log('Invalid search.')
	}
    })
		    
})

app.get('/compare', function (req, res, next) {
    var html = compare()
    try {
	res.send(html)
    } catch (e) {
	next(e)
    }
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on http://http://ec2-54-212-210-64.us-west-2.compute.amazonaws.com:' + (process.env.PORT || 3000))
})

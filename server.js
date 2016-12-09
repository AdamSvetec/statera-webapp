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
	    arr.push(data[i])
	console.log("First val: " + arr[42])
	console.log(arr)
	res.render(
	    __dirname + '/templates/directory.jade',
	    {list: data})
    })
})
		  
app.post('/company', function (req, res) {
    var userSearch = req.body.comp_name
    var queryString = "SELECT * from  organization, org_score, issue  where organization.Orgname like '%" + userSearch + "%' AND organization.Id=org_score.org_id AND issue.id=org_score.issue_id ORDER BY org_score.org_id, issue.Id";
    console.log(queryString)
    connection.query(queryString, function(err_query, data) {
	//console.log(data)
	if(typeof data[0] != 'undefined' && data){
	    var desc  = []
	    var scores = [10]
	    for(var i = 0; i < 10; i++)
	    {
		scores[i] = [2]
		scores[i][0] = 0
		scores[i][1] = 0
		if(data[i].score < 0){
		    console.log("NEGATIVE")
		    desc.push(data[i].issue_negative_desc)
		    scores[i][0]= Math.floor(data[i].score * -100)
		    console.log(scores[i][0])
		}
		else if(data[i].score > 0){
		    console.log("POSITIVE")
		    desc.push(data[i].issue_positive_desc)
		    scores[i][1]=Math.floor(data[i].score * 100)
		    console.log(scores[i][1])
		}
		else{
		    desc.push("No calculated lean.")
		    console.log("NO LEAN")
		}
	    }
	    res.render(
		__dirname + '/templates/company.jade',
		{company: data[0].Orgname, total_amount: data[0].total_amount.toLocaleString('en-US'), total_contr: data[0].total_contr.toLocaleString('en-US'),
		 abortion: data[0].score, abortion_lean: desc[0], abortion_lean_l: scores[0][0], abortion_lean_r: scores[0][1],
		 financial_regulation: data[1].score, financial_regulation_lean: desc[1], fin_lean_l: scores[1][0], fin_lean_r: scores[1][1],
		 STI: data[2].score, STI_lean: desc[2], STI_lean_l: scores[2][0], STI_lean_r: scores[2][1],
		 immigration: data[3].score, immigration_lean: desc[3], immigration_lean_l: scores[3][0], immigration_lean_r: scores[3][1],
		 foreign_trade: data[4].score, foreign_trade_lean: desc[4], foreign_trade_lean_l: scores[4][0], foreign_trade_lean_r: scores[4][1],
		 healthcare_score: data[5].score, healthcare_lean: desc[5], healthcare_lean_l: scores[5][0], healthcare_lean_r: scores[5][1],
		 gun_control_score: data[6].score, gun_control_lean: desc[6], gun_control_lean_l: scores[6][0], gun_control_lean_r: scores[6][1],
		 taxation_score: data[7].score, taxation_lean: desc[7], taxation_lean_l: scores[7][0], taxation_lean_r: scores[7][1],
		 labor_score: data[8].score, labor_lean: desc[8], labor_lean_l: scores[8][0], labor_lean_r: scores[8][1],
		 environment_score: data[9].score, environment_lean: desc[9], environment_lean_l: scores[9][0], environment_lean_r: scores[9][1],
		}
	    )
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

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Team     = require('./models/team');

mongoose.connect('mongodb://localhost/lmx');

app.use(bodyParser.urlencoded( { extended:true } ));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/',function(req,res){
	res.json({ message: 'hooray welcome to our api' });
});

router.route('/team')
	.post(function(req,res){
		var team = new Team();
		team.name = req.body.name;

		team.save(function(err){
			if(err){
				res.send(err);
			}
			res.json({ message: 'Team created' })	

		});
	})
	.get(function(req,res){
		Team.find(function(err,teams){
			if(err){
				res.send(err);
			}
			res.json(teams);

		});
	});

router.route('/team/:team_id')
	.get(function(req,res){
		Team.findById(req.params.team_id, function(err,team){
			if(err){
				res.send(err);
			}
			res.json(team);

		});
	})
	.put(function(req,res){
		Team.findById(req.params.team_id, function(err,team){
			if(err){
				res.send(err);
			}
			team.name = req.body.name;
			team.save(function(err){
				if(err){
					res.send(err);
				}
				res.json({message: 'Team updated!'});

			});
		});
	})
	.delete(function(req,res){
		Team.remove({
			_id: req.params.team_id
		}, function(err,bear){
			if(err){
				res.send(err);
			}
			res.json({ message: 'Succesfully deleted' });
		});
	});

app.use('/api',router);

app.listen(port);
console.log('Magic happens on port: ' + port);
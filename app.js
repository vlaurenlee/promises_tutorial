var express = require('express');
var app = express();
var when = require('when');

app.get('/', function(req, res){
	res.send('Hello World');
});

function random(low, high){
	return Math.random() * (high-low) + low;
}

function delay(secs) {
    var d = when.defer();
    setTimeout(function () {
        d.resolve(secs);	//<-- resolve send the value to fulfill the promise, in this case, it's the number of seconds
    }, secs * 1000);
    return d.promise;		//<-- d.promise is treated like the final value, in this case secs, 
}

//1. Example of promises
app.get('/1', function(req, res){
	var promise = delay(5);

	promise.then(function(value){
		console.log('Promise fulfilled, value: '+value);
		res.send('Example 1');
	}, function(err){
		console.log(err);
		res.send(406);
	})
});

//2. Example of array promises,
app.get('/2', function(req, res){
	var promises = [
		delay(5),
		delay(1),
		delay(2)
	];

	when.all(promises).then(function(value){
		console.log('all delays resolved: ', value);
	});

	when.any(promises).then(function(value){
		console.log('any delay resolved: ', value);
	});

	res.send('Example 2');
});

//3. Example of promise rejection/resolving
function task(val){
	var task = when.promise(function(resolve, reject, notify){
		setTimeout(function() {
			var num = Math.round(random(1, 100));
			console.log('Handing the task for '+val+', number generated is: '+num);
			if (num % 2 == 0){
				resolve(val);
			} else {
				reject('We lost the coin toss');
			}
		}, 2000);
	});
	return task;
}

app.get('/3', function(req, res){
	var tasks = [
		task('hello'),
		task('world')
	];
	when.all(tasks).then(function(tasks){
		console.log('all tasks resolved: ', tasks);
	}, function(err){
		console.log('Error Handling, error is: '+err);
	});

	when.any(tasks).then(function(task){
		console.log('one task resolved: ', task)
	}, function(err){
		console.log('Error Handling, error is: '+err);
	});

	res.send('Example 3');

});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});





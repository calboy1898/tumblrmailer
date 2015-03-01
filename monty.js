// Assume Door 1 is always chosen by contestant, door with car is chosen by random

//Calculates probably of winning by sticking with door 1
var staywincount=0;
var switchwincount=0;
//calculates odds of winning by staying with door 1, simulation run 500 times
for (var i=1;i<=500;i++){
	var cardoor=Math.floor(Math.random()*3);
	if (cardoor===0){
		staywincount++;
	}
}
console.log("By Staying with Door 1, you have a "+staywincount/5+"% chance of winning!");

//calculates odds of switching, simulation run 500 times
for (var i=1;i<=500;i++){
	var cardoor=Math.floor(Math.random()*3);
	if (cardoor!==0){
		switchwincount++;
	}
}
console.log("By switching, you have a "+switchwincount/5+"% chance of winning!");

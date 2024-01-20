function setReqUpgrades() {
	//1: Double Req Experience Gain (Cost: 5 re)
	document.getElementsByClassName("req-upgrade-button")[0].addEventListener("click", function() {
	let upgradeCost = 5
	if (player.experience >= upgradeCost) {
		player.experience -= upgradeCost;
		player.baseExperienceGain *= 2;
		player.reqUpgrades[1] = true;
		document.getElementsByClassName("req-upgrade-button")[0].style.display = "none";
	}});
	
	//2: Finish Reqs 10% Faster (Cost: 12 re)
	document.getElementsByClassName("req-upgrade-button")[1].addEventListener("click", function() {
	let upgradeCost = 12
	if (player.experience >= upgradeCost) {
		player.experience -= upgradeCost;
		player.reqFinishRate *= 1.1;
		player.reqUpgrades[2] = true;
		document.getElementsByClassName("req-upgrade-button")[1].style.display = "none";
	}});
	
	//3: Increase Req Experience Gain By 50% (Cost: 20 re)
	document.getElementsByClassName("req-upgrade-button")[2].addEventListener("click", function() {
	let upgradeCost = 20
	if (player.experience >= upgradeCost) {
		player.experience -= upgradeCost;
		player.baseExperienceGain *= 1.5;
		player.reqUpgrades[3] = true;
		document.getElementsByClassName("req-upgrade-button")[2].style.display = "none";
	}});
	
	//4: Unlock Auto Req Finisher
	document.getElementsByClassName("req-upgrade-button")[3].addEventListener("click", function() {
	let upgradeCost = 30
	if (player.experience >= upgradeCost) {
		player.experience -= upgradeCost;
		player.autoReqFinisherActive = true;
		player.reqUpgrades[4] = true;
		document.getElementsByClassName("req-upgrade-button")[3].style.display = "none";
	}});
}

function initializeGame(callback) {
	document.getElementById("do-req").addEventListener("click", doReq);
	setReqUpgrades();
	
	callback();
}

initializeGame(startGame);

function startGame() {
	var tickInterval = 100;

	window.setInterval(tick, tickInterval);
}

//objects

const player = {
	//player currency
	experience: 0,
	baseExperienceGain: 1,
	
	//statistics
	totalReqsDone: 0,
	
	//grade
	grade: 1,
	
	//reqs
	reqs: 0,
	reqFinishRate: 1,
	reqsFinishedPerCycle: 1,
	reqChance: 1,
	reqUpgrades: {
		1: false, 2: false, 3: false,
	},
	
	//quarter
	quarterReqsFinished: 0,
	quarterGrade: 0,
	
	//unlocks
	autoReqFinisherActive: false,
}

const game = {
	//date values
	years: 2000,
	months: 1,
	days: 1,
	hours: 1,
	
	quarter: 1,
	daysToNextQuarter: 90,
	
	//reqs
	reqDifficulty: 1,
	
	//quarter
	quarterReqsAssigned: 0,
}

function tick() {
	updateText();
	updateDateValues();
	tryNewReq();
	computeValues();
}

function updateDateValues() {
	game.hours += 60;
	
	if (game.hours >= 24) {
		game.hours = 0;
		game.days += 1;
		game.daysToNextQuarter -= 1;
	}
	
	if (game.days > 30) {
		game.days = 1;
		game.months += 1;
		if ((game.months - 1) % 3 === 0) {
			newQuarter();
			
		}
	}
	
	if (game.months > 12) {
		game.months = 1;
		game.years += 1;
	}
	
}

function updateText() {
	//date
	document.getElementById("date").textContent = "Date: " + game.days.toString().padStart(2, "0") + "/" + game.months.toString().padStart(2, "0") + "/" + game.years.toString() + " " + game.hours.toString().padStart(2, "0") + "H";
	document.getElementById("quarter").textContent = changeToOrdinal(game.quarter) + " Quarter";
	document.getElementById("time-until-next-quarter").textContent = "Days until next quarter (Req Deadline): " + game.daysToNextQuarter.toString() + " Days";
	document.getElementById("grade").textContent = "You are currently in Grade " + player.grade.toString();
	
	//reqs
	document.querySelectorAll("#reqs-container > span > p")[0].textContent =  "Reqs: " + player.reqs.toFixed(2);
	document.querySelectorAll("#reqs-container > span > p")[1].textContent =  "Req Difficulty: " + game.reqDifficulty.toFixed(2);
	document.querySelectorAll("#reqs-container > span > p")[2].textContent =  "Req Experience: " + player.experience.toFixed(1);
	
	//quarter
	document.querySelectorAll("#quarter-container > span > p")[0].textContent =  "You are currently in the " + changeToOrdinal(game.quarter) + " Quarter";
	document.querySelectorAll("#quarter-container > span > p")[1].textContent =  "Current Quarter Grade: " + player.quarterGrade.toFixed(2) + "%";
	
	//statistics
	document.querySelectorAll("#statistics-container > span > p")[0].textContent = "Total Reqs Done: " + player.totalReqsDone.toFixed(2);
}

function tryNewReq() {
	let value = Math.random()
	if (value <= player.reqChance) {
		player.reqs += 1;
		game.quarterReqsAssigned += 1;
	}
}

function changeToOrdinal(number) {
	switch (number) {
		case 1:
			return "1st";
		case 2:
			return "2nd";
		case 3:
			return "3rd";
		default:
			return number.toString() + "th";
	}
}

function doReq() {
	if (player.reqs > 0) {
		player.reqs -= player.reqsFinishedPerCycle;
		player.quarterReqsFinished += player.reqsFinishedPerCycle;
		player.totalReqsDone += player.reqsFinishedPerCycle;
		player.experience += (player.baseExperienceGain * player.reqsFinishedPerCycle);
	}
	updateText();
}

function newQuarter() {
	game.quarter += 1;
	game.daysToNextQuarter = 90;
	player.reqs = 0;
	player.quarterReqsFinished = 0;
	game.quarterReqsAssigned = 0;
	if (game.quarter > 4) {
		game.quarter = 1;
	}
}

function computeValues() {
	player.quarterGrade = (player.quarterReqsFinished / game.quarterReqsAssigned) * 100;
	player.reqsFinishedPerCycle = (player.reqFinishRate / game.reqDifficulty);
	game.reqDifficulty = 1 + (game.quarter * 0.25 - 0.25);
}
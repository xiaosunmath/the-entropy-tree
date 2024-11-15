let modInfo = {
	name: "定义 熵 tree",
	id: "the entropy tree",
	author: "xiaosunmath",
	pointsName: "熵",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.1",
	name: "i'm red-temperature",
}

let changelog = `
	<h1>不，你应该自己写这个<h1><br>
	<h3>Changelog:</h3><br>
	<h3>v1.1</h3><br>
		-Added a buyable.<br>
		-Added a upgrade.<br>
	<h3>v1.0</h3><br>
	    -Added a layer.<br>
	<h3>v0.1</h3><br>
	    -Added three upgrades.<br>
	<h3>v0.0</h3><br>
		- Added a layer.<br>
		- Added three upgrades.<br>`

let winText = `如果你在非加载界面看到了这条消息，那么你就是个挂壁！`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("p",11)) gain = gain.mul(upgradeEffect("p",11))
	if(hasUpgrade("p",13)) gain = gain.mul(upgradeEffect("p",13))
	if(hasUpgrade("p",21)) gain = gain.mul(2)
	
	if(hasUpgrade("c",11)) gain = gain.mul(upgradeEffect("c",11))
	//gain = gain.mul(player.c.points.add(1).pow(2))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1.79e3086365"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
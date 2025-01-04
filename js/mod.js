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
	num: "0.3.2",
	name: "我不会，长大后再学习",
}

let changelog = `
	<h1>不，你应该自己写这个<h1><br>
	<h1>如果发现更新后卡死了，说明作者又加了软上限以平衡<h1><br>
	<h3>Changelog:</h3><br>
	<h3>v0.3.2</h3><br>
		-添加2个升级<br>
		-添加一个机制<br>
	<h3>v0.3.1.4</h3><br>
		-添加4个升级<br>
		-无了，别想了<br>
	<h3>v0.3.1.3</h3><br>
		-添加一个升级<br>
		-添加一个新机制<br>
	<h3>v0.3.1.2</h3><br>
		-添加2个升级<br>
	<h3>v0.3.1.1</h3><br>
		-添加2个升级<br>
	<h3>v0.3.1</h3><br>
		-添加3个升级<br>
		-添加一个里程碑<br>
	<h3>v0.3</h3><br>
		-添加一个新层级<br>
		-添加一个升级<br>
	<h3>v0.2.4</h3><br>
		-添加5个升级<br>
		-创死了几个升级<br>
		-添加一个可购买<br>
		-删掉一个可购买<br>
	<h3>v0.2.3</h3><br>
		-添加6个升级<br>
		-添加1个挑战<br>
		-添加一个可购买<br>
		-endgame 1e700熵<br>
	<h3>v0.2.2</h3><br>
		-添加2个升级<br>
		-添加一个挑战<br>
		-添加2个可购买<br>
	<h3>v0.2.1</h3><br>
		-我懒的用英文了。(I don't want to use English.)<br>
		-添加4个升级。<br>
		-删除"sb"升级。<br>
		-添加1个挑战。<br>
	<h3>v0.2</h3><br>
		-Added a layer.<br>
		-Added a upgrade.<br>
		-Added a sb upgrade.<br>
	<h3>v0.1.3</h3><br>
		-Added a upgrade.<br>
		-Added a milestone.<br>
	<h3>v0.1.2</h3><br>
		-Added a buyable.<br>
		-Added a upgrade.<br>
	<h3>v0.1.1</h3><br>
		-Added a buyable.<br>
		-Added two upgrades.<br>
		-Added two milestones.<br>
	<h3>v0.1</h3><br>
	    -Added a layer.<br>
	<h3>v0.0.1</h3><br>
	    -Added three upgrades.<br>
	<h3>v0.0</h3><br>
		- Added a layer.<br>
		- Added three upgrades.<br>`

let winText = `恭喜！你>暂时<通关了这个史`

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
	if(hasUpgrade("p",21)) gain = gain.mul(3)
	if(hasUpgrade("c",11)) gain = gain.mul(upgradeEffect("c",11))
	gain = gain.mul(buyableEffect("c",12))
	if(hasUpgrade("u",11)) gain = gain.mul(10)
	//if(hasUpgrade("u",23)) gain = gain.mul(1e20)

	if(hasUpgrade("u",11)) gain = gain.pow(1.02)
	if(hasUpgrade("u",12)) gain = gain.pow(1.1)
	if(hasUpgrade("u",21) && !hasUpgrade("e",22)) gain = gain.pow(upgradeEffect("u",21))
	if(inChallenge("u",11)) gain = gain.pow(0.5)
	if(hasChallenge("u",11)) gain = gain.pow(1.4514)
	if(inChallenge("u",13)) gain = gain.pow(0.25)
	gain = gain.pow(player.u.temeffect)
	gain = gain.mul(player.e.ele.add(1).pow(50))
	gain = gain.mul(player.e.lele.add(1).pow(25))
	gain = gain.mul(player.e.llele.add(1).pow(17))
	gain = gain.mul(player.e.lllele.add(1).pow(10))
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
	return player.points.gte(new Decimal("1e7500"))
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
addLayer("p", {
    name: "粒子", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "p", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "粒子", // Name of prestige currency
    baseResource: "熵", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade("p",12)) mult = mult.mul(upgradeEffect("p",12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        
        return exp
    },
    upgrades: {
        11: {
            title:"倍增熵",
            description(){return "基于粒子增加熵获得<br>当前：x" + format(upgradeEffect("p",11))},
            cost: new Decimal(1),
            effect(){return player.p.points.add(1).root(2)},
        },
        12: {
            title:"倍增粒子",
            description(){return "基于熵增加粒子获得<br>当前：x" + format(upgradeEffect("p",12))},
            cost: new Decimal(5),
            effect(){return player.points.add(5).log(5)},
        },
        13: {
            title:"自加倍",
            description(){return "基于熵增加熵获得<br>当前：x" + format(upgradeEffect("p",13))},
            cost: new Decimal(10),
            effect(){return player.points.add(2).log(2)},
        },
        
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: 进行粒子重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})

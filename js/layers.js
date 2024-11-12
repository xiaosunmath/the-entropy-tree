
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
        if(hasUpgrade("p",23)) exp = exp.add(0.2)
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
        21: {
            title:"复制",
            description(){return "基于粒子增加粒子乘数<br>当前：x" + format(upgradeEffect("p",21))},
            cost: new Decimal(30),
            effect(){return player.p.points.add(10).log(10)},
        },
        22: {
            title:"简单一点",
            description(){return "熵获取×2<br>"},
            cost: new Decimal(100),
        },
        23: {
            title:"指数",
            description(){return "粒子获取指数+0.2<br>"},
            cost: new Decimal(200),
        },
    },
    
    row: 0, // Row the layer is in on the tree (0 is the first row)
    
    hotkeys: [
        {key: "p", description: "P: 进行粒子重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
addLayer("c", {
    name: "天体", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "c", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(1000), // Can be a function that takes requirement increases into account
    resource: "天体", // Name of prestige currency
    baseResource: "粒子", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("c",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    upgrades: {
        11: {
            title:"我不会起名字了",
            description(){return "基于天体增加熵乘数<br>当前：x" + format(upgradeEffect("c",11))},
            cost: new Decimal(0),
            effect(){return player.c.points.add(1).pow(1.2)},
        },
        12: {
            title:"我不会起名字了可购买",
            description(){return "增加可购买效果/骷髅<br>"},
            cost: new Decimal(10000),
        },
    },
    milestones: {
        /*0: {
            requirementDescription: "5天体",
            effectDescription: "重置时保留粒子升级",
            done() { return player.c.points.gte(5) }
        },*/
        0: {
            requirementDescription: "10天体(你作者大跌红温了)压根没用",
            effectDescription: "每秒获得100%的粒子",
            done() { return player.c.points.gte(10) }
        },
        
    },
    buyables: {
        11: {
            title: "星系",
            cost(x) { return new Decimal(10).mul(x.pow(3)) },
            display() { return "增加天体获得<br>当前：x" + format(buyableEffect("c",11)) + "<br>价格：" + format(this.cost())},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                if(hasUpgrade("c",12)) return getBuyableAmount("c",11).add(1).pow(1.2)
                return getBuyableAmount("c",11).add(1)
            },
        },
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    /*doReset(resettingLayer){
        if(layers[resettingLayer].row < layers[this.layer].row){
            let kept = ["unlocked","auto"]
            if(resettingLayer == "c"){
                if(hasMilestone("c",0)) kept.push("upgrades")
            }
            layerDataReset(this.layer,kept)
        }
    },*/
    hotkeys: [
        {key: "c", description: "C: 进行天体重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(hasUpgrade("p",23)) return true
        else return false
    }
})
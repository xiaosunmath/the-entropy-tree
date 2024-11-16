
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
            description(){
                disp = "基于粒子增加熵获得<br>当前：x" + format(upgradeEffect("p",11))
                if(upgradeEffect("p",11) > 1e8) disp += "<br>(受软上限限制)"
                return disp
            },
            cost: new Decimal(1),
            effect(){
                effe = player.p.points.add(1).root(2)
                if(effe > 1e8) effe = effe.div(1e8).root(5).mul(1e8)
                return effe
            },
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
            cost: new Decimal(50),
            effect(){return player.p.points.add(10).log(10)},
        },
        22: {
            title:"IQ=-1",
            description(){return "熵获取×2<br>"},
            cost: new Decimal(100),
        },
        23: {
            title:"IQ=-250",
            description(){return "粒子获取指数+0.2<br>"},
            cost: new Decimal(200),
        },
    },
    passiveGeneration(){
        if(hasMilestone("c",0)) return 1
        else return 0
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
    update(diff){
        if(hasMilestone("c",1)) layers.c.buyables[11].buyMax()
    },
    upgrades: {
        11: {
            title:"我不会起名字了",
            description(){
                disp = "基于天体增加熵乘数<br>当前：x" + format(upgradeEffect("c",11))
                if(upgradeEffect("c",11) > 1e15) disp += "<br>(受软上限限制)"
                return disp
            },
            cost: new Decimal(0),
            effect(){
                effe = player.c.points.add(1).pow(1.2)
                if(hasUpgrade("c",13)) effe = effe.pow(2)
                if(eff > 1e15) effe = effe.div(1e15).root(5).mul(1e15)
                return effe
            },
        },
        12: {
            title:"我不会起名字了可购买",
            description(){return "增加星系效果/骷髅<br>"},
            cost: new Decimal(10000),
        },
        13: {
            title:"13",
            description(){return "增加我不会起名字了效果/骷髅<br>"},
            cost: new Decimal(1e17),
        },
    },
    milestones: {
        0: {
            requirementDescription: "100000天体",
            effectDescription: "每秒获得100%的粒子和天体",
            done() { return player.c.points.gte(100000) }
        },
        1: {
            requirementDescription: "1e12天体",
            effectDescription: "自动购买最大星系并且购买星系不消耗天体",
            done() { return player.c.points.gte(1e12) }
        },
    },
    buyables: {
        11: {
            title: "星系",
            cost(x) { return new Decimal(10).mul(x.add(1).pow(3)) },
            display() { return "增加天体获得<br>当前：x" + format(buyableEffect("c",11)) +
                 "<br>价格：" + format(this.cost()) + "<br>数量：" + getBuyableAmount("c",11)},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if (!this.canAfford()) return;
                let tempBuy = player.c.points.max(1).div(10).root(3)
                let target = tempBuy.plus(1).floor();
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
            },
            effect(){
                if(hasUpgrade("c",12)) return getBuyableAmount("c",11).add(1).pow(1.2)
                return getBuyableAmount("c",11).add(1)
            },
        },
        12: {
            title: "生命",
            cost(x) { return new Decimal(1e15).mul(x.add(1).pow(4)) },
            display() { return "增加熵获得<br>当前：x" + format(buyableEffect("c",12)) +
                 "<br>价格：" + format(this.cost()) + "<br>数量：" + getBuyableAmount("c",12)},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if (!this.canAfford()) return;
                let tempBuy = player.c.points.max(1).div(1e15).root(4)
                let target = tempBuy.plus(1).floor();
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
            },
            effect(){
                //if(hasUpgrade("c",12)) return getBuyableAmount("c",11).add(1).pow(1.2)
                return getBuyableAmount("c",12).add(1).pow(5)
            },
        },
    },
    row: 0, 
    passiveGeneration(){
        if(hasMilestone("c",0)) return 1
        else return 0
    },
    hotkeys: [
        {key: "c", description: "C: 进行天体重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(hasUpgrade("p",23)) return true
        else return false
    }
})
addLayer("p", {
    infoboxes:{
        introBox:{
            title:"一个介绍",
            body(){
                return "哦，我的上帝啊<br>这是我的第一个作品，同时也会成为我的主线<br>如果在某些地方平衡和屎一样，请联系作者QQ3988009796<br>如果做的大粪，不要骂行吗qwq"
            }
        },
    },
    name: "粒子",
    symbol: "p",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FFFF",
    requires: new Decimal(10),
    resource: "粒子",
    baseResource: "熵",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("p",12)) mult = mult.mul(upgradeEffect("p",12))
        if(hasUpgrade("u",11)) mult = mult.mul(10)
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        if(hasUpgrade("p",23)) exp = exp.add(0.2)
        if(hasUpgrade("u",13)) exp = exp.add(0.1)
        if(hasUpgrade("u",15)) exp = exp.add(0.2)
        if(inChallenge("u",21)) exp = exp.div(10)
        return exp
    },
    upgrades: {
        11: {
            title:"描述描述描述",
            description(){
                let disp = "基于粒子增加熵获得<br>当前：x" + format(upgradeEffect("p",11))
                if(upgradeEffect("p",11) > 1e8) disp += "<br>(软上限)"
                if(upgradeEffect("p",11) > 1e35) disp += "<br>(软上限)"
                return disp
            },
            cost: new Decimal(1),
            effect(){
                let effe = player.p.points.add(1).root(2)
                if(effe > 1e8) effe = effe.div(1e8).root(5).mul(1e8)
                if(effe > 1e35) effe = effe.div(1e35).log(2).mul(1e35)
                return effe
            },
        },
        12: {
            title:"炸弹炸弹炸弹",
            description(){return "你的宇宙被核弹入侵了，基于熵增加粒子获得<br>当前：x" + format(upgradeEffect("p",12))},
            cost: new Decimal(5),
            effect(){return player.points.add(5).log(5)},
        },
        13: {
            title:"核弹你的宇宙",
            description(){return "核弹正在暴走，把宇宙打成了大便，基于熵增加熵获得<br>当前：x" + format(upgradeEffect("p",13))},
            cost: new Decimal(10),
            effect(){return player.points.add(2).log(2)},
        },
        21: {
            title:"反物质反物质反物质反物质反物质",
            description(){return "反物质开始爆炸，基于粒子增加粒子乘数<br>当前：x" + format(upgradeEffect("p",21))},
            cost: new Decimal(50),
            effect(){return player.p.points.add(10).log(10)},
        },
        22: {
            title:"核弹使用了进化，变成了氢弹",
            description(){return "熵获取×3<br>"},
            cost: new Decimal(100),
        },
        23: {
            title:"反物质打破了无限，超越了e1000",
            description(){return "粒子获取指数+0.2<br>"},
            cost: new Decimal(200),
        },
    },
    doReset(resettingLayer){
        if(layers[resettingLayer].row > layers[this.layer].row){
            let kept = ["unlocked","auto"]
            if(resettingLayer == "e" && hasMilestone("e",0)){
                kept.push("upgrades")
            }
            if(resettingLayer == "u" && hasMilestone("e",0)){
                kept.push("upgrades")
            }
            layerDataReset(this.layer,kept)
        }
    },
    passiveGeneration(){
        if(hasMilestone("c",0)) return 1
        else return 0
    },
    row: 0,
    
    hotkeys: [
        {key: "p", description: "P: 进行粒子重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
})
addLayer("c", {
    infoboxes:{
        introBox:{
            title:"请输入文本",
            body(){
                return "请输入文本请输入文本请输入文本请输入文本请输入文本请输入文本<br>"
            },
        },
    },
    name: "天体",
    symbol: "c",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        mass: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(1000),
    resource: "天体",
    baseResource: "粒子",
    baseAmount() {return player.p.points}, 
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("c",11))
        if(hasUpgrade("u",11)) mult = mult.mul(10)
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        if(hasUpgrade("u",13)) exp = exp.add(0.1)
        if(hasUpgrade("u",15)) exp = exp.add(0.2)
        if(inChallenge("u",12)) exp = exp.div(5)
        return exp
    },
    massgain(){
        let gain = new Decimal(0)
        if(hasUpgrade("e",14)) gain = gain.add(1)
        return gain
    },
    update(diff){
        if(hasMilestone("c",1)) layers.c.buyables[11].buyMax()
        if(hasMilestone("c",2)) layers.c.buyables[12].buyMax()
        player.c.mass=player.c.mass.add(tmp.c.massgain.mul(diff))
    },
    tabFormat: {
        "主界面": {
            content: [ ["infobox","introBox"],"main-display","prestige-button","milestones","buyables","upgrades"],},
        "恒星质量": {
            content: [ ["infobox","introBox"],
               "main-display","prestige-button",["display-text",
                function() {return '你有' + format(player.c.mass) + '恒星质量,将天体层级的两个购买项效果在软上限后变为原来的' + format(player.c.mass.root(2).div(10).add(1)) + '次方'},
               {"color": "#FFFFFF", "font-size": "20px", "font-family": "Comic Sans MS"}]],
            unlocked(){return hasUpgrade('e',14)}
        },
    },
    upgrades: {
        11: {
            title:"宇宙宇宙宇宙",
            description(){
                let disp = "反物质开始复制器，引力开启了挂壁模式，所以有天体。基于天体增加熵乘数<br>当前：x" + format(upgradeEffect("c",11))
                if(upgradeEffect("c",11) > 1e15) disp += "<br>(软上限)"
                if(upgradeEffect("c",11) > 1e130) disp += "<br>(软上限)"
                return disp
            },
            cost: new Decimal(0),
            effect(){
                let effe = player.c.points.add(1).pow(1.2)
                if(hasUpgrade("c",13)) effe = effe.pow(2)
                if(effe > 1e15) effe = effe.div(1e15).root(5).mul(1e15)
                if(effe > 1e130) effe = effe.div(1e130).log(2).mul(1e130)
                return effe
            },
        },
        12: {
            title:"反物质开始永恒，超过了e100000",
            description(){return "增加第一个可购买效果/骷髅<br>"},
            cost: new Decimal(10000),
        },
        13: {
            title:"氢弹进行了进化，变成了5阶核弹",
            description(){return "增加我不会起名字了效果/骷髅<br>"},
            cost: new Decimal(1e17),
        },
        14: {
            title:"这是一个膨胀，因为反物质在光暗树膨胀期",
            description(){return "第一个可购买的数量被第二个可购买乘亿下<br>"},
            cost: new Decimal(1e27),
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
        2: {
            requirementDescription: "1e36天体",
            effectDescription: "自动购买最大生命并且购买生命不消耗天体<br>哦不，核弹已经进化到114514阶了，并且反物质也进入了毁灭现实",
            done() { return player.c.points.gte(1e36) }
        },
    },
    buyables: {
        11: {
            title: "星系",
            cost(x) { return new Decimal(10).mul(x.add(1).pow(3)) },
            display() { 
                let disp = "增加天体获得<br>当前：x" + format(buyableEffect("c",11))
                if(buyableEffect("c",11) > 1e30) disp = disp + "（受nb的软上限限制）"
                disp = disp + "<br>价格：" + format(this.cost()) + "<br>数量：" + format(getBuyableAmount("c",11))
                if(hasUpgrade("c",14)) disp = disp + "x" + format(getBuyableAmount("c",12))
                return disp
            },
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
                let effe = getBuyableAmount("c",11)
                if(hasUpgrade("c",14)) effe = effe.mul(getBuyableAmount("c",12))
                effe = effe.add(1)
                if(hasUpgrade("c",12)) effe = effe.pow(1.2)
                if(effe > 1e30) effe = effe.div(1e30).log(2).pow(5).mul(1e30)
                effe = effe.pow(player.c.mass.root(2).div(10).add(1))
                return effe
            },
        },
        12: {
            title: "生命",
            cost(x) { return new Decimal(1e15).mul(x.add(1).pow(4)) },
            display() { 
                let disp = "增加熵获得<br>当前：x" + format(buyableEffect("c",12))
                if(buyableEffect("c",12) > 1e50) disp = disp + "（受nb的软上限限制）"
                disp = disp + "<br>价格：" + format(this.cost()) + "<br>数量：" + format(getBuyableAmount("c",12))
                return disp
            },
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
                effe = getBuyableAmount("c",12).add(1).pow(5)
                if(effe > 1e50) effe = effe.div(1e50).log(2).pow(5).mul(1e50)
                effe = effe.pow(player.c.mass.root(2).div(10).add(1))
                return effe
            },
        },
    },
    doReset(resettingLayer){
        if(layers[resettingLayer].row > layers[this.layer].row){
            let kept = ["unlocked","auto"]
            if(resettingLayer == "e" && hasMilestone("e",0)){
                kept.push("upgrades")
                kept.push("milestones")
            }
            if(resettingLayer == "u" && hasMilestone("e",0)){
                kept.push("upgrades")
                kept.push("milestones")
            }
            if(resettingLayer == "e" && hasUpgrade("e",21)){
                kept.push("mass")
            }
            if(resettingLayer == "u" && hasUpgrade("e",21)){
                kept.push("mass")
            }
            layerDataReset(this.layer,kept)
        }
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
        if(player.u.points > 0) return true
        else return false
    }
})
addLayer("u", {
    infoboxes:{
        introBox:{
            title:"宇宙",
            body(){
                return "哦，我的上帝啊<br>宇宙不小心热寂了"
            }
        },
    },
    name: "被核弹炸死的宇宙",
    symbol: "u",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        uni: new Decimal(0)
    }},
    color: "#999999",
    requires: new Decimal(1e120),
    resource: "被核弹炸死的宇宙",
    baseResource: "熵",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.004,
    unigain(){
        let gain = new Decimal(0)
        if(hasChallenge("u",12)) gain = gain.add(1)
        if(hasUpgrade("u",24)) gain = gain.mul(upgradeEffect("u",24))
        gain = gain.mul(buyableEffect("u",11))
        gain = gain.mul(buyableEffect("u",12))
        gain = gain.mul(buyableEffect("u",13))
        if(hasUpgrade("u",34)) gain = gain.mul(upgradeEffect("u",34))
        if(hasUpgrade("e",13)) mult = mult.mul(upgradeEffect("e",13))
        return gain
    },
    update(diff){
        player.u.uni=player.u.uni.add(tmp.u.unigain.mul(diff))
    },
    gainMult() {
        mult = new Decimal(1)
        if(hasUpgrade("e",13)) mult = mult.mul(upgradeEffect("e",13))
        return mult
    },
    gainExp() {
        exp = new Decimal(1)
        if(hasChallenge("u",21)) exp = exp.add(challengeEffect("u",21))
        if(hasUpgrade("u",31)) exp = exp.add(upgradeEffect("u",31))
        if(hasUpgrade("u",32)) exp = exp.add(upgradeEffect("u",32))
        if(hasUpgrade("u",33)) exp = exp.add(upgradeEffect("u",33))
        return exp
    },
    tabFormat: {
        "面": {
            content: [ ["infobox","introBox"],"main-display","prestige-button","upgrades"],},
        "令人嗝屁的界面": {
            content: [ ["infobox","introBox"],"main-display","challenges"],
            unlocked(){return hasUpgrade('u',14)}
        },
        "傻逼之力量": {
            content: [["display-text",
                function() {return '你有' + format(player.u.uni) + '傻逼宇宙力量'},
               {"color": "#FFFFFF", "font-size": "20px", "font-family": "Comic Sans MS"}],"buyables"],
            unlocked(){return hasChallenge("u",12)}
        },
    },
    
    
    upgrades: {
        11: {
            title:"描述描述你的宇宙被毁灭了",
            description(){return "你的宇宙被10^1145141919810个核弹炸死了，并且被10^9*10^15反物质炸的死的不能再死了，而且被K9e15攻击的恐怖鳗鱼打成了傻逼。所以宇宙要进行复仇，使你的熵，粒子，天体数量x10,并且使你的熵^1.02(下一个升级在3被核弹炸死的宇宙)<br>"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 0) return true
                else return false
            }
        },
        12: {
            title:"你的宇宙觉得自己屌爆了",
            description(){return "宇宙被作者制裁了，所以只能让你的熵^1.1(下一个升级在10被核弹炸死的宇宙)<br>"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 2) return true
                else return false
            }
        },
        13: {
            title:"QoL:世界遗忘我",
            description(){return "你的宇宙觉得还是太慢了，于是粒子和天体的指数+0.1(下一个20)<br>"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 9) return true
                else return false
            }
        },
        14: {
            title:"宇宙决定气炸玩家",
            description(){return "解锁挑战(下一个30)<br>"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 19) return true
                else return false
            }
        },
        15: {
            title:"宇宙认为你太nb了",
            description(){return "使粒子和天体的指数+0.2(50)<br>"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 29) return true
                else return false
            }
        },
        21: {
            title:"被核弹炸死的宇宙太fvv了",
            description(){return "使你的被核弹炸死的宇宙将熵提高<br>当前效果：^" + format(upgradeEffect("u",21))},
            cost: new Decimal(0),
            effect(){
                let effe = player.u.points.log(10).div(10).add(1)
                if(effe.sub(2) > 0) effe = effe.sub(1).log(10).add(2)
                if(effe.sub(3) > 0) effe = effe.sub(2).root(2).add(2)
                return effe
            },
            unlocked(){
                if(player.u.points > 49) return true
                else return false
            },
        },
        22: {
            title:"作者使用多元宇宙进行了加强",
            description(){return "解锁第二个挑战"},
            cost: new Decimal(0),
            unlocked(){
                if(player.u.points > 49) return true
                else return false
            },
        },
        23: {
            title:"宇宙的智商跌破-250^2",
            description(){return "让宇宙IQ倍减价格基数-1"},
            cost: new Decimal(2e7),currencyDisplayName:"傻逼宇宙力量",currencyInternalName:"uni",currencyLayer:"u",
            unlocked(){
                if(hasChallenge("u",12)) return true
                else return false
            },
        },
        24: {
            title:"傻逼宇宙协同",
            description(){return "基于你的被核弹炸死的宇宙增加傻逼宇宙力量获取<br>当前:x" + format(upgradeEffect("u",24))},
            cost: new Decimal(5e16),currencyDisplayName:"傻逼宇宙力量",currencyInternalName:"uni",currencyLayer:"u",
            effect(){
                return player.u.points.add(1).log(2).pow(2)
            },
            unlocked(){
                if(hasUpgrade("u",23)) return true
                else return false
            },
        },
        25: {
            title:"作者这个傻逼终于按QoL了，不得给多亿点",
            description(){return "每秒获得10000%的被核弹炸死的宇宙"},
            cost: new Decimal(1e27),currencyDisplayName:"傻逼宇宙力量",currencyInternalName:"uni",currencyLayer:"u",
            unlocked(){
                if(hasUpgrade("u",24)) return true
                else return false
            },
        },
        26: {
            title:"r",
            description(){return "解锁挑战3"},
            cost: new Decimal(100000),
            unlocked(){
                if(hasUpgrade("u",25)) return true
                else return false
            },
        },
        31: {
            title:"粒子宇宙",
            description(){return "基于粒子数量增加被核弹炸死的宇宙的指数<br>当前：+" + format(upgradeEffect("u",31))},
            cost: new Decimal(1e8),
            effect(){
                return player.p.points.add(1).log(10).root(2).div(30)
            },
            unlocked(){
                if(hasChallenge("u",21)) return true
                else return false
            },
        },
        32: {
            title:"天体宇宙",
            description(){return "基于天体数量增加被核弹炸死的宇宙的指数<br>当前：+" + format(upgradeEffect("u",32))},
            cost: new Decimal(1e12),
            effect(){
                return player.c.points.add(1).log(10).root(2).div(30)
            },
            unlocked(){
                if(hasUpgrade("u",31)) return true
                else return false
            },
        },
        33: {
            title:"宇宙自增",
            description(){return "基于被核弹炸死的宇宙数量增加被核弹炸死的宇宙的指数<br>当前：+" + format(upgradeEffect("u",33))},
            cost: new Decimal(1e15),
            effect(){
                return player.u.points.add(1).log(10).root(3).div(3)
            },
            unlocked(){
                if(hasUpgrade("u",32)) return true
                else return false
            },
        },
        34: {
            title:"傻逼宇宙力量倍增",
            description(){return "基于被核弹炸死的宇宙数量乘以傻逼宇宙力量<br>当前：×" + format(upgradeEffect("u",34))},
            cost: new Decimal(1e18),
            effect(){
                return player.u.points.root(3)
            },
            unlocked(){
                if(hasUpgrade("u",33)) return true
                else return false
            },
        },
        35: {
            title:"傻逼之力量",
            description(){return "解锁一个新的可购买"},
            cost: new Decimal(1e23),
            unlocked(){
                if(hasUpgrade("u",34)) return true
                else return false
            },
        },
        91: {
            title:"描述描述描述描述描述描述描述描述",
            description(){return "为什么我不用里程碑呢，当然是因为占空间小啊<br>"},
            cost: new Decimal("(e^114514) 1"),
            unlocked(){
                if(player.u.points > 0) return true
                else return false
            }
        },
    },
    buyables: {
        11: {
            title: "宇宙IQ倍减",
            cost(x) { 
                let bas = new Decimal(10)
                let scal1 = new Decimal(2)
                if(hasUpgrade("u",23)) bas = bas.sub(1)
                if(getBuyableAmount("u",11).sub(300) > 0) x = x.sub(300).pow(scal1).add(300)
                return new Decimal(10).mul(bas.pow(x.pow(1.1)))
            },
            display() { 
                let disp = "增加傻逼宇宙力量获得<br>当前：x" + format(buyableEffect("u",11))
                //if(buyableEffect("c",11) > 1e30) disp = disp + "（受nb的软上限限制）"
                disp = disp + "<br>价格：" + format(this.cost())
                if(getBuyableAmount("u",11).sub(300) > 0) disp = disp + "（折算）"
                disp = disp + "<br>数量：" + format(getBuyableAmount("u",11))
                //if(hasUpgrade("u",14)) disp = disp + "x" + format(getBuyableAmount("c",12))
                return disp
            },
            canAfford() { return player[this.layer].uni.gte(this.cost()) },
            buy() {
                player[this.layer].uni = player[this.layer].uni.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            /*buyMax() {
                if (!this.canAfford()) return;
                let tempBuy = player.u.uni.max(1).div(10).log(10).root(1.1)
                let target = tempBuy.plus(1).floor();
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
            },*/
            effect(){
                let baseeff = new Decimal(15)
                let effe = baseeff.pow(getBuyableAmount("u",11))
                return effe
            },
        },
        12: {
            title: "宇宙IQ自我倍减",
            cost(x) { 
                let bas = new Decimal(10)
                let scal1 = new Decimal(2)
                if(getBuyableAmount("u",12).sub(300) > 0) x = x.sub(300).pow(scal1).add(300)
                return new Decimal(1e33).mul(bas.pow(x.pow(1.05)))
            },
            display() { 
                let disp = "基于傻逼宇宙力量增加傻逼宇宙力量获得<br>当前：x" + format(buyableEffect("u",12))
                //if(buyableEffect("c",11) > 1e30) disp = disp + "（受nb的软上限限制）"
                disp = disp + "<br>价格：" + format(this.cost())
                if(getBuyableAmount("u",12).sub(300) > 0) disp = disp + "（折算）"
                disp = disp + "<br>数量：" + format(getBuyableAmount("u",12))
                //if(hasUpgrade("u",14)) disp = disp + "x" + format(getBuyableAmount("c",12))
                return disp
            },
            canAfford() { return player[this.layer].uni.gte(this.cost()) },
            buy() {
                player[this.layer].uni = player[this.layer].uni.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            /*buyMax() {
                if (!this.canAfford()) return;
                let tempBuy = player.u.uni.max(1).div(10).log(10).root(1.05)
                let target = tempBuy.plus(1).floor();
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
            },*/
            effect(){
                let baseeff = new Decimal(player.u.uni.log(10).root(3))
                let effe = baseeff.pow(getBuyableAmount("u",12))
                return effe
            },
        },
        13: {
            title: "宇宙IQ炸死倍减",
            cost(x) { 
                let bas = new Decimal(100)
                //let scal1 = new Decimal(2)
                //if(getBuyableAmount("u",12).sub(300) > 0) x = x.sub(300).pow(scal1).add(300)
                return new Decimal("1e600").mul(bas.pow(x.pow(1.1)))
            },
            display() { 
                let disp = "基于被核弹炸死的宇宙增加傻逼宇宙力量获得<br>当前：x" + format(buyableEffect("u",13))
                //if(buyableEffect("c",11) > 1e30) disp = disp + "（受nb的软上限限制）"
                disp = disp + "<br>价格：" + format(this.cost())
                //if(getBuyableAmount("u",12).sub(300) > 0) disp = disp + "（折算）"
                disp = disp + "<br>数量：" + format(getBuyableAmount("u",13))
                //if(hasUpgrade("u",14)) disp = disp + "x" + format(getBuyableAmount("c",12))
                return disp
            },
            canAfford() { return player[this.layer].uni.gte(this.cost()) },
            buy() {
                player[this.layer].uni = player[this.layer].uni.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            /*buyMax() {
                if (!this.canAfford()) return;
                let tempBuy = player.u.uni.max(1).div(10).log(10).root(1.05)
                let target = tempBuy.plus(1).floor();
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
            },*/
            effect(){
                let baseeff = new Decimal(player.u.points.log(10))
                let effe = baseeff.pow(getBuyableAmount("u",13))
                return effe
            },
            unlocked(){
                if(hasUpgrade("u",35)) return true
                else return false
            }
        },
    },
    
    challenges: {
        11: {
            name: "宇宙太膨胀了，作者压制一下",
            challengeDescription: "宇宙：什么智障玩意，给你一个^0.5",
            goalDescription: "目标：e1145141919810/e1145141919794熵",
            canComplete: function() {return player.points.gte(1e16)},
            rewardDescription: "作者炸了，使你的熵获取^1.4514"
        },
        12: {
            name: "作者使用了更nb的力量压制宇宙",
            challengeDescription: "天体指数/5",
            goalDescription: "目标：1e48熵",
            canComplete: function() {return player.points.gte(1e48)},
            rewardDescription: "宇宙表示已老实求放过，解锁傻逼宇宙力量",
            unlocked(){
                if(hasUpgrade("u",22)) return true
                else return false
            },
        },
        21: {
            name: "只是一个挑战",
            challengeDescription: "熵^0.25,粒子指数/10",
            goalDescription: "目标：9999999999999999999999999999999999熵（不信可以自己数）",
            canComplete: function() {return player.points.gte(1e35)},
            rewardDescription() {
                return "傻逼宇宙力量好像没用，让它加成一下被核弹炸死的宇宙的指数<br>当前：+" + format(challengeEffect("u",21))
            },
            rewardEffect(){
                return player.u.uni.log(10).root(2).div(10)
            },
            unlocked(){
                if(hasUpgrade("u",26)) return true
                else return false
            },
        },
    },
    passiveGeneration(){
        if(hasUpgrade("u",25)) return 100
        else return 0
    },
    row: 1,
    hotkeys: [
        {key: "u", description: "U: 进行宇宙被核弹炸死重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){
        if(player.u.points > 0) return true
        if(hasUpgrade("c",14)) return true
        else return false
    }
})
addLayer("e", {
    name: "元素合成器",
    symbol: "e",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        ele: new Decimal(0),
    }},
    color: "#DD55DD",
    requires: new Decimal("1e525"),
    resource: "元素合成器",
    baseResource: "天体",
    baseAmount() {return player.c.points},
    type: "static",
    exponent: 1,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        exp = new Decimal(0.02)
        if(player.e.points.sub(5) > 0) exp = exp.sub(0.005)
        if(player.e.points.sub(32) > 0) exp = exp.sub(0.003)
        return exp
    },
    elegain(){
        let gain = player.e.points.pow(3).div(100)
        let bas = new Decimal(2)
        if(hasUpgrade("e",15)) gain = bas.pow(player.e.points.div(2))
        if(hasUpgrade("e",11)) gain = gain.mul(upgradeEffect("e",11))
        if(hasUpgrade("e",12)) gain = gain.mul(upgradeEffect("e",12))
        return gain
    },
    update(diff){
        player.e.ele=player.e.ele.add(tmp.e.elegain.mul(diff))
    },
    tabFormat: {
        "主界面": {
            content: [ ["infobox","introBox"],"main-display","prestige-button",
            ["display-text",function() {return '你有' + format(player.e.ele) + '超重元素,增益熵获取×' + format(player.e.ele.add(1).pow(50)) + '（在指数之后）'},
               {"color": "#FFFFFF", "font-size": "20px", "font-family": "Comic Sans MS"}],
               "upgrades","milestones"],
        },
    },
    upgrades: {
        11: {
            title:"效率",
            description(){return "基于你的被核弹炸死的宇宙倍增超重元素获取<br>当前:x" + format(upgradeEffect("e",11))},
            cost: new Decimal(30),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            effect(){
                return player.u.points.add(1).log(10).div(10)
            },
            unlocked(){
                if(player.e.points.sub(1) >= 0) return true
                else return false
            },
        },
        12: {
            title:"继续加速",
            description(){return "基于傻逼宇宙力量倍增超重元素获得<br>当前：x" + format(upgradeEffect("e",12))},
            cost: new Decimal(1000),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            effect(){
                return player.u.uni.add(1).log(10).div(100)
            },
            unlocked(){
                if(hasUpgrade("e",11)) return true
                else return false
            },
        },
        13: {
            title:"反增益",
            description(){return "基于超重元素倍增被核弹炸死的宇宙和傻逼宇宙力量获得<br>当前：x" + format(upgradeEffect("e",13))},
            cost: new Decimal(15000),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            effect(){
                return player.e.ele.add(1)
            },
            unlocked(){
                if(hasUpgrade("e",12)) return true
                else return false
            },
        },
        14: {
            title:"质量",
            description(){return "在天体层级解锁恒星质量"},
            cost: new Decimal(100000),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            unlocked(){
                if(hasUpgrade("e",13)) return true
                else return false
            },
        },
        15: {
            title:"公式加强",
            description(){return "改变超重元素的获得公式"},
            cost: new Decimal(3000000),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            unlocked(){
                if(hasUpgrade("e",13)) return true
                else return false
            },
        },
        21: {
            title:"恒星质量很强，让我们保留它",
            description(){return "在第二行重置时保留恒星质量"},
            cost: new Decimal(150000000),currencyDisplayName:"超重元素",currencyInternalName:"ele",currencyLayer:"e",
            unlocked(){
                if(hasUpgrade("e",13)) return true
                else return false
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "10元素合成器",
            effectDescription: "在第二行重置时保留第一行的升级和里程碑",
            done() { return player.e.points.gte(10) }
        },
    },
    
    /*passiveGeneration(){
        if(hasMilestone("c",0)) return 1
        else return 0
    },*/
    row: 1,
    
    hotkeys: [
        {key: "e", description: "E: 进行天体合成重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("u",35)}
})
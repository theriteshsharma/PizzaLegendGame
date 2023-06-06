class PlayerState {
  constructor() {
    this.pizzas = {
      p1: {
        pizzaId: "s001",
        hp: 30,
        maxHp: 50,
        xp: 95,
        maxXp: 100,
        level: 1,
        status: { type: "saucy" },
      },
      p2: {
        pizzaId: "v001",
        hp: 50,
        maxHp: 50,
        xp: 70,
        maxXp: 100,
        level: 1,
        status: null,
      },
      p3: {
        pizzaId: "f001",
        hp: 50,
        maxHp: 50,
        xp: 70,
        maxXp: 100,
        level: 1,
        status: null,
      },
    };

    this.lineup = ["p1", "p2"];
    this.items = [
      { actionId: "item_recoverStatus", instanceId: "item1" },
      { actionId: "item_recoverStatus", instanceId: "item1" },
      { actionId: "item_recoverStatus", instanceId: "item1" },
    ];
    this.storyFlags = {
      // "DID_SMOETHING": true,
      // "DEFEATED_FIRST_BOSS":true,
      // TALKED_TO_ERIO: true,
    };
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }
  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter((id) => id != futureFrontId);
    this.lineup.unshift(futureFrontId);

    utils.emitEvent("LineupChanged");
  }

  async addPizza(pizzaId) {
    const newId = `p${Date.now()}` + Math.floor(Math.random() * 99999);
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };
    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }
    console.log(await utils.emitEvent("LineupChanged"));
    console.log(this);
  }
}

window.playerState = new PlayerState();

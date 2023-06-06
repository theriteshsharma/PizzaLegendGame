class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.currentTeam = "player";
    this.onWinner = onWinner;
  }

  async turn() {
    // Get Caster and Enemey For the current Turn Cycle
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId =
      this.battle.activeCombatants[
        caster.team === "player" ? "enemy" : "player"
      ];
    const enemy = this.battle.combatants[enemyId];

    // Intitate Select event
    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy,
    });

    // Stop here if we are replacing pizza
    if (submission.replacement) {
      await this.onNewEvent({
        type: "replace",
        replacement: submission.replacement,
      });
      await this.onNewEvent({
        type: "textMessage",
        text: `Go get em, ${submission.replacement.name} !`,
      });
      this.nextTurn();
      return;
    }
    if (submission.instanceId) {
      this.battle.usedInstanceIds[submission.instanceId] = true;
      this.battle.items = this.battle.items.filter(
        (i) => i.instanceId !== submission.instanceId
      );
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);
    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };

      await this.onNewEvent(event);
    }

    // Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.target.name} is ruined`,
      });

      if (submission.target.team === "enemy") {
        const playerActivePizzaId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXp;
        await this.onNewEvent({
          type: "textMessage",
          text: ` Gained ${xp}xp`,
        });
        await this.onNewEvent({
          type: "giveXp",
          xp,
          combatant: this.battle.combatants[playerActivePizzaId],
        });
      }
    }
    // Do have a winig Team
    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: "Winner !",
      });
      this.onWinner(winner);
      return;
    }
    // end the battle

    // Bring replacment
    if (targetDead) {
      const replacement = await this.onNewEvent({
        type: "replacementMenu",
        team: submission.target.team,
      });
      await this.onNewEvent({
        type: "replace",
        replacement: replacement,
      });
      await this.onNewEvent({
        type: "textMessage",
        text: ` ${replacement.name} Apears!`,
      });
    }

    // check for post events

    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    const expiredEvent = caster.decrementStatus();
    if (expiredEvent.length > 0) {
      await this.onNewEvent(expiredEvent);
    }
    this.nextTurn();
  }
  nextTurn() {
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    this.turn();
  }

  getWinningTeam() {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach((c) => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    });
    if (!aliveTeams["player"]) {
      return "enemy";
    }
    if (!aliveTeams["enemy"]) {
      return "player";
    }
    return null;
  }
  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `${this.battle.enemy.name} wants to throw down!`,
    });

    // Start the first tur;

    this.turn();
  }
}

class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.replacements = replacements;

    let quantityMap = {};
    items.forEach((item) => {
      if (item.team === caster.team) {
        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity += 1;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          };
        }
      }
    });
    this.items = Object.values(quantityMap);
  }
  getPages() {
    const backOption = {
      label: "Go back",
      description: "REturn to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      },
    };
    return {
      root: [
        {
          label: "Attack",
          description: "Choose an Attack",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().attacks);
          },
        },
        {
          label: "Items",
          description: "Choose an Item",

          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().items);
          },
        },
        {
          label: "Swap",
          description: "Chagne to another pizza",
          handler: () => {
            this.keyboardMenu.setOptions(this.getPages().replacements);
          },
        },
        backOption,
      ],
      attacks: [
        ...this.caster.actions.map((key) => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action);
            },
          };
        }),
        backOption,
      ],
      items: [
        ...this.items.map((item) => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x" + item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId);
            },
          };
        }),
        backOption,
      ],
      replacements: [
        ...this.replacements.map((replacement) => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              this.menuSubmitReplacement(replacement);
            },
          };
        }),
        backOption,
      ],
    };
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement,
    });
  }

  menuSubmit(action, instanceId = null) {
    this.keyboardMenu?.end();
    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId,
    });
  }
  decide() {
    this.menuSubmit(Actions[this.caster.actions[0]]);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}

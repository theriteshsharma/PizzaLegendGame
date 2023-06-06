class PauseMenu {
  constructor({ progress, onComplete }) {
    this.onComplete = onComplete;
    this.progress = progress;
  }

  getOptions(pageKey) {
    if (pageKey === "root") {
      const linupPizzaas = playerState.lineup.map((id) => {
        const { pizzaId } = playerState.pizzas[id];
        const base = Pizzas[pizzaId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions(id));
          },
        };
      });
      return [
        ...linupPizzaas,
        {
          label: "Save",
          description: "Save your Progress",
          handler: () => {
            this.progress.save();
            this.close();
          },
        },
        {
          label: "Back",
          description: "Back to the Game",
          handler: () => {
            this.close();
          },
        },
      ];
    }

    const unequipped = Object.keys(playerState.pizzas)
      .filter((id) => {
        return playerState.lineup.indexOf(id) === -1;
      })
      .map((id) => {
        const { pizzaId } = playerState.pizzas[id];
        const base = Pizzas[pizzaId];
        return {
          label: `Swap for ${base.name}`,
          description: base.description,
          handler: () => {
            playerState.swapLineup(pageKey, id);
            this.keyboardMenu.setOptions(this.getOptions("root"));
          },
        };
      });

    return [
      ...unequipped,
      {
        label: "Move to Front",
        description: "Save your Progress",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
      {
        label: "Back",
        description: "Back to Root Menu",
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
    ];
  }
  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.classList.add("overlayMenu");
    this.element.innerHTML = `<h2>Pause Menu</h2>`;
  }
  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    await utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}

window.Actions = {
  damage1: {
    name: "Whomp!",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      {
        type: "animation",
        animation: "spin",
      },
      { type: "stateChange", damage: 10 },
    ],
  },

  saucyStatus: {
    name: "Tomato Squeeze!",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      {
        type: "stateChange",

        status: {
          type: "saucy",
          expiresIn: 1,
        },
      },
    ],
  },
  clumsyStatus: {
    name: "Oliv Oil!",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "glob", color: "#dafd2a" },
      {
        type: "stateChange",

        status: {
          type: "clumsy",
          expiresIn: 1,
        },
      },
      { type: "textMessage", text: "{TARGET} is slipping all around" },
    ],
  },
  //items
  item_recoverStatus: {
    name: "Heating Lamp",
    description: "Feeling Fress and Warm",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
      {
        type: "stateChange",
        status: null,
      },
    ],
  },
  item_recoverHP: {
    name: "Parmesan",
    description: "A littlee Parmesan is good",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} Sprinkels on some {ACTION}" },
      {
        type: "stateChange",
        recover: 10,
      },
      { type: "textMessage", text: "{CASTER} revoers HP!" },
    ],
  },
};

import { system } from "@minecraft/server";

import "./register-components";
import { MOD_ID } from "./ModID";
import "./cleanup";
import "./handle-musket-round-hit";

system.beforeEvents.startup.subscribe(() => {
  console.log(`INFO:成功加载了${MOD_ID.id}!`);
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  switch (event.id) {
    case "dbg:test":
      break;

    case "dbg:test1":
      break;

    default:
      break;
  }
});

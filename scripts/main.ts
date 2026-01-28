import { system } from "@minecraft/server";

import "./register-components";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  switch (event.id) {
    default:
      break;
  }
});

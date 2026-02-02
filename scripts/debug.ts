import { system } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  switch (event.id) {
    default:
      break;
  }
});

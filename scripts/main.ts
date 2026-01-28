import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import "./register-components";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  switch (event.id) {
    case "dbg:form":
      const players = world.getPlayers();
      const form = new ActionFormData().title("Hello,World!").body("Body").button("a").button("b");
      form.show(players[0]).then((response) => {
        if (response.canceled) {
          world.sendMessage("Form was canceled.");
        } else {
          world.sendMessage(`You selected button #${response.selection}`);
        }
      });
      break;
    case "dbg:test1":
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;

        event.sourceEntity?.dimension.spawnParticle("minecraft:endrod", {
          x: event.sourceEntity.location.x + Math.cos(angle) * 0.5,
          y: event.sourceEntity.location.y + 0.5,
          z: event.sourceEntity.location.z + Math.sin(angle) * 0.5,
        });
      }
      break;

    default:
      break;
  }
});

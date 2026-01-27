import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.afterEvents.chatSend.subscribe((event) => {
  world.sendMessage(`You said: ${event.message}`);
});

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
      break;

    default:
      break;
  }
});

import { world } from "@minecraft/server";
world.afterEvents.chatSend.subscribe((event) => {
  world.sendMessage(`You said: ${event.message}`);
});

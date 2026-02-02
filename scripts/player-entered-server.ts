import { world } from "@minecraft/server";
import { DynamicJson } from "./utils/DynamicJson";

export let playerEnteredServerJson: DynamicJson<string[]>;

world.afterEvents.worldLoad.subscribe(() => {
  playerEnteredServerJson = new DynamicJson(world, "PLAYER_LIST");
  if (playerEnteredServerJson.get() === undefined) {
    playerEnteredServerJson.set(new Array());
  }
});

world.afterEvents.playerSpawn.subscribe((event) => {
  let playerEnteredServerObject = playerEnteredServerJson.get();
  if (playerEnteredServerObject === undefined) return;
  let playerEnteredServerArray = Array.from(playerEnteredServerObject);

  const playerName = event.player.name;
  if (!playerEnteredServerArray.includes(playerName)) {
    playerEnteredServerArray.push(playerName);
  }
  playerEnteredServerJson.set(playerEnteredServerArray);
});

import { DisplaySlotId, ScoreboardObjective, system, world } from "@minecraft/server";
import { MOD_ID } from "./ModID";

export let ONLINE_TIME_SURFFIX = "online_time";
export let ONLINE_TIME_DISPLAY_ID = MOD_ID.of("online_time_display");

let onlineTimeDisplayObjective: ScoreboardObjective | undefined;

export function getPlayerOnlineTimeKey(playerId: string) {
  return MOD_ID.of(`${playerId}_${ONLINE_TIME_SURFFIX}`);
}

world.afterEvents.worldLoad.subscribe(() => {
  /**初始化 展示计分板*/
  onlineTimeDisplayObjective = world.scoreboard.getObjective(ONLINE_TIME_DISPLAY_ID);
  if (onlineTimeDisplayObjective === undefined) {
    onlineTimeDisplayObjective = world.scoreboard.addObjective(ONLINE_TIME_DISPLAY_ID, "在线时间");
  }

  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.BelowName, {
    objective: onlineTimeDisplayObjective,
  });
});

world.afterEvents.playerSpawn.subscribe((event) => {
  if (event.initialSpawn) {
    const player = event.player;
    if (world.getDynamicProperty(getPlayerOnlineTimeKey(player.name)) === undefined) {
      world.setDynamicProperty(getPlayerOnlineTimeKey(player.name), 0);
    }
  }
});

system.runInterval(() => {
  for (let player of world.getPlayers()) {
    const key = getPlayerOnlineTimeKey(player.name);
    const newOnlineTime = ((world.getDynamicProperty(key) ?? 0) as number) + 1;
    world.setDynamicProperty(key, newOnlineTime);
    onlineTimeDisplayObjective?.setScore(player, newOnlineTime);
  }
}, 60 * 20);

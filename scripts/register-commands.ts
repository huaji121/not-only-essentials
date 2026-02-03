import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world } from "@minecraft/server";
import { MOD_ID } from "./ModID";
import { playerEnteredServerJson } from "./player-entered-server";
import { getPlayerOnlineTimeKey } from "./online-time";

enum RankEnum {
  onlineTime = "onlineTime",
  enteredPlayer = "enteredPlayer",
}

function formatPlayerOnlineTimeRank() {
  let list: { playerName: string; onlineTime: number }[] = [];
  const playerEnteredServerObject = playerEnteredServerJson.get();
  if (playerEnteredServerObject === undefined) return;
  for (let playerName of playerEnteredServerObject) {
    list.push({
      playerName: playerName,
      onlineTime: world.getDynamicProperty(getPlayerOnlineTimeKey(playerName)) as number,
    });
  }
  list.sort((a, b) => {
    return b.onlineTime - a.onlineTime;
  });

  let result = "";
  for (let info of list) {
    result += `名称:${info.playerName} 在线时长:${info.onlineTime}\n`;
  }

  return result;
}

function formatPlayerEnteredRank() {
  let playerEnteredServerObject = playerEnteredServerJson.get();
  if (playerEnteredServerObject === undefined) return;
  let result = "";

  for (let playerName of playerEnteredServerObject) {
    result += `名称:${playerName}\n`;
  }

  return result;
}

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
  customCommandRegistry.registerEnum(MOD_ID.of("rankEnum"), Object.values(RankEnum));

  customCommandRegistry.registerCommand(
    {
      name: MOD_ID.of("rank"),
      description: "展示游戏内的排行",
      permissionLevel: CommandPermissionLevel.Any,
      cheatsRequired: false,
      mandatoryParameters: [
        {
          name: MOD_ID.of("rankEnum"),
          type: CustomCommandParamType.Enum,
        },
      ],
    },
    (_, rankEnum) => {
      switch (rankEnum as RankEnum) {
        case RankEnum.onlineTime:
          return {
            status: CustomCommandStatus.Success,
            message: formatPlayerOnlineTimeRank(),
          };
          break;

        case RankEnum.enteredPlayer:
          return {
            status: CustomCommandStatus.Success,
            message: formatPlayerEnteredRank(),
          };
          break;

        default:
          return {
            status: CustomCommandStatus.Failure,
            message: "未知的排行榜枚举",
          };
          break;
      }
    }
  );
});

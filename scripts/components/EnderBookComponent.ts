import { ItemComponentUseEvent, ItemCustomComponent, Player, system, Vector3, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DynamicJson } from "../utils/DynamicJson";
import { MOD_ID } from "../ModID";
import { Vector3Utils } from "@minecraft/math";
import {
  consumeMultiple,
  getPlayerMainHandItem,
  setPlayerMainHandItem,
  updatePlayerOnHandItemDynamicJson,
} from "../utils/player-item";
import { formatDimension, formatVector3 } from "../utils/formater";

interface DimensionPosition {
  dim: string;
  pos: Vector3;
}

export class EnderBookComponent implements ItemCustomComponent {
  private static COST_SCALE = 0.001;
  private static COST_SCALE_CROSS_DIMENSION = 8;

  private static computeRequiredEnderDustAmount(player: Player, position: DimensionPosition) {
    const requiredAmount = Math.floor(
      EnderBookComponent.COST_SCALE *
        (player.dimension.id === position.dim ? 1 : EnderBookComponent.COST_SCALE_CROSS_DIMENSION) *
        Vector3Utils.distance(player.location, position.pos)
    );
    return requiredAmount;
  }

  onUse(event: ItemComponentUseEvent) {
    const player = event.source;
    if (!getPlayerMainHandItem(player)) return;

    let form = new ActionFormData()
      .title("末影之书")
      .body(`当前位于${formatVector3(player.location)}`)
      .button("在此建立路径点", "textures/gui/newgui/Realms.png")
      .button("路径点列表", "textures/gui/newgui/Local.png");
    form.show(player).then((result) => {
      if (result.canceled) {
      } else {
        switch (result.selection) {
          case 0 /**建立路径点 */:
            let createPointForm = new ModalFormData()
              .title("建立路径点")
              .textField("路径点名称", "点击输入名称")
              .submitButton("提交");
            createPointForm.show(player).then((result) => {
              if (result.formValues) {
                const name = result.formValues[0] as string;
                const currentOnHandItem = getPlayerMainHandItem(player);
                if (!currentOnHandItem) return;
                let itemPointTableJson = new DynamicJson(currentOnHandItem, "POINT_TABLE");
                if (itemPointTableJson.get() === undefined) {
                  itemPointTableJson.set({});
                }
                let itemPointTableObject = itemPointTableJson.get();
                if (name === "") {
                  player.sendMessage(`§a路径点名称不能为空`);
                  return;
                }
                if (itemPointTableObject[name] !== undefined) {
                  player.sendMessage(`§a路径点§e${name}§a已存在`);
                  return;
                }
                /**
                 * TABLE:
                 *  NAME:#DimensionPosition
                 *    pos:VEC3
                 *    dim:DIM
                 *  NAME:#DimensionPosition
                 *    ...
                 *  NAME:#DimensionPosition
                 *    ...
                 *
                 */
                itemPointTableObject[name] = {
                  dim: player.dimension.id,
                  pos: player.location,
                } satisfies DimensionPosition;
                updatePlayerOnHandItemDynamicJson(player, currentOnHandItem, itemPointTableJson, itemPointTableObject);
                player.sendMessage(`§a成功创建了路径点§e${name}`);
                player.dimension.playSound("beacon.activate", player.location);
              }
            });
            break;
          case 1 /**路径点列表 */:
            const currentOnHandItem = getPlayerMainHandItem(player);
            if (!currentOnHandItem) return;
            let itemPointTableJson = new DynamicJson<any>(currentOnHandItem, "POINT_TABLE");
            /**处理初始状态 */
            if (itemPointTableJson.get() === undefined) {
              itemPointTableJson.set({});
            }

            let itemPointTableObject = itemPointTableJson.get();

            const pointsForm = new ActionFormData().title("路径点");

            let keyList: Array<string> = new Array();

            for (let key in itemPointTableObject) {
              const position = itemPointTableObject[key] as DimensionPosition;

              const requiredAmount = EnderBookComponent.computeRequiredEnderDustAmount(player, position);
              keyList.push(key);
              pointsForm.button(key + (requiredAmount > 0 ? `(传送预计消耗${requiredAmount}末影粉末!)` : ""));
            }

            pointsForm.show(player).then((result) => {
              if (result.selection === undefined) return;
              const nameKey = keyList[result.selection];
              const position = itemPointTableObject[nameKey] as DimensionPosition;
              const requiredAmount = EnderBookComponent.computeRequiredEnderDustAmount(player, position);
              const editPointForm = new ActionFormData()
                .title(`路径点 ${nameKey}`)
                .body(
                  `维度:${formatDimension(position.dim)}\n位置:${formatVector3(position.pos)}\n传送预计消耗${requiredAmount}末影粉末`
                )
                .button("传送")
                .button("修改名称")
                .button("删除");
              editPointForm.show(player).then((result) => {
                if (result.selection === undefined) return;
                switch (result.selection) {
                  case 0 /**传送 */:
                    const selectedItem = consumeMultiple(player, [
                      { id: MOD_ID.of("ender_dust"), amount: requiredAmount },
                    ]);
                    if (selectedItem !== undefined) {
                      player.teleport(position.pos, { dimension: world.getDimension(position.dim) });
                      player.sendMessage(`§a已传送到路径点§e${nameKey}`);
                      system.runTimeout(() => {
                        player.dimension.playSound("beacon.deactivate", player.location);
                      }, 1);
                    } else {
                      player.sendMessage(`§a需要§e${requiredAmount}§r个§e末影粉§r`);
                    }

                    break;

                  case 1 /**修改 */:
                    const getANameForm = new ModalFormData().title("输入名称").textField("输入新名称", "点击输入名称");

                    getANameForm.show(player).then((result) => {
                      if (!result.formValues) return;
                      const newName = result.formValues[0] as string;
                      if (newName in keyList) {
                        player.sendMessage(`§a路径点§e${newName}§a已存在`);
                        return;
                      }
                      const pointInfo = itemPointTableObject[nameKey];
                      /**先删除 */
                      itemPointTableObject[nameKey] = undefined;
                      updatePlayerOnHandItemDynamicJson(
                        player,
                        currentOnHandItem,
                        itemPointTableJson,
                        itemPointTableObject
                      );
                      /**再添加 */
                      itemPointTableObject[newName] = pointInfo;
                      updatePlayerOnHandItemDynamicJson(
                        player,
                        currentOnHandItem,
                        itemPointTableJson,
                        itemPointTableObject
                      );
                      player.sendMessage(`§a成功地修改了路径点§e${nameKey}§a名称为§e${newName}`);
                    });
                    break;

                  case 2 /**删除 */:
                    itemPointTableObject[nameKey] = undefined;
                    itemPointTableJson.set(itemPointTableObject);
                    setPlayerMainHandItem(player, currentOnHandItem);
                    player.sendMessage(`§a成功删除了路径点§e${nameKey}`);
                    break;

                  default:
                    break;
                }
              });
            });

            break;
          default:
            console.log(`${result.selection}`);
        }
      }
    });
  }
}

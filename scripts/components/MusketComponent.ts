import {
  CustomComponentParameters,
  EntityComponentTypes,
  GameMode,
  ItemComponentUseEvent,
  ItemCustomComponent,
  ItemStack,
  VanillaEntityIdentifier,
  world,
} from "@minecraft/server";
import { MOD_ID } from "../ModID";
import { Vector3Utils } from "@minecraft/math";
import { tryToSpendItem } from "../utils/tools";

export class MusketComponent implements ItemCustomComponent {
  static readonly PROJECTILE_VELOCITY_SCALE = 5;
  static readonly PROJECTILE_DANEMR = 30;

  onUse(event: ItemComponentUseEvent): void {
    const player = event.source;
    const playerView = player.getViewDirection();

    tryToSpendItem(
      player,
      MOD_ID.of("musket_round"),
      () => /**failed */ {
        player.dimension.playSound("block.itemframe.break", player.location);
      },
      () => /**successful */ {
        const projectile = player.dimension.spawnEntity(
          MOD_ID.of("musket_round") as VanillaEntityIdentifier,
          player.getHeadLocation(),
          {}
        );
        const projectileComponent = projectile.getComponent(EntityComponentTypes.Projectile);

        if (projectileComponent) {
          projectileComponent.owner = player;

          projectileComponent.shoot(Vector3Utils.scale(playerView, MusketComponent.PROJECTILE_VELOCITY_SCALE));
          player.dimension.playSound("cauldron.explode", player.location);
          player.dimension.spawnParticle("minecraft:cauldron_explosion_emitter", player.getHeadLocation());
        }
      },
      1
    );
  }
}

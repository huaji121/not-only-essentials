import {
  CustomComponentParameters,
  EntityComponentTypes,
  GameMode,
  ItemComponentUseEvent,
  ItemCustomComponent,
  ItemStack,
  VanillaEntityIdentifier,
} from "@minecraft/server";
import { MOD_ID } from "../ModID";
import { Vector3Utils } from "@minecraft/math";

export class MusketComponent implements ItemCustomComponent {
  onUse(event: ItemComponentUseEvent): void {
    const player = event.source;
    const inventory = player.getComponent(EntityComponentTypes.Inventory)?.container;
    if (!inventory) {
      return;
    }
    const gameMode = player.getGameMode();
    if (!(gameMode === GameMode.Creative)) {
      if (!inventory.contains(new ItemStack(MOD_ID.of("musket_round")))) {
        player.playSound("block.itemframe.break");
        return;
      }
    }

    const projectile = player.dimension.spawnEntity(
      MOD_ID.of("musket_round") as VanillaEntityIdentifier,
      player.getHeadLocation(),
      {}
    );
    const velocity = 3;
    const playerView = player.getViewDirection();
    const projectileComponent = projectile.getComponent(EntityComponentTypes.Projectile);

    if (projectileComponent) {
      projectileComponent.owner = player;

      projectileComponent.shoot(Vector3Utils.scale(playerView, velocity));
      player.playSound("cauldron.explode");
      player.spawnParticle("minecraft:cauldron_explosion_emitter", player.getHeadLocation());
      if (gameMode !== GameMode.Creative) {
        player.runCommand("clear @s noe:musket_round 0 1");
      }
    }
  }
}

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
    if (!(player.getGameMode() === GameMode.Creative)) {
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
      player.runCommand("clear @s noe:musket_round 0 1");
    }
  }
}

// world.afterEvents.entityDie.subscribe((event) => {
//   world.sendMessage(event.damageSource.cause);
//   if (event.damageSource.damagingEntity) {
//     event.damageSource.damagingEntity = undefined;
//     // world.sendMessage(`Entity: ${event.damageSource.damagingEntity.nameTag}`);
//   }
//   if (event.damageSource.damagingProjectile)
//     world.sendMessage(`Projectile: ${event.damageSource.damagingProjectile.nameTag}`);
// });

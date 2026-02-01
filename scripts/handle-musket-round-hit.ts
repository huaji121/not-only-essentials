import { EntityApplyDamageByProjectileOptions, EntityComponent, EntityComponentTypes, world } from "@minecraft/server";
import { MOD_ID } from "./ModID";

world.afterEvents.projectileHitEntity.subscribe((event) => {
  const projectile = event.projectile;
  if (!projectile.isValid) {
    return;
  }
  if (projectile.typeId === MOD_ID.of("musket_round")) {
    const damager = projectile.getComponent(EntityComponentTypes.Projectile)?.owner;

    event.getEntityHit().entity?.applyDamage(30, {
      damagingEntity: damager,
      damagingProjectile: event.projectile,
    } satisfies EntityApplyDamageByProjectileOptions);

    //收尾
    projectile.remove();
  }
});

world.afterEvents.projectileHitBlock.subscribe((event) => {
  const projectile = event.projectile;
  if (!projectile.isValid) {
    return;
  }

  if (projectile.typeId === MOD_ID.of("musket_round")) {
    projectile.remove();
  }
});

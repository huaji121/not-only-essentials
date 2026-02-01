import { EntityDamageCause, ItemComponentHitEntityEvent, ItemCustomComponent } from "@minecraft/server";

export class CactusSwordComponent implements ItemCustomComponent {
  onHitEntity(event: ItemComponentHitEntityEvent) {
    const player = event.attackingEntity;
    player.applyDamage(1, { cause: EntityDamageCause.thorns });
  }
}

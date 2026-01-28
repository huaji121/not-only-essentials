import { ItemComponentConsumeEvent, ItemCustomComponent, system } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { chorusTeleport, superposeEffects } from "../utils/tools";

export class EnderAppleComponent implements ItemCustomComponent {
  /**
   * 使用紫颂果触发传送效果
   */
  onConsume(event: ItemComponentConsumeEvent): void {
    const entity = event.source;

    chorusTeleport(entity, 8);
    //给予夜视和反胃
    superposeEffects(entity, MinecraftEffectTypes.NightVision, 600);
    superposeEffects(entity, MinecraftEffectTypes.Nausea, 200);

    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;

      entity.dimension.spawnParticle("minecraft:endrod", {
        x: entity.location.x + Math.cos(angle) * 0.5,
        y: entity.location.y + 0.5,
        z: entity.location.z + Math.sin(angle) * 0.5,
      });
    }
  }
}

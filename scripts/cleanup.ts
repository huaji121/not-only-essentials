import { system, world } from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import { MOD_ID } from "./ModID";

system.runInterval(
  () => {
    const dimensions = [
      world.getDimension(MinecraftDimensionTypes.Overworld),
      world.getDimension(MinecraftDimensionTypes.Nether),
      world.getDimension(MinecraftDimensionTypes.TheEnd),
    ];

    for (let [idx, dim] of dimensions.entries()) {
      for (let entity of dim.getEntities({ type: MOD_ID.of("musket_round") })) {
        entity.remove();
      }
      console.log(`在维度${dim.id}清理了${idx + 1}个火枪弹实体`);
    }
  },
  3 * 60 * 20
);

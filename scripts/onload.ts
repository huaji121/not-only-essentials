import { system } from "@minecraft/server";
import { MOD_ID } from "./ModID";

system.beforeEvents.startup.subscribe(() => {
  console.log(`INFO:成功加载了${MOD_ID.id}!`);
});

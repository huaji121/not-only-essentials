import { system } from "@minecraft/server";
import { EnderScrollUnusedComponent } from "../components/EnderScrollUnusedComponent";
import { EnderScrollComponent } from "../components/EnderScrollComponent";
import { EnderAppleComponent } from "../components/EnderAppleComponent";
import { MusketComponent } from "../components/MusketComponent";
import { CactusSwordComponent } from "../components/CactusSwordComponent";
import { EnderBookComponent } from "../components/EnderBookComponent";
import { MOD_ID, ModId } from "../utils/ModID";

system.beforeEvents.startup.subscribe((initEvent) => {
  // Register components here
  initEvent.itemComponentRegistry.registerCustomComponent(
    MOD_ID.of("ender_scroll_unused"),
    new EnderScrollUnusedComponent()
  );
  initEvent.itemComponentRegistry.registerCustomComponent(MOD_ID.of("ender_scroll"), new EnderScrollComponent());
  initEvent.itemComponentRegistry.registerCustomComponent(MOD_ID.of("ender_apple"), new EnderAppleComponent());
  initEvent.itemComponentRegistry.registerCustomComponent(MOD_ID.of("musket"), new MusketComponent());
  initEvent.itemComponentRegistry.registerCustomComponent(MOD_ID.of("cactus_sword"), new CactusSwordComponent());
  initEvent.itemComponentRegistry.registerCustomComponent(MOD_ID.of("ender_book"), new EnderBookComponent());
});

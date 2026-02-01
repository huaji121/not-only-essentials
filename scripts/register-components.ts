import { system, world } from "@minecraft/server";
import { EnderScrollUnusedComponent } from "./components/EnderScrollUnusedComponent";
import { EnderScrollComponent } from "./components/EnderScrollComponent";
import { EnderAppleComponent } from "./components/EnderAppleComponent";
import { MusketComponent } from "./components/MusketComponent";
import { CactusSwordComponent } from "./components/CactusSwordComponent";
import { EnderBookComponent } from "./components/EnderBookComponent";

system.beforeEvents.startup.subscribe((initEvent) => {
  // Register components here
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll_unused", new EnderScrollUnusedComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll", new EnderScrollComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_apple", new EnderAppleComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:musket", new MusketComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:cactus_sword", new CactusSwordComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_book", new EnderBookComponent());
});

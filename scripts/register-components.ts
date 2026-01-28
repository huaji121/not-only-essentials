import { system, world } from "@minecraft/server";
import { EnderScrollUnusedComponent } from "./components/EnderScrollUnusedComponent";
import { EnderScrollComponent } from "./components/EnderScrollComponent";
import { EnderAppleComponent } from "./components/EnderAppleComponent";
import { MusketComponent } from "./components/MusketComponent";

system.beforeEvents.startup.subscribe((initEvent) => {
  // Register components here
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll_unused", new EnderScrollUnusedComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll", new EnderScrollComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_apple", new EnderAppleComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:musket", new MusketComponent());
});

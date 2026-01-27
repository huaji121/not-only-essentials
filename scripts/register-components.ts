import { system, world } from "@minecraft/server";
import { EnderScrollUnusedComponent } from "./EnderScrollUnusedComponent";
import { EnderScrollComponent } from "./EnderScrollComponent";

system.beforeEvents.startup.subscribe((initEvent) => {
  // Register components here
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll_unused", new EnderScrollUnusedComponent());
  initEvent.itemComponentRegistry.registerCustomComponent("noe:ender_scroll", new EnderScrollComponent());
});

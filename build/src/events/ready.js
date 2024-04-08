"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ready_event = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(discord_client) {
        console.log(`Bot arrancado como ${discord_client.user.tag}`);
    },
};
exports.default = ready_event;
//# sourceMappingURL=ready.js.map
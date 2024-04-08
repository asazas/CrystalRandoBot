"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config/config.json");
const discord_client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.User],
});
discord_client.commands = new discord_js_1.Collection();
const commandsPath = (0, path_1.join)(__dirname, 'commands');
const commandFiles = (0, fs_1.readdirSync)(commandsPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = (0, path_1.join)(commandsPath, file);
    const command = require(filePath).default;
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        discord_client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
const eventsPath = (0, path_1.join)(__dirname, 'events');
const eventFiles = (0, fs_1.readdirSync)(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = (0, path_1.join)(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        discord_client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        discord_client.on(event.name, (...args) => event.execute(...args));
    }
}
discord_client.login(config_json_1.discordToken);
//# sourceMappingURL=index.js.map
import { readdirSync } from 'fs';
import { join } from 'path';
import { Client, Collection, DiscordCommand, DiscordEvent, GatewayIntentBits, Partials } from 'discord.js';
import { discordToken } from '../config/config.json';

const discord_client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
	],

	partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
});

discord_client.commands = new Collection();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command: DiscordCommand = require(filePath).default;
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		discord_client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const event: DiscordEvent = require(filePath);
	if (event.once) {
		discord_client.once(event.name, (...args) => event.execute(...args));
	} else {
		discord_client.on(event.name, (...args) => event.execute(...args));
	}
}

discord_client.login(discordToken);

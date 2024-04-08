import { Client, DiscordEvent, Events } from 'discord.js';

const ready_event: DiscordEvent = {
	name: Events.ClientReady,
	once: true,
	async execute(discord_client: Client) {
		console.log(`Bot arrancado como ${discord_client.user.tag}`);
	},
};

export default ready_event;

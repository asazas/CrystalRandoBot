import { DiscordCommand, REST, Routes } from 'discord.js';
import { discordClientId, discordGuildId, discordToken } from '../../config/config.json';
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command: DiscordCommand = require(filePath).default;
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(discordToken);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} guild application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = await rest.put(Routes.applicationGuildCommands(discordClientId, discordGuildId), {
			body: commands,
		});

		console.log(`Successfully reloaded ${data.length} guild application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

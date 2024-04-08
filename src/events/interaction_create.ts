import { BaseInteraction, Events } from 'discord.js';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: BaseInteraction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			const error_msg: string = error.message ?? 'There was an error while executing this command!';
			try {
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: error_msg, ephemeral: true });
				} else {
					await interaction.reply({ content: error_msg, ephemeral: true });
				}
			} catch (unknown_interaction) {
				console.error('Could not reply to original interaction.');
			}
		}
	},
};

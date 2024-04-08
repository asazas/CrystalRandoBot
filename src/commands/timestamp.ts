import { ChatInputCommandInteraction, DiscordCommand, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { process_date } from '../util/date_util';

const timestamp: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('Convert a date into the Discord timestamp format.')
		.addStringOption((option) =>
			option.setName('date').setDescription('Date following format dd/mm/yyyy. Default: today.'),
		)
		.addStringOption((option) =>
			option.setName('time').setDescription('Time following format hh:mm. Default: current time.'),
		)
		.addStringOption((option) =>
			option
				.setName('timezone')
				.setDescription('Time zone. Default: EST/EDT.')
				.addChoices(
					{ name: 'US Eastern (EST/EDT)', value: 'America/New_York' },
					{ name: 'US Central (CST/CDT)', value: 'America/Chicago' },
					{ name: 'US Mountain (MST/MDT)', value: 'America/Denver' },
					{ name: 'US Pacific (PST/PDT)', value: 'America/Los_Angeles' },
					{ name: 'Central Europe (CET/CEST)', value: 'Europe/Paris' },
					{ name: 'Western Europe (WET/WEST)', value: 'Europe/Lisbon' },
					{ name: 'Eastern Europe (EET/EEST)', value: 'Europe/Sofia' },
					{ name: 'Japan (JST)', value: 'Asia/Tokyo' },
				),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		const date = (interaction.options.getString('date') ?? 'today').toLowerCase();
		const time = (interaction.options.getString('time') ?? 'now').toUpperCase();
		const timezone = interaction.options.getString('timezone') ?? 'America/New_York';

		const obj_fecha = process_date(date, time, timezone);
		const tstamp = obj_fecha.toSeconds();
		const response_embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`<t:${tstamp}>`)
			.addFields([{ name: 'Timestamp', value: `\`\`\`<t:${tstamp}>\`\`\`` }])
			.setTimestamp();
		await interaction.reply({ embeds: [response_embed] });
	},
};

export default timestamp;

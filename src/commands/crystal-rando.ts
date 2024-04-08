import { SlashCommandBuilder } from '@discordjs/builders';
import { UPRPath, ItemRandoPath, SpeedchoicePath } from '../../config/config.json';
import { random_classes, random_names } from '../strings/random_words';

import util from 'util';
import { CacheType, ChatInputCommandInteraction, DiscordCommand } from 'discord.js';
const exec = util.promisify(require('child_process').exec);

/**
 * Invoked when requesting the generation of a Pokémon Crystal Item Randomizer seed.
 *
 * @remarks Generates a Pokémon Crystal Item Randomizer seed and sends it as the answer to the command interaction.
 *
 * @param interaction - Interaction corresponding to the invoked command.
 * @param upr_mode - Relative path to the Universal Pokémon Randomizer preset.
 * @param itemrando_mode - Relative path to the Pokémon Crystal Item Randomizer preset.
 * @param name - Seed name.
 * @param spoiler - Whether to generate the spoiler logs for the seed.
 */
async function generate_itemrando(
	interaction: ChatInputCommandInteraction<CacheType>,
	upr_mode: string,
	itemrando_mode: string,
	name: string,
	spoiler: boolean,
) {
	const tmp_dir = await exec('mktemp -d');
	const tmp_dir_name = tmp_dir['stdout'].trim();

	const spoiler_flag = spoiler ? '-l' : '';
	await exec(
		`java -jar universal-pokemon-randomizer-zx.jar cli -s ZXsettings/${upr_mode} -i ${SpeedchoicePath} -o "${tmp_dir_name}/${name}_UPR.gbc" ${spoiler_flag}`,
		{ cwd: UPRPath },
	);
	await exec(
		`"./Pokemon Crystal Item Randomizer" cli -i "${tmp_dir_name}/${name}_UPR.gbc" -o "${tmp_dir_name}/${name}.gbc" -m "./Modes/${itemrando_mode}" ${spoiler_flag}`,
		{ cwd: ItemRandoPath },
	);

	if (spoiler) {
		await interaction.editReply({
			files: [
				`${tmp_dir_name}/${name}.gbc`,
				{ attachment: `${tmp_dir_name}/${name}_UPR.gbc.log`, name: `SPOILER_${name}_UPR.gbc.log` },
				{ attachment: `${tmp_dir_name}/${name}.gbc_SPOILER.txt`, name: `SPOILER_${name}.gbc_SPOILER.txt` },
			],
		});
	} else {
		await interaction.editReply({ files: [`${tmp_dir_name}/${name}.gbc`] });
	}

	await exec(`rm -rf ${tmp_dir_name}`);
}

const crystal_rando: DiscordCommand = {
	data: new SlashCommandBuilder()
		.setName('crystal-rando')
		.setDescription('Generate a Pokémon Crystal Item Randomizer seed.')
		.addStringOption((option) =>
			option.setName('mode').setDescription('Game mode.').setRequired(true).addChoices(
				{
					name: 'Maximum Shopsanity (2024 Tourney)',
					value: 'TourneySettings/MaximumShopsanityRaceEdition.yml',
				},
				{
					name: 'Extreme Full Item Randomizer (2023 Tourney)',
					value: 'TourneySettings/FullItemRandoTournament2023Stage1Extreme.yml',
				},
				{
					name: 'Crazy Full Item Randomizer (2023 Tourney)',
					value: 'TourneySettings/FullItemRandoTournament2023Stage2Crazy.yml',
				},
			),
		)
		.addStringOption((option) => option.setName('name').setDescription('Seed name.'))
		.addBooleanOption((option) =>
			option.setName('spoiler').setDescription('Whether to generate spoiler logs for the seed.'),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const mode = interaction.options.getString('modo');
		const spoiler = interaction.options.getBoolean('spoiler') ?? false;
		let rom_name =
			interaction.options.getString('nombre') ??
			`${random_classes[Math.floor(Math.random() * random_classes.length)]}${
				random_names[Math.floor(Math.random() * random_names.length)]
			}`;
		rom_name = rom_name.substring(0, 50);

		await generate_itemrando(interaction, 'updatedstandard.rnqs', mode, rom_name, spoiler);
	},
};

export default crystal_rando;

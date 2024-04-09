"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const config_json_1 = require("../../config/config.json");
const random_words_1 = require("../strings/random_words");
const util_1 = __importDefault(require("util"));
const exec = util_1.default.promisify(require('child_process').exec);
/**
 * Invoked when requesting the generation of a Pokémon Crystal Item Randomizer seed.
 *
 * @remarks Generates a Pokémon Crystal Item Randomizer seed and sends it as a .bps patch.
 *
 * @param interaction - Interaction corresponding to the invoked command.
 * @param upr_mode - Relative path to the Universal Pokémon Randomizer preset.
 * @param itemrando_mode - Relative path to the Pokémon Crystal Item Randomizer preset.
 * @param name - Seed name.
 * @param spoiler - Whether to generate the spoiler logs for the seed.
 */
async function generate_itemrando(interaction, upr_mode, itemrando_mode, name, spoiler) {
    const tmp_dir = await exec('mktemp -d');
    const tmp_dir_name = tmp_dir['stdout'].trim();
    const spoiler_flag = spoiler ? '-l' : '';
    await exec(`java -jar universal-pokemon-randomizer-zx.jar cli -s ZXsettings/${upr_mode} -i ${config_json_1.SpeedchoicePath} -o "${tmp_dir_name}/${name}_UPR.gbc" ${spoiler_flag}`, { cwd: config_json_1.UPRPath });
    await exec(`"./Pokemon Crystal Item Randomizer" cli -i "${tmp_dir_name}/${name}_UPR.gbc" -o "${tmp_dir_name}/${name}.gbc" -m "./Modes/${itemrando_mode}" ${spoiler_flag}`, { cwd: config_json_1.ItemRandoPath });
    await exec(`./Flips --create --bps "${config_json_1.VanillaCrystalPath}" "${tmp_dir_name}/${name}.gbc" "${tmp_dir_name}/${name}.bps"`, { cwd: config_json_1.FlipsPath });
    if (spoiler) {
        await interaction.editReply({
            files: [
                `${tmp_dir_name}/${name}.bps`,
                { attachment: `${tmp_dir_name}/${name}_UPR.gbc.log`, name: `SPOILER_${name}_UPR.gbc.log` },
                { attachment: `${tmp_dir_name}/${name}.gbc_SPOILER.txt`, name: `SPOILER_${name}.gbc_SPOILER.txt` },
            ],
        });
    }
    else {
        await interaction.editReply({ files: [`${tmp_dir_name}/${name}.bps`] });
    }
    await exec(`rm -rf ${tmp_dir_name}`);
}
const crystal_rando = {
    data: new builders_1.SlashCommandBuilder()
        .setName('crystal-rando')
        .setDescription('Generate a Pokémon Crystal Item Randomizer seed.')
        .addStringOption((option) => option.setName('mode').setDescription('Game mode.').setRequired(true).addChoices({
        name: 'Maximum Shopsanity (2024 Tourney)',
        value: 'MaximumShopsanityRaceEdition.yml',
    }, {
        name: 'Extreme Full Item Randomizer (2023 Tourney)',
        value: 'TourneySettings/FullItemRandoTournament2023Stage1Extreme.yml',
    }, {
        name: 'Crazy Full Item Randomizer (2023 Tourney)',
        value: 'TourneySettings/FullItemRandoTournament2023Stage2Crazy.yml',
    }))
        .addStringOption((option) => option.setName('name').setDescription('Seed name.'))
        .addBooleanOption((option) => option.setName('spoiler').setDescription('Whether to generate spoiler logs for the seed.')),
    async execute(interaction) {
        await interaction.deferReply();
        const mode = interaction.options.getString('mode');
        const spoiler = interaction.options.getBoolean('spoiler') ?? false;
        let rom_name = interaction.options.getString('name') ??
            `${random_words_1.random_classes[Math.floor(Math.random() * random_words_1.random_classes.length)]}${random_words_1.random_names[Math.floor(Math.random() * random_words_1.random_names.length)]}`;
        rom_name = rom_name.substring(0, 50);
        await generate_itemrando(interaction, 'updatedstandard.rnqs', mode, rom_name, spoiler);
    },
};
exports.default = crystal_rando;
//# sourceMappingURL=crystal-rando.js.map
import { SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { Collection, SlashCommandBuilder } from 'discord.js';
import { Sequelize } from 'sequelize';

declare module 'discord.js' {
	export interface DiscordCommand {
		data:
			| SlashCommandBuilder
			| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
			| SlashCommandSubcommandsOnlyBuilder;
		execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	}

	export interface Client {
		db: Sequelize;
		commands: Collection<string, DiscordCommand>;
	}

	export interface DiscordEvent {
		name: keyof ClientEvents;
		once?: boolean;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		execute: (...args: any[]) => Promise<void>;
	}
}

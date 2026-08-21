import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('gmm')
        .setDescription('Hoelang het wachten tot Graspop is')
        .addSubcommand(subcommand =>
            subcommand
                .setName('countdown')
                .setDescription('Bekijk hoelang het nog duurt tot Graspop 2027')
        ),

    async execute(interaction) {
        if (
            !interaction.isChatInputCommand() ||
            interaction.commandName !== 'gmm' ||
            interaction.options.getSubcommand() !== 'countdown'
        ) {
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const now = Date.now();

            // 17 juni 2027 00:00 CEST
            // CEST = UTC+2
            // Dus: 16 juni 2027 22:00 UTC
            const target = Date.UTC(
                2027,
                5,
                16,
                22,
                0,
                0
            );

            const difference = target - now;

            if (difference <= 0) {
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('🎪 Graspop Countdown')
                    .setDescription(
                        '**17 juni 2027 om 00:00 CEST is bereikt!** 🎉'
                    )
                    .setTimestamp();

                await interaction.editReply({
                    embeds: [embed]
                });

                return;
            }

            const totalSeconds = Math.floor(difference / 1000);

            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const unixTimestamp = Math.floor(target / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🎪 Graspop Countdown')
                .setDescription([
                    '# ⏳ Hoelang nog wachten tot Graspop?',
                    '',
                    `**${days} dagen**`,
                    `**${hours} uur**`,
                    `**${minutes} minuten**`,
                    `**${seconds} seconden**`,
                    '',
                    '📅 **17 juni 2027**',
                    '🕛 **00:00 CEST**',
                    '',
                    `🗓️ <t:${unixTimestamp}:F>`,
                    `⏱️ <t:${unixTimestamp}:R>`
                ].join('\n'))
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('Failed to generate Graspop countdown:', error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: '❌ Er ging iets mis bij het genereren van de Graspop countdown.',
                    embeds: []
                });
            } else {
                await interaction.reply({
                    content: '❌ Er ging iets mis bij het genereren van de Graspop countdown.',
                    ephemeral: true
                });
            }
        }
    }
};

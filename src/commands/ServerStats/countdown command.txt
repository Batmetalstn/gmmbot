import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('gmm')
        .setDescription('GMM commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('countdown')
                .setDescription('Show the countdown until 20 June 2027 at 00:00 CEST')
        ),

    async execute(interaction) {
        // Controleer of dit /gmm countdown is
        if (
            !interaction.isChatInputCommand() ||
            interaction.commandName !== 'gmm' ||
            interaction.options.getSubcommand() !== 'countdown'
        ) {
            return;
        }

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {
            const now = Date.now();

            // 20 juni 2027 00:00 CEST
            // CEST = UTC+2
            // Dus: 19 juni 2027 22:00 UTC
            const target = Date.UTC(
                2027,
                5,
                19,
                22,
                0,
                0
            );

            const difference = target - now;

            // Countdown is voorbij
            if (difference <= 0) {
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('🎉 GMM Countdown')
                    .setDescription(
                        '**20 juni 2027 om 00:00 CEST is bereikt!** 🎉'
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

            // Discord Unix timestamp
            const unixTimestamp = Math.floor(target / 1000);

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🎪 GMM Countdown')
                .setDescription([
                    '# ⏳ Nog te gaan',
                    '',
                    `**${days} dagen**`,
                    `**${hours} uur**`,
                    `**${minutes} minuten**`,
                    `**${seconds} seconden**`,
                    '',
                    '📅 **20 juni 2027**',
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
            console.error('Failed to generate GMM countdown:', error);

            await interaction.editReply({
                content: '❌ Er ging iets mis bij het genereren van de GMM countdown.',
                embeds: []
            });
        }
    }
};

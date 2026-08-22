import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('gmm')
        .setDescription('Graspop Metal Meeting commands')
        .setDMPermission(false)

        .addSubcommand(subcommand =>
            subcommand
                .setName('countdown')
                .setDescription('Bekijk hoelang het nog duurt tot Graspop 2027')
        ),

    async execute(interaction) {
        // Discord laten weten dat de bot bezig is
        const deferred = await InteractionHelper.safeDefer(interaction);

        if (!deferred) {
            return;
        }

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand !== 'countdown') {
                return await InteractionHelper.safeEditReply(interaction, {
                    content: '❌ Onbekende subcommand.'
                });
            }

            const now = Date.now();

            // 17 juni 2027, 00:00 CEST
            // JavaScript: januari = 0, dus juni = 5
            const target = Date.UTC(
                2027,
                5,
                16,
                22,
                0,
                0
            );

            const difference = target - now;

            const unixTimestamp = Math.floor(target / 1000);

            // Als Graspop begonnen is
            if (difference <= 0) {
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('🎪 Graspop Countdown')
                    .setDescription([
                        '# 🎉 Graspop is begonnen!',
                        '',
                        '📅 **17 juni 2027**',
                        `🗓️ <t:${unixTimestamp}:F>`
                    ].join('\n'))
                    .setTimestamp();

                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });
            }

            // Tijd berekenen
            const totalSeconds = Math.floor(difference / 1000);

            const days = Math.floor(totalSeconds / 86400);

            const hours = Math.floor(
                (totalSeconds % 86400) / 3600
            );

            const minutes = Math.floor(
                (totalSeconds % 3600) / 60
            );

            const seconds = totalSeconds % 60;

            // Embed maken
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('🎪 Graspop Countdown')
                .setDescription([
                    '# ⏳ Hoelang nog wachten tot Graspop?',
                    '',
                    `📆 **${days} dagen**`,
                    `⏰ **${hours} uur**`,
                    `🕐 **${minutes} minuten**`,
                    `⚡ **${seconds} seconden**`,
                    '',
                    '━━━━━━━━━━━━━━━━━━',
                    '',
                    '📅 **Graspop 2027**',
                    '🕛 **17 juni 2027 om 00:00 CEST**',
                    '',
                    `🗓️ <t:${unixTimestamp}:F>`,
                    `⏱️ Begint <t:${unixTimestamp}:R>`
                ].join('\n'))
                .setTimestamp()
                .setFooter({
                    text: 'Graspop Metal Meeting 2027 🤘'
                });

            await InteractionHelper.safeEditReply(interaction, {
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                'Failed to generate Graspop countdown:',
                error
            );

            await InteractionHelper.safeEditReply(interaction, {
                content: '❌ Er ging iets mis bij het genereren van de Graspop countdown.',
                embeds: []
            });
        }
    }
};

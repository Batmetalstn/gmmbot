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
        // Controleer of de interactie nog geldig is
        if (!interaction || interaction.replied || interaction.deferred) return;

        // Veilig deferren om "Interaction failed" te voorkomen bij trage verbindingen
        let deferred = false;
        try {
            deferred = await InteractionHelper.safeDefer(interaction);
        } catch (deferError) {
            console.error('Defer mislukt, we proberen direct te antwoorden:', deferError);
        }

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand !== 'countdown') {
                if (deferred) {
                    return await InteractionHelper.safeEditReply(interaction, { content: '❌ Onbekende subcommand.' });
                } else {
                    return await interaction.reply({ content: '❌ Onbekende subcommand.', ephemeral: true });
                }
            }

            const now = Date.now();

            // 17 juni 2027, 00:00 CEST (Januari = 0, juni = 5)
            const target = Date.UTC(2027, 5, 16, 22, 0, 0);
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

                if (deferred) {
                    return await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
                } else {
                    return await interaction.reply({ embeds: [embed] });
                }
            }

            // Tijd berekenen
            const totalSeconds = Math.floor(difference / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
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

            if (deferred) {
                await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Failed to generate Graspop countdown:', error);

            if (deferred) {
                await InteractionHelper.safeEditReply(interaction, {
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

client.on('messageCreate', async message => {
    console.log('Bericht ontvangen:', message.content);

    if (message.author.bot) return;
    import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('gmm')
        .setDescription('Graspop Metal Meeting commands')

        .addSubcommand(subcommand =>
            subcommand
                .setName('countdown')
                .setDescription('Bekijk hoelang het nog duurt tot Graspop 2027')
        ),

    async execute(interaction) {
        console.log('GMM command uitgevoerd!');
        console.log('Command:', interaction.commandName);

        try {
            // Controleer of de juiste subcommand wordt gebruikt
            const subcommand = interaction.options.getSubcommand();

            console.log('Subcommand:', subcommand);

            if (subcommand !== 'countdown') {
                return await interaction.reply({
                    content: '❌ Onbekende subcommand.',
                    ephemeral: true
                });
            }

            // Discord laten weten dat de bot bezig is
            await interaction.deferReply();

            const now = Date.now();

            // Graspop 2027
            // 17 juni 2027, 00:00 CEST
            // JavaScript maanden beginnen bij 0
            // Juni = 5
            const target = Date.UTC(
                2027,
                5,
                16,
                22,
                0,
                0
            );

            const difference = target - now;

            // Unix timestamp voor Discord
            const unixTimestamp = Math.floor(target / 1000);

            // Als Graspop al begonnen is
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

                return await interaction.editReply({
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

            // Embed versturen
            await interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                'Failed to generate Graspop countdown:',
                error
            );

            // Foutmelding sturen
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: '❌ Er ging iets mis bij het genereren van de Graspop countdown.',
                    embeds: []
                });
            } else {
                await interaction.reply({
                    content: '❌ Er ging iets mis.',
                    ephemeral: true
                });
            }
            });
        }
    }
};

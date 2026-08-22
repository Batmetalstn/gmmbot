import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

/*
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "your_password",
            host: "your_host",
            port: 443,
            id: "Jirayu"
        }
    ],
    sendToShard: (guildId, payload) => {
        client.guilds.cache.get(guildId)?.shard.send(payload);
    }
});
*/

client.on('ready', async () => {
    console.log(`Bot is succesvol online als ${client.user.tag}`);
    
    // await client.lavalink.init(client.user.id);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: 'Er ging iets mis bij het uitvoeren van dit commando!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Er ging iets mis bij het uitvoeren van dit commando!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);

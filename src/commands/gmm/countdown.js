import { Client, GatewayIntentBits } from 'discord.js';
// import { LavalinkManager } from "lavalink-client"; // <-- Zet hier // voor

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

/* --- DIT HELE BLOK TIJDELIJK UITSCHAKELEN MET DEZE SLASHES ---
client.lavalink = new LavalinkManager({
    nodes: [
        {
            authorization: "...",
            host: "...",
            port: 443,
            id: "Jirayu"
        }
    ],
    sendToShard: (guildId, payload) => {
        client.guilds.cache.get(guildId)?.shard.send(payload);
    }
});
------------------------------------------------------------- */

client.on('ready', async () => {
    console.log(`Bot is online als ${client.user.tag}`);
    
    // Zorg dat de .init() of .start() van lavalink ook is uitgeschakeld:
    // await client.lavalink.init(client.user.id); 
});

client.login(process.env.TOKEN);

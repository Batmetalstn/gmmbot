import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

// Geef hier de map op waar al jouw commando-bestanden staan
const commandsPath = path.join(__dirname, 'commands');

// Leest alle bestanden en mappen in de commando-map
const readCommands = (dir) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            readCommands(filePath);
        } else if (file.endsWith('.js')) {
            // Importeer het commando dynamisch
            const commandUrl = new URL(`file://${filePath}`).href;
            import(commandUrl).then((module) => {
                const command = module.default;
                if (command && 'data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
            }).catch(err => console.error(`Fout bij laden van ${file}:`, err));
        }
    }
};

readCommands(commandsPath);

// Wacht heel even totdat alle bestanden asynchronously zijn ingeladen
setTimeout(async () => {
    const rest = new REST().setToken(process.env.TOKEN);

    try {
        console.log(`Begonnen met het herladen van ${commands.length} applicatie (/) commando's.`);

        // Registreer de commando's wereldwijd (kan tot een uur duren voor updates)
        // Of gebruik Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID) voor directe updates in 1 testserver
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Succesvol ${data.length} applicatie (/) commando's geregistreerd bij Discord!`);
    } catch (error) {
        console.error('Fout tijdens het deployen van commando\'s:', error);
    }
}, 1500);

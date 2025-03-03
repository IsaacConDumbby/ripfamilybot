import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    new SlashCommandBuilder()
        .setName('raid')
        .setDescription('spam a ton message')
        .addIntegerOption(option => 
            option.setName('number of message')
                .setDescription('number of messages')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('chat')
        .setDescription('send a single message')
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Registering commands...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands.map(cmd => cmd.toJSON()) });
        console.log('Commands registered!');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    if (interaction.commandName === 'spam') {
        const amount = interaction.options.getInteger('amount');
        for (let i = 0; i < amount; i++) {
            await interaction.channel.send('Spam message');
        }
        await interaction.reply({ content: `Sent ${amount} messages!`, ephemeral: true });
    }
    
    if (interaction.commandName === 'chat') {
        await interaction.reply('This is a single message!');
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

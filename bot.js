require('dotenv').config()
const { Client } = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Client();

const token = process.env.TOKEN_BOT;

bot.login(token);

bot.on('ready', () => {
  console.log('O BOT está online')
})

bot.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (msg.content.toLowerCase().startsWith('!songplay')) {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
      return msg.channel.send("Você precisa estar em um canal de áudio!")
    }

    const [command, song] = msg.content.split(' ');

    const { videoDetails } = await ytdl.getInfo(song)

    const stream = ytdl(videoDetails.video_url, {
      filter: 'audioonly'
    })


    const connection = await voiceChannel.join();

    connection.play(stream)
      .on('error', error => console.log(error))
      .on('finish', () => console.log('terminou'))

    return msg.channel.send(`Start playing: **${videoDetails.title}**`);
  }

  if (msg.content.toLowerCase().startsWith('!songpause')) {
    const voiceChannel = msg.member.voice.channel;

    if (!voiceChannel) {
      return msg.channel.send("Você precisa estar em um canal de áudio!")
    }

    const connection = await voiceChannel.join();

    connection.dispatcher.pause(true)
  }

  // if (msg.content.toLowerCase().startsWith('!songresume')) {
  //   const voiceChannel = msg.member.voice.channel;

  //   if (!voiceChannel) {
  //     return msg.channel.send("Você precisa estar em um canal de áudio!")
  //   }

  //   const connection = await voiceChannel.join();

  //   connection.dispatcher.resume()
  // }
})

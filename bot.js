
// Run dotenv
require('dotenv').config();
var fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
const puppeteer = require('puppeteer')

const { promisify } = require('util')
const sleep = promisify(setTimeout)

var lastNSFW;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('you type !help for help', { type: 'WATCHING' });
});

client.login(process.env.DISCORD_TOKEN);

async function getVisual() {
    try {
        const URL = 'https://scrolller.com/nsfw'
        const browser = await puppeteer.launch()
        const page = await browser.newPage()

        await page.setViewport({
            width: 640,
            height: 480,
            deviceScaleFactor: 1,
        });

        await page.goto(URL) 
        await page.click('#root > div > div.app-page > div.nsfw-warning > div.nsfw-warning__buttons > button.nsfw-warning__accept-button')
        await sleep(4000)
        await page.click('#root > div > div.app-page > main > div.vertical-view > div > div:nth-child(1) > div:nth-child(3) > a > img')
        await page.screenshot({ path: 'nsfw.png' })

        await browser.close()

        // if (fs.existsSync('nsfw.png')) {
        //     fs.unlinkSync('nsfw.png')
        // }

    } catch (error) {
        console.error(error)
    }
}

async function getStats(username, channel) {
    try {
        const URLS = 'https://r6.tracker.network/profile/pc/' + username
        const browserS = await puppeteer.launch()
        const pageS = await browserS.newPage()

        await pageS.setViewport({
            width: 640,
            height: 480,
            deviceScaleFactor: 1,
        });

        await pageS.goto(URLS)
        var linkTexts = await pageS.$$eval(".trn-defstat__value",elements=> elements.map(item=>item.textContent))
        //console.log(linkTexts)
        ret = linkTexts[linkTexts.length-2]
        ret2 = linkTexts[linkTexts.length-4]

        await browserS.close()

    } catch (error) {
        console.error(error)
    }
    channel.send(username + " is at " + ret + " elo. And is rank " + ret2 + ". Should probably do better")
    return ret
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

client.on('message', msg => {
    var mesText = msg.content;
    //console.log(mesText)
    //console.log(client.user.id)
    //console.log("id:" + msg.author.id)

    if (msg.author.id != '740049324305678357'){
    	var ran = getRandomInt(0,65);
    	if (ran === 1){
        	msg.channel.send('fuck you ' + msg.author.username);
        }
    }

    if(msg.content.length > 200 && msg.author.id != '740049324305678357'){
        msg.reply('too long, didnt read, didnt ask, fuck off');
    }

    if(msg.content.includes('<@!740049324305678357>')){
        msg.reply('dont @ me bitch, fuck you');
    }

    if(msg.author.id === '601473450934140929'){ //if user is grant
        var ran = getRandomInt(0,50);
        if (ran === 1){
            msg.channel.send('fuck you especially ' + msg.author.username);
        }
    }

    if (msg.content.toLowerCase() === '!fuck' && msg.author.id != '740049324305678357') {
        var fu = fs.readFile('phrases.txt', function(err, data){
            if(err) throw err;
            data = data.toString();
            var lines = data.split('\n');
            ret = lines[Math.floor(Math.random()*lines.length)];
            msg.reply(ret);
        })
    }

    if (msg.author.id === '163421810363334657' && msg.content.toLowerCase() === '!fucktest' && msg.author.id != '740049324305678357') {
        var fu = fs.readFile('phrases.txt', function(err, data){
            if(err) throw err;
            data = data.toString();
            var lines = data.split('\n');
            ret = lines[lines.length-1];
            msg.reply(ret);
        })
    }

    if (msg.content.toLowerCase() === '!nsfw' && msg.author.id != '740049324305678357') {
        //msg.channel.send("here you go you sick fuck: https://scrolller.com/nsfw");
        getVisual()
        temp = msg.channel.send("here you go you sick fuck: ", {files: ["nsfw.png"]}).then(sent => { // 'sent' is that message you just sent
            lastNSFW = sent.id;
        });
    }

    if (msg.content.toLowerCase() === '!-nsfw' && msg.author.id != '740049324305678357' && lastNSFW != -1) {
        msg.channel.messages.fetch(lastNSFW).then(msg => msg.delete());
        lastNSFW = -1;
    }

    if (msg.content.toLowerCase().includes('!fuckyou') && msg.content.toLowerCase().includes('<@') && msg.author.id != '740049324305678357') {
        var you = msg.content.substr(11,msg.content.length-1);
        msg.channel.send(msg.author.username + ' would like me to personally tell you: fuck you <@' + you + " :)");
    }

    if(msg.content.toLowerCase() === '!help' && msg.author.id != '740049324305678357'){
        msg.author.send("• use !add <insert phrase> (dont include the arrows) to add to my phrase book (must include the word fuck)" +
                        "\n• !fuck gets you a nice response " +
                        "\n• !serveradd provides the link to add this bot to your server!" + 
                        "\n• !nsfw give you a nsfw image (crazy i know), and is for sick fucks like my friend kealey that asked for this feature (do not spam this command due to the delay of getting the image)" +
                        "\n• !-nsfw deletes the last nsfw image sent in case you dont want to look at it anymore (bot requires admin privs)" +
                        "\n• !fuckyou followed by an @ lets you and the bot both say fuck you to that person!" +
                        "\n• !stats- followed by a Rainbow 6 Siege PC Username (i.e. !stats-SourceCode.-) returns the current rank and MMR of that account!" +
                        "\n• I take requests for features, dm SourceCode.- to submit one" 
                        );
    }

    if(msg.content.toLowerCase().includes("!add") && msg.author.id != '740049324305678357'){
        var cont = '\n'; 
        cont = cont + msg.content.substr(5,msg.content.length-1);
        var fu = fs.readFile('phrases.txt', function(err, data){
            if(err) throw err;
            data = data.toString();

            if(!msg.content.toLowerCase().includes("fuck")){
                msg.reply('im the fuck bot you idiot, i only you phrases with the word fuck');
            }

            else if(!data.includes(cont)){
                fs.appendFile('phrases.txt', cont, function(err){
                    if(err) throw err;
                    msg.reply('nice one, ill remember that');
                });
            }
            else msg.reply('maybe be unique next time you dumb fuck');
        })
    }

    if(msg.content.toLowerCase() === '!serveradd' && msg.author.id != '740049324305678357'){
        msg.channel.send("• click here to add this bot to your server -> https://discord.com/api/oauth2/authorize?client_id=740049324305678357&permissions=210944&scope=bot");
    }

    if(msg.author.id === '163421810363334657' && msg.content.toLowerCase() === '!restart'){
        process.exit();
    }

    if(msg.content.toLowerCase() === '!fick' && msg.author.id != '740049324305678357'){
        msg.reply("Nice spelling dumbass");
    }

    if(msg.content.toLowerCase() === '!admincheck' && msg.author.roles.some(r=>["Dev", "Mod", "Server Staff", "Proficient", "Admin", "Pussy Bitch Jk love you"].includes(r.name)) ){
        msg.reply("admins are cool");
    }

    if(msg.content.toLowerCase() === '!givemeprivs' && msg.author.id != '740049324305678357'){
        msg.guild.roles.create({ data: { name: 'Fuck Bot', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] } });
        const role = msg.guild.roles.cache.find(role => role.name === 'Fuck Bot');
        client.user.roles.add(role)
    }

    if(msg.content.toLowerCase().includes('!stats-') && msg.author.id != '740049324305678357'){
        var cont = '\n'; 
        cont = cont + msg.content.substr(7,msg.content.length-1);
        getStats(cont, msg.channel);
    }


});

const db = require("orio.db")
const config = require("../config.js");
module.exports = async (client) => {
let arr = true
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`Umut Bayraktar ♥ Vanity URL Sniper | v3.0.0`, { type: "WATCHING" });
    client.user.setStatus("online");
  
    const creq = require("request")
    db.delete("urlsniper")
  setInterval(async() => {
    if(db.get("urlsniper")){
      
    } else {
    if(config.status === "true") {
      if(client.guilds.cache.get(config.serverID)){
    if (client.guilds.cache.get(config.serverID).features.includes('VANITY_URL')) {
      if(config.url){
        if(client.guilds.cache.get(config.serverID).vanityURLCode === config.url){
          db.set("urlsniper", config.url)
          const csLOG = client.channels.cache.get(config.log)
          if(csLOG){
            csLOG.send({content: "<@"+config.authorID+">, **" + config.url + "** Named Custom URL Successfully Received and Bot Stopped Working!" })
            console.log(config.url +" Named Custom URL Successfully Received and Bot Stopped Working!")
          } else {
            console.log(config.url +" Named Custom URL Successfully Received and Bot Stopped Working!")
          }
        } else {
         client.fetchInvite(config.url).then(ub => {
          if(ub == "DiscordAPIError: Unknown Invite"){
  
          } else {
          console.log(`${config.url} Bot Launched To Get Vanity Discord Server URL Named!`)
          arr = false
           }
         }).catch(e => {})
        }
      } else {
        console.log('url in config.js File: Where It Says "" Please Enter Custom URL to Get!')
      }  
    } else {
      console.log("The bot could not be started because the server whose ID was entered is not a level 3 server!")
    }
      } else {
        console.log("Bot Failed to Start Because the Server whose ID was Entered Could Not Be Found!")
      }
    } else {
      console.log('Status in config.js File to Start Bot: Where It Says "false" You Need To Type true Instead Of False!');
    }
    }

        if(!arr === false){
       const url = {
        url: `https://discord.com/api/v10/guilds/${config.serverID}/vanity-url`,
        body: {
          code: `${config.url}`
        },
        json: true,
        method: 'patch',
        headers: {
          "Authorization": `Bot ${config.TOKEN}`
        }
      };
      creq(url, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
      })
        }
    
  }, config.botRun)
  
}

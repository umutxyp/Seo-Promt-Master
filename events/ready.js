const config = require("../config.js");
const ubreq = require("request")
var os = require('os');
const { clearInterval } = require("timers");
module.exports = async (client) => {

  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`Umut Bayraktar ♥ Vanity URL Sniper | v5.0.0`, { type: "WATCHING" });
  client.user.setStatus("online");

  function sender() {
    const csLOG = client.channels.cache.get(config.log)
    if (csLOG) {
      csLOG.send({ content: "<@" + config.authorID + ">, **" + config.url + "** Named Custom URL Successfully Received and Bot Stopped Working!" }).then(() => {
        console.log(config.url + " Named Custom URL Successfully Received and Bot Stopped Working!")
        process.exit(0)
      })
    } else {
      console.log(config.url + " Named Custom URL Successfully Received and Bot Stopped Working!")
      process.exit(0)
    }
  }

  async function sniper(serverID, url) {

    clearInterval(interval)

    ubreq.patch({
      url: `https://discord.com/api/v8/guilds/${serverID}/vanity-url`,
      headers: {
        "authorization": config.auth.discordAccountToken
      },
      json: { "code": url }
    }, (error, response, body) => {
      if (response.statusCode == 200) {
        sender()
      }
    })
  }


  function runner() {
    if (config.status === "true") {
      if (config.auth.discordAccountToken) {
        if (client.guilds.cache.get(config.serverID)) {
          if (client.guilds.cache.get(config.serverID).features.includes('VANITY_URL')) {
            if (config.url) {
              if (client.guilds.cache.get(config.serverID).vanityURLCode === config.url) {
                sender()
              } else {
                client.fetchInvite(config.url).then(ub => {
                }).catch(e => {
                  if (e?.message === "Unknown Invite") {
                    clearInterval(interval)
                    sniper(config.serverID, config.url)
                  }
                })
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
        console.log("Bot Failed to Start Because the Discord Account Token Entered is Invalid!")
      }
    } else {
      console.log('Status in config.js File to Start Bot: Where It Says "false" You Need To Type true Instead Of False!');
    }


  }

  const interval = setInterval(runner, config.botRun)

}

const config = {
  TOKEN: "", //write your discord bot token
  authorID: "", //write your discord account id.
  url: "", //Type the Custom Discord Server URL You Want to Retrieve!
  serverID: "", //Type the Server ID to Get the Url!
  log: "", //If the URL is taken, write the Log Channel ID to be informed!
  status: "", //false=Stop Bot | true=Means Start the Bot!
  botRun: "1000", //1000 = 1 Second | 1 = 1 Millisecond | It is recommended to write at least 50 milliseconds. Under 30MS, the project will be banned from the Discord API and will stop working!

  auth:{
    discordAccountToken: "" //Type a discord account token that is authorised on the discord server where you will receive the url.
  }
}

module.exports = config
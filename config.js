const config = {
  TOKEN: "", //write your discord bot token
  authorID: "", //write your discord account id.
  url: "", //Type the Custom Discord Server URL You Want to Retrieve!
  serverID: "", //Type the Server ID to Get the Url!
  log: "", //If the URL is taken, write the Log Channel ID to be informed!
  status: "true", //false=Stop Bot | true=Means Start the Bot!
  botRun: "10" //1000 = 1 Second | 1 = 1 Millisecond | It is recommended to write at least 50 milliseconds. Under 30MS, the project will be banned from the Discord API and will stop working!

}

module.exports = config
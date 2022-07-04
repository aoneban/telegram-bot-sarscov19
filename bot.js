require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const M = require('telegraf-markup4');
const COUNTRIES_LIST = require('./constant');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
const name = ctx.message.from.first_name;
if (name == undefined) {
  name = 'respect'
  return name
}
  ctx.reply(
    `
Hello ${name}!
Get statistics on coronavirus.
Enter country name.
The entire list of countries can be found by command /help
`,
    M.keyboard.reply([
      ['Belarus', 'Ukraine'],
      ['Poland', 'Germany'],
    ])
   } )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Died: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    console.log('Error');
    ctx.reply(
      'Error. There is no such country. To see the list of available countries click here /help'
    );
  }
});
bot.launch();
console.log('The bot is already running!');

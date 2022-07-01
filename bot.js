require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const M = require('telegraf-markup4');
const COUNTRIES_LIST = require('./constant');

const bot = new Telegraf(process.env.BOT_TOKEN);
const mName = ctx.message.from.first_name;

function myName (name) {
  if (name == undefined) {
    return 'уважаемый'
  } else {
    return ctx.message.from.first_name;
  }
}

bot.start((ctx) =>
  ctx.reply(
    `
Привет ${myName(mName)}!
Узнай статистику по коронавирусу.
Введи название страны.
Весь список стран можно узнать по команде /help
`,
M.keyboard.reply([
      ['Belarus', 'Ukraine'],
      ['Poland', 'Germany'],
    ])
  ));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))
bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Умерло: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
  } catch {
    console.log('Ошибка');
    ctx.reply('Ошибка. Нет такой страны. Чтобы увидеть список доступных стран нажмите здесь /help');
  }
});
bot.launch();
console.log('Бот уже запущен!');

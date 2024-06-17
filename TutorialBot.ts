import { Bot, InlineKeyboard } from "grammy";
import dotenv from "dotenv";
import { TokenProvider } from "./services/TokenProvider";
dotenv.config();

function runBot() {

  //Store bot screaming status
  let screaming = false;

  //Create a new bot
  const token = TokenProvider.getToken();


  if (token === undefined) {
    console.log("Invalid token, faliure");
    throw new Error("Invalid token, faliure");
  }

  try {

    const bot = new Bot(token);

    //This function handles the /scream command
    bot.command("scream", () => {
      screaming = true;
    });

    //This function handles /whisper command
    bot.command("whisper", () => {
      screaming = false;
    });

    //Pre-assign menu text
    const firstMenu = "<b>Menu 1</b>\n\nA beautiful menu with a shiny inline button.";
    const secondMenu = "<b>Menu 2</b>\n\nA better menu with even more shiny inline buttons.";

    const paymentMenu = "<b>Payment</b>\n\nWelcome to the web3 payment, hav fun .";

    //Pre-assign button text
    const nextButton = "Next";
    const backButton = "Back";
    const tutorialButton = "Tutorial";
    const paymentButton = "Payment";

    //Build keyboards
    const firstMenuMarkup = new InlineKeyboard().text(nextButton, nextButton);

    const secondMenuMarkup = new InlineKeyboard().text(backButton, backButton).text(tutorialButton, "https://core.telegram.org/bots/tutorial");

    const paymentMenuMarkup = new InlineKeyboard().text(paymentButton, paymentButton);
    //This handler sends a menu with the inline buttons we pre-assigned above
    bot.command("payment", async (ctx) => {
      await ctx.reply(paymentMenu, {
        parse_mode: "HTML",
        reply_markup: paymentMenuMarkup,
      });
    });

    //This handler processes payment button on the payment
    bot.callbackQuery(paymentButton, async (ctx) => {
      //Update message content with corresponding menu section
      await ctx.editMessageText(paymentButton, {
        reply_markup: paymentMenuMarkup,
        parse_mode: "HTML",
      });
    });


    //This handler sends a menu with the inline buttons we pre-assigned above
    bot.command("menu", async (ctx) => {
      await ctx.reply(firstMenu, {
        parse_mode: "HTML",
        reply_markup: firstMenuMarkup,
      });
    });


    //This handler processes back button on the menu
    bot.callbackQuery(backButton, async (ctx) => {
      //Update message content with corresponding menu section
      await ctx.editMessageText(firstMenu, {
        reply_markup: firstMenuMarkup,
        parse_mode: "HTML",
      });
    });

    //This handler processes next button on the menu
    bot.callbackQuery(nextButton, async (ctx) => {
      //Update message content with corresponding menu section
      await ctx.editMessageText(secondMenu, {
        reply_markup: secondMenuMarkup,
        parse_mode: "HTML",
      });
    });


    //This function would be added to the dispatcher as a handler for messages coming from the Bot API
    bot.on("message", async (ctx) => {
      //Print to console
      console.log(
        `${ctx.from.first_name} wrote ${"text" in ctx.message ? ctx.message.text : ""
        }`,
      );


      if (screaming && ctx.message.text) {
        //Scream the message
        await ctx.reply(ctx.message.text.toUpperCase(), {
          entities: ctx.message.entities,
        });
      } else {
        //This is equivalent to forwarding, without the sender's name
        const resMessage: string = "hello: " + ctx.message.text;
        await ctx.reply(resMessage, {
          entities: ctx.message.entities,
        })
        // await ctx.copyMessage(ctx.message.chat.id);
      }
    });

    //Start the Bot
    bot.start();

  } catch (err) {
    throw new Error("err");
  }
}

runBot();

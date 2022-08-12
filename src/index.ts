import axios from "axios";
import cheerio from "cheerio";
import { Deta } from "deta";
import * as dotenv from "dotenv";
import { Bot } from "grammy";
import { PspsData, PspsPostItem } from "./../types/index";

const url = "https://murzfeed-app.com";
const axiosInstance = axios.create();

dotenv.config();
const bot = new Bot(process.env.TELEGRAM_TOKEN);

axiosInstance
  .get(url)
  .then(async (response) => {
    const $ = cheerio.load(response.data);
    const pspsJson: PspsData = JSON.parse($("#__NEXT_DATA__").text());
    const allPosts = pspsJson.props.pageProps.posts.sort((first, second) => {
      return second.createdAt - first.createdAt;
    });

    const deta = Deta(process.env.DETA_BASE_TOKEN);
    const db = deta.Base("murzfeed");
    const { value } = await db.get("lastFeedId"); // get lastFeedId

    const posts: PspsPostItem[] = [];
    for (const post of allPosts) {
      if (post.murzFeedPostId == value) {
        break;
      }

      posts.push(post);
    }

    if (posts.length != 0) {
      // update lastFeedId
      db.put({
        key: "lastFeedId",
        value: posts[0].murzFeedPostId,
      });

      for (const post of posts) {
        // post to telegram
        bot.api.sendMessage(
          process.env.TELEGRAM_CHANNEL_ID,
          `${post.status}: *${post.teaTitle}*\n\n${post.teaContent}\n\nSrc: ${post.teaSource}\n\\[[Discussion](https://murzfeed-app.com/p/${post.murzFeedPostId})\\]`,
          {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }
        );
      }

      console.log(`${posts.length} data were posted`);
    }
  })
  .catch(console.error);

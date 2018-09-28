![_Tudubot logo](static/logo.svg)

# _Tudubot
A public to-do list you create by tweeting @_tudubot.

# Running locally
You'll need to have [Node.js](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/) installed on your computer. You'll also need a Twitter [developer account](https://developer.twitter.com/) associated with the account you want the bot to run on. Don't set up the bot to run on your own account or it will try to talk to everyone who replies to you.

Run `npm install` in a terminal window or command prompt to get the necessary packages.

Create a file called `.env` at the project root with the following format:

```
DATABASE_URL={local postgres database connection info}
DEBUG_DB={if true, all database queries will be logged}
NO_SSL_DB={if true, SSL will not be required when accessing the database}
TWITTER_CONSUMER_API={consumer API key associated with your Twitter developer account}
TWITTER_CONSUMER_SECRET={consumer secret key}
TWITTER_ACCESS_TOKEN={access token}
TWITTER_ACCESS_SECRET={access secret}
```

Use `npm run start` to run the bot or `npm run test` to run the tests.

Questions? I'm happy to help. You can tweet me [@isaacandsuch](https://twitter.com/isaacandsuch).

# Deploying to Heroku
_Tudubot is built to run on Heroku, so if you create a Heroku app with the Heroku Postgres add-on and add environment variables with your Twitter dev tokens, you should be able to run it without much trouble. You may need to turn off the "web" process and turn on the "worker" process under Resources.

# Contributing
Contributions are welcome, even if you're new to code or have never made an open-source contribution before! If you want to fix or upgrade the bot but aren't sure how, feel free to [open an issue](https://github.com/isaaclyman/tudubot/issues/new) and ask for pointers.

# License
[MIT License](https://opensource.org/licenses/MIT).
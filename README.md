![Tudubot logo](static/logo.svg)

# tudubot
A public to-do list you create by tweeting @_tudubot.

# Running locally
Run `npm install` to get the necessary packages.

You'll need a `.env` file at the project root with the following keys:

```
DATABASE_URL={local postgres database connection info}
DEBUG_DB={if true, all database queries will be logged}
NO_SSL_DB={if true, SSL will not be required when accessing the database}
TWITTER_CONSUMER_API={consumer API key associated with your Twitter developer account}
TWITTER_CONSUMER_SECRET={consumer secret key}
TWITTER_ACCESS_TOKEN={access token}
TWITTER_ACCESS_SECRET={access secret}
```

Use `npm run start` to run the bot and `npm run test` to run tests.
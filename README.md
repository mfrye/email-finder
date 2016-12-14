# Email Finder

![Email Finder Screenshot](https://email-finder.herokuapp.com/img/email-finder.png)

## Easily find any email address for free!

This project will enable you to look up the actual email address of any person. All you need is their name and website domain.

You can use this to find emails for free, or use it as the base to create your own email finding app.

Demo: [https://email-finder.herokuapp.com/](https://email-finder.herokuapp.com/)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

[![Vote on PH](http://thebigpicture.io/img/ph-vote.png)](https://www.producthunt.com/posts/open-source-email-finder)


## How it works
At a high level, it basically it takes the name / domain and tries various combinations to find the correct format. For every email combination it attempts to "send an email". As in it waits for a connection to be made, then if successful (the email exists), it then cuts the connection before any data is sent.

So the great thing is that this method is extremely accurate to find the real email, but the catch is that you are technically trying to send a real email. That means that after a large number of attempts, the email providers will usually blacklist your IP address.

The best way to get around this is to use a hosting service (like Heroku) where you can easily change your IP address. That's why the project has been setup to easily deploy to your own Heroku instance.

## Getting Started
- Fork or clone the project.
- Install the dependencies

```npm install```

- Start the app

```npm start```

- You can now navigate the app at [http://localhost:5000](http://localhost:5000)

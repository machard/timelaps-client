
![](http://www.machard.io/content/images/2015/05/tweetcam-1.png)

launch and access dev mode on http://localhost:5000

you need to create a .env.json file containing for example

```javascript
{
  "rabbitUrl" : "http://localhost:15674/stomp",
  "rabbitUser" : "guest",
  "rabbitPass" : "guest",
  "quadtreePrecision" : 8
}
```

then run 


```javascript
npm run dev
```

The app has been set up to be deployed using divshot, a nice static hosting service.
Edit divshot.json with appropriate credentials then run

```javascript
npm run build
divshot deploy
```

#Backend

To set up the backend, refer to this [repo](http://github.com/machard/timelaps-backend)

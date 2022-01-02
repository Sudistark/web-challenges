const express = require('express')
const session = require('express-session')
const fileupload = require('express-fileupload')
const path = require("path");


const app = express()
const flag = 'flag{can_you_leak_me_23}'


app.use( fileupload(),session({
  secret: 'some_random',
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: 'lax' }
}))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use((req,res,next)=>{
	res.setHeader('Content-Security-Policy',"script-src 'none' ;img-src 'none' ;media-src 'none' ;frame-ancestors 'none' ;frame-src 'none' ;object-src 'none' ;manifest-src 'none'")
	res.setHeader('X-Content-Type-Options','nosniff')
	res.setHeader('Cache-Control','no-cache, no-store')
	res.setHeader('X-Frame-Options','deny')
	next()
})

app.get('/',(req,res)=>{
if(!req.session.username){
		req.session.username = req.ip
		return res.redirect('/')
	}
	res.render('index')
})

app.post('/note',(req, res)=> {
	if(!req.session.username)
		return res.redirect('/')


const file = req.files.content;
  const path = __dirname + "/files/" + req.ip;

  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
  });
	return res.redirect('/')

});

app.get('/note',(req,res)=>{
	if(!req.session.username)
		return res.redirect('/')

res.type('text/plain')

	res.sendFile(path.join(__dirname, "/files/"+req.ip));
})

app.get('/search',(req,res)=>{
	if(!req.session.username){
		return res.redirect('/')
	}
	let q  = (req.query.q || '').toString().substr(0,40)
	res.type('text/plain')

	let foundNote = flag.startsWith(q)
	if(!foundNote)
		res.send('Not found')
	else
		res.sendFile(path.join(__dirname, "/files/"+req.ip));
})

app.get('/hack',(req,res)=>{
	if(!req.session.username)
		return res.redirect('/')

	res.send((req.query.x || ''))
})


app.listen(5566,()=>console.log("Listening... at 5566"))

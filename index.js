const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const Match = require('./models/match')
const Banner = require('./models/banner')
const Notify = require('./models/notify')
const Withdraw = require('./models/withdraw')
const User = require('./models/user')
const multer = require('multer');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');

// Set up Multer storage and options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});



const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://theinfinityofficials:MjDMBVPy57yY0Gh9@duoverse.4cm8ina.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')))

app.use(
	session({
		secret: 'your-secret-key',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: null }
	})
);

app.use((req, res, next) => {
	if (req.path === '/register') {
		return next();
	}

	if (req.session?.userId === 'dbsawmakmuzi') {
		return next();
	}

	res.redirect('/register');
});

app.get('/register',(req,res)=>{
    res.render('pages/register')
})

app.post('/register',(req,res)=>{
    const {password} = req.body
    req.session.userId = password;
    res.redirect('/')
})

const renderPage = (res, page, data) => res.render(`pages/${page}`, data)

app.get('/', async (req, res) => {
    const matches = await Match.find({});
    renderPage(res, 'index', { matches })
})
app.get('/banner', async (req, res) => {
    const matches = await Banner.find({});
    renderPage(res, 'banner', { matches })
})

app.get('/match', (req, res) => {
    renderPage(res, 'matches')
})
app.get('/cbanner', (req, res) => {
    renderPage(res, 'createbanner')
})

app.get('/ebanner/:id', async (req, res) => {
    const data = await Banner.findOne({ _id: req.params.id });
    console.log(data);
    renderPage(res, 'editbanner', { data })
})

app.post('/banner/:id', upload.single('coverPhoto'), async (req, res) => {
    const data = await Banner.findOne({ _id: req.params.id });
    console.log(req.file?.filename ? "yes" : 'no');
    if (req.file?.filename) {
        data.banner = req.file.filename
    }
    data.link = req.body.bannerLink
    await data.save()
    res.redirect('/banner')
})

app.get('/match/:id/', async (req, res) => {
    const data = await Match.findOne({ _id: req.params.id });
    renderPage(res, 'match', { data })
})

app.get('/del/:id/', async (req, res) => {
    await Banner.deleteOne({ _id: req.params.id })
    res.redirect('/banner')
})

app.post('/match', upload.single('coverPhoto'), async (req, res) => {
    const {
        category,
        subCategory,
        teamType,
        prizePool,
        perKill,
        entryFee,
        dated,
        time,
        totalSpots,
        spectateLink,
        matchId,
        matchPass
    } = req.body

    // const dateTimeStr = `${dated}T${time}`;
    // const sourceTimeZone = 'Asia/Kolkata';
    // const formattedDateTime = moment.tz(dateTimeStr, sourceTimeZone);

    // console.log(formattedDateTime.toDate());

    await new Match({
        matchUid: uuidv4(),
        category,
        subCategory,
        teamType,
        coverPhoto: req.file?.filename ? req.file.filename : '#',
        prizePool,
        perKill,
        entryFee,
        date : dated,
        totalSpots,
        spectateLink,
        matchId,
        matchPass
    }).save();

    res.redirect('/')
})

app.post('/banner', upload.single('coverPhoto'), async (req, res) => {
    const {
        bannerLink
    } = req.body

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    await new Banner({
        banner: req.file.filename,
        link: bannerLink
    }).save();

    res.redirect('/banner')
})

app.post('/match/:id', upload.single('coverPhoto'), async (req, res) => {
    const {
        category,
        subCategory,
        teamType,
        prizePool,
        perKill,
        entryFee,
        time,
        totalSpots,
        spectateLink,
        matchId,
        matchPass,
        status
    } = req.body


    await Match.findOneAndUpdate(
        { _id: req.params.id },
        {
            category,
            subCategory,
            teamType,
            prizePool,
            perKill,
            entryFee,
            totalSpots,
            spectateLink,
            matchId,
            matchPass,
            status
        },
        { new: true }
    );

    res.redirect('/')
})

app.get('/notify',async (req,res)=>{
    const matches = await Notify.find({});
    renderPage(res,'notification', {matches})
} )

app.post('/new/:type',async (req,res)=>{
    const {
        title,
        subtitle
    } = req.body
    const type = req.params.type

    await new Notify({
        title,
        subtitle,
        type
    }).save();

    res.redirect('/notify')
} )

app.get('/enotify/:id', async (req, res) => {
    const data = await Notify.findOne({ _id: req.params.id });
    renderPage(res, 'enotify', { data })
})

app.post('/notify/:id', async (req, res) => {
    const {
        title,subtitle
    }= req.body
    await Notify.findOneAndUpdate(
        { _id: req.params.id },
        {
            title,
            subtitle
        },
        { new: true }
    );

    res.redirect('/notify')
})

app.get('/cnotify',async (req,res)=>{
    renderPage(res,'cnotify', {type: undefined})
} )

app.get('/deln/:id/', async (req, res) => {
    await Notify.deleteOne({ _id: req.params.id })
    res.redirect('/notify')
})

app.get('/announce',(req,res)=>{
    renderPage(res, 'cnotify',{type:'notification'})
})

app.get('/users',async(req,res)=>{
    const matches = await User.find({});
    renderPage(res,'user', {matches})
})

app.get('/withdraw',async(req,res)=>{
    const matches = await Withdraw.find({});
    console.log(matches);
    renderPage(res,'withdraw', {matches})
})

app.post('/done/:id/:gid',async(req,res)=>{
    const user = await User.findOne({email : req.params.id});
    const withdraw = await Withdraw.findById(req.params.gid);
    const amount = withdraw.amount
    user.wallet.push({
        type: 'Withdrawal',
        date: new Date(),
        amt:amount,
    })
    await user.save()

    await Withdraw.deleteOne({ _id: req.params.gid })


    res.redirect('/withdraw')
})

app.get('/distribute/:id',async(req,res)=>{
    const existingUser = await Match.findOne({ _id: req.params.id });
    // console.log(existingUser.users);

    // console.log(matches);

   

    renderPage(res,'distribution', {existingUser})
})

app.post('/add/coins/:id',async(req,res)=>{
    const coins = req.body.coins
    const existingUser = await User.findOne({ email: req.params.id });

    existingUser.coins += +coins

    existingUser.save()

    res.redirect(`/users`)

})
app.post('/add/bonus:id',async(req,res)=>{
    const bonus = req.body.bonus
    const existingUser = await User.findOne({ email: req.params.id });

    existingUser.bonus += +bonus

    existingUser.save()

    res.redirect(`/users`)

})
app.post('/add/deposit/:id',async(req,res)=>{
    const deposit = req.body.deposit
    const existingUser = await User.findOne({ email: req.params.id });

    existingUser.deposit += +deposit

    existingUser.save()

    res.redirect(`/users`)

})

app.post('/user/:mid/:id',async(req,res)=>{
    const existingUser = await User.findOne({ email: req.params.id });
    const currMatch = await Match.findOne({matchUid : req.params.mid})

    const userIndex = currMatch.users.findIndex((user) => user.user === req.params.id);

  if (userIndex !== -1) {
    // Update the 'paid' field for the user with the matching email
    currMatch.users[userIndex].paid = 'paid'; // Assuming 'req.body.paid' contains the updated value
    currMatch.users[userIndex].score = +req.body.coins; // Assuming 'req.body.paid' contains the updated value

    // Save the updated Match document
    await currMatch.save();
  }
  
    const matchIndex = existingUser.matches.findIndex((user) => user.matchId === req.params.mid);

  if (matchIndex !== -1) {
    // Update the 'paid' field for the user with the matching email
    existingUser.matches[matchIndex].paid = 'paid'; // Assuming 'req.body.paid' contains the updated value

  }

  console.log(currMatch);
    existingUser.kills = existingUser.kills + +req.body.kills
    existingUser.coins = existingUser.coins + +req.body.coins
    existingUser.earnings = existingUser.earnings + +req.body.coins
    // currMatch.
    await existingUser.save()
    res.redirect(`/distribute/${currMatch._id}`)
})

const port = process.env.PORT || 3001;
app.listen(port, () => 
    console.log(`Server is running on http://localhost:${port}`));

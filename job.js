require("dotenv").config();
const cron = require("node-cron");
var async = require('async');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioTestNumber = '+18067794257';

const adjectives = [
    'wonderful', 'glorious', 'splendiferous', 'zestful',
    'magical', 'great', 'exotic', 'stunning', 'gregarious', 'euphoric',
    'smashing', 'incandescent', 'gleaming', 'radiant', 'lucent', 'vivacious', 'vivid', 'zippy'];
const noun = ['Gnome', 'Mermaid', 'Human', 'Queen', 'King', 'Yeti', 'Dragon', 'Phoenix'];

const recipients = [
    {name: 'Rebecca', phoneNumber: '+12155956395'}
];

function scheduler() {
    console.log("~~~~ begin ~~~~~");
    cron.schedule("* 40 23 * * *", ()=> {
        let counter = 0;
        async.eachSeries(recipients, (recipient, cb)=>{
            let compliment = generateCompliment(recipient.name);
            sendTextMessage(compliment, recipient.phoneNumber, cb);
            counter += 1;
        },
        function(err) {
            console.log('all done!!!');
            if (counter == recipients.length) {
                process.exit(0);
            }
        });
    });
}
  
function getRandomArrayItem(list) {
    return list[list.length * Math.random() | 0];
}

function generateCompliment(name) {
    let randAdj = getRandomArrayItem(adjectives);
    let randAdjSecond = getRandomArrayItem(adjectives);
    let randNoun = getRandomArrayItem(noun);
    let c = `
        Good morning, ${name}
        You are a ${randAdj} ${randNoun}.
        Make it a ${randAdjSecond} day!!
    `;
    return c;
}

function sendTextMessage(compliment, phoneNumber, cb) {
    client.messages
    .create({
        body: compliment,
        from: twilioTestNumber,
        to: phoneNumber
    })
    .then(message => {
        console.log("Message Id:", message.sid)
        cb();
    })
    .catch(err => {
        console.error("Error", err)
        cb(err);
    });
}
  
exports.scheduler = scheduler;
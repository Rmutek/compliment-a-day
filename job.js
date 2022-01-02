require("dotenv").config();
const cron = require("node-cron");
var async = require('async');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const twilioTestNumber = '+18067794257';
const d = new Date();
const DECEMBER = 11;

const adjectives = [
    'wonderful', 'glorious', 'splendiferous', 'zestful', 'seductive',
    'magical', 'great', 'exotic', 'stunning', 'gregarious', 'euphoric',
    'smashing', 'incandescent', 'gleaming', 'radiant', 'lucent', 'vivacious', 'vivid', 'zippy'];
const noun = ['Gnome', 'Mermaid', 'Human', 'Queen', 'King', 'Yeti', 'Dragon', 'Phoenix'];

const holidayAdjectives = [
    'wonderful', 'glorious', 'frosty', 'twinkling', 'festive', 'glowing', 'cheerful', 'sweet',
    'magical', 'joyous', 'jolly', 'stunning', 'warmhearted', 'lovely', 'snowy', 'miraculous',
    'cozy', 'incandescent', 'gleaming', 'radiant', 'angelic', 'vivacious', 'merry', 'glittering'];
const holidayNoun = ['Sugarplum Fairy', 'Yeti', 'Gingerbread Person', 'Snowman', 'Santa Clause', 'Elf', 'Reindeer',
'Narwhal', 'Polar Bear', 'Gingersnap', 'Nutcracker', 'Pixie', 'Snow Queen', 'Fruitcake', 'Sweetums', 'Sweetling'];

const recipients = [
    {name: 'George', phoneNumber: '+17737202250'},
    {name: 'Rebecca', phoneNumber: '+12155956395'}
];

function scheduler() {
    console.log("~~~~ begin ~~~~~");
    cron.schedule("0 0 14 * * *", ()=> {
        let counter = 0;
        async.eachLimit(recipients, 1, (recipient, cb)=>{
            let compliment = "";
            compliment = specialMessage(recipient.name);
            // if (d.getMonth() == DECEMBER) {
            //     compliment = generateHolidayCompliment(recipient.name);
            // } else if (recipient.name == 'George') { 
            //     compliment = specialMessage(recipient.name);
            // } else {
            //     compliment = generateCompliment(recipient.name);
            // }
            sendTextMessage(compliment, recipient.phoneNumber, cb);
            counter += 1;
        },
        function(err) {
            if (counter == recipients.length) {
                console.log('All done!!!');
            }
        });
    });
}

function specialMessage(name) {
    let m = `
        Best of the best mornings ${name},
        I cherish you for exactly who you are and who you contiune to become.
        Let's make 2022 our year!

        Yours always,
        Rebecca <3
    `;

    return m;
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

function generateHolidayCompliment(name) {
    let randAdj = getRandomArrayItem(holidayAdjectives);
    let randAdjSecond = getRandomArrayItem(holidayAdjectives);
    let randNoun = getRandomArrayItem(holidayNoun);
    let c = `
        Good morning, ${name}
        You are a ${randAdj} ${randNoun}.
        Make it a ${randAdjSecond} day!!
    `;
    return c;
}

function sendTextMessage(compliment, phoneNumber, cb) {
    console.log("Step 2");
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
import { getToken } from 'next-auth/jwt';
const {google} = require('googleapis');

const [secret,clientId,clientSecret,apiKey] = [
    process.env.SECRET, process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_APIKEY
];

export default async (req, res) => {
    const token = await getToken({ req, secret });
    let {access_token,id_token, refresh_token} = {...token};
    
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials({refresh_token : refresh_token});
   
    const calendar = google.calendar({version: 'v3', auth});

    const {projectID,date } = req.query;
    
   
    
    
    const event_res = await calendar.events.list(
        {calendarId :projectID,
        singleEvents : true,
        orderBy : 'startTime',
        timeZone: 'Asia/Seoul'},
     );
     console.log(event_res);
    const e_lists = event_res.data.items.map(e=>{
        console.log(e.start);
    }
    )
    const result = e_lists.filter((elem)=>elem!== 'no_event');
    console.log(result);
    res.send(result);
    
};
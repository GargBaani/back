import expresss from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express();
//data
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
// json
app.use(expresss.json({limit:'16kb'}))
//url se
app.use(expresss.urlencoded({   
        extended:true,
        limit:'16kb'}
))
// agr koi file ya iimg ko stoe krvana ha in our server-> toh we can make them stre in public
app.use(express.static('public'))
// for crud oper on cookies
app.use(cookieParser)
export {app}
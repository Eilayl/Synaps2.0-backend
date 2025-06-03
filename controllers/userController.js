const User = require('../models/User');

exports.signup = async(req, res) => {
    try{
        const { email, nickname, password, confirmPassword } = req.body;
        const isExist = await User.findOne({
        $or: [
            { email: email },
            { nickname: nickname }
        ]
        });

        if (isExist) {
        return res.status(409).send({ error: "השם או האימייל כבר קיימים במערכת" });
        }

        if(!nickname || !email || !password || !confirmPassword)
            return res.status(404).send({error: "חלק מהמידע לא תואם"})

        if(nickname.length < 4)
            return res.status(400).send({error: "כינוי קצר מדיי"})
        if(!email.includes("@")) 
            return res.status(400).send({error: "מייל לא חוקי"})
        if(password != confirmPassword)
            return res.status(400).send({error: "סיסמאות לא תואמות"})
        if(password.length < 6)
            return res.status(400).send({error: "הסיסמא חייבת להכיל לפחות 6 ספרות"})
        
         const newUser = new User({
            nickname,
            email,
            password,
        });

    // Save the user to the database
        await newUser.save();
        return res.send({message: "המשתמש נרשם בהצלחה"})
    }
    catch(err){
        return res.status(500).send({error: "Something went wrong!"});
    }
}

exports.signin = async (req, res) => {
    try{

        const {email, password} = req.body;
        
        if(!email|| !password)
            return res.status(404).send({error: "אחד או יותר מהשדות לא נרשמו"});
        
        const isExist = await User.findOne({email})
        
        if(!isExist) return res.status(400).send({error: "המשתמש לא קיים במערכת"});
        
        if(isExist && isExist.password === password){
            req.session.user = {id:isExist._id,  name: isExist.name, email: isExist.email};
            
            return res.send({message: "המשתמש נרשם בהצלחה"});
        }
        return res.status(400).send({error:"הסיסמא לא נכונה"})
    }   
    catch(error){
        return res.status(500).send({error: "Something went wrong" + error})
    }
}


exports.gettoolsbardata = async (req, res) => {
    try{
    if(!req.session)
            return res.status(404).send({error: "User not authenticated"});
        const userId= req.session.user.id;
        const user = await User.findOne({_id:userId})
        return res.send({message: {points: user.points, avatar:user.avatar || ''}});
    }
    catch(error){
        return res.status(500).send({error: "Something went wrong " + error})
    }
}
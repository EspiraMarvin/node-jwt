const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


//user schema
const userSchema = new mongoose.Schema({
   email: {
       type: String,
       required: [true, 'Please Enter an Email' ],
       unique: true,
       lowercase: true,
       validate: [isEmail, 'Please Enter a valid email']
   },
   password: {
       type: String,
       required: [true, 'Please Enter Password'],
       minlength: [6, 'Minimum password length is 6 characters']
   }
}, { timestamps: true });



// fire a fn before doc saved to db
//we can use this to harsh a password before saving to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
});


// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email')
};

// user model
const User = mongoose.model('user', userSchema);

module.exports = User;



/* just an example of mongoose hooks
//fire a func after doc saved to db
userSchema.post('save', function (doc, next) {
    console.log('new user was created', doc);
    next();
});*/

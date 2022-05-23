const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

//api/users/register
const registerUser = asyncHandler(async (req, res) => {
    // const user = await User.create({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password 
    // })
    // try{
    //     const newUser = await user.save()
    //     res.status(200).json(newUser)
    // }catch (error){
    //     res.status(500).json(error)
    // }
    const { name, email, password } = req.body

    if( !name || !email || !password ) {
        res.status(400)
        throw new Error('Please add all the fields')
    }

    //check if user exists 
    const userExits = await User.findOne({email})
    
    if(userExits){
        res.status(400)
        throw new Error('User already Exists')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedpassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)        
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//api/users/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //check for user email
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('User doesnot exist')
    }
    res.json({message: 'Login User'})
})

//api/users/me
const getUser = asyncHandler(async (req, res) => {
    const {_id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
    })
})

//Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


module.exports = { registerUser, loginUser, getUser }
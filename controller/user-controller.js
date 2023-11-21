const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error')
const bcryptjs = require('bcryptjs');
const { db } = require('../db.js')



const getUsers = (req, res, next) => {
    db.query('SELECT * FROM user', (err, results) => {
      if (err) {
        return next(new HttpError('Fetching users failed, please try again later.', 500));
      }
      res.json({ users: results });
    });
  };

  const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('請檢查是否都有填寫', 422);
    }

    
    const { name, email, password } = req.body;
    
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.log(err);
        return next(new HttpError('Signup failed, please try again later.', 500));
      }
  
      if (results.length > 0) {
        return next(new HttpError('email已經被使用過了', 422));
      }
  
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword
      };
  
      db.query('INSERT INTO user SET ?', newUser, (err) => {
        if (err) {
          console.log(err);
          return next(new HttpError('Signup failed, please try again later.', 500));
        }
  
        res.status(201).json({ user: newUser });
      });
    });
  };


  const login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new HttpError('請檢查是否都有填寫', 422);
    }
  
    console.log(req.body);
    const { email, password } = req.body;
  
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
      if (err) {
        return next(new HttpError('Login failed, please try again later.', 500));
      }
  
      if (results.length === 0) {
        return next(new HttpError('Invalid credentials, user does not exist.', 401));
      }
  
      const loggedInUser = results[0];
  
      const checkPassword = bcryptjs.compareSync(password, loggedInUser.password);
      if (!checkPassword) {
        return next(new HttpError('Invalid credentials, please check your email and password.', 401));
      }
  
      const token = jwt.sign({ id: loggedInUser.id }, "secretkey", { expiresIn: '1h' });
  
      const { password: userPassword, ...others } = loggedInUser;
  
      res.cookie("accessToken", token, {
        httpOnly: true,
      }).status(200).json({ user: others, token });
    });
  };
  

  

exports.getUsers = getUsers
exports.login = login
exports.signup = signup
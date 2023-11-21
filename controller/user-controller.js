const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const HttpError = require('../model/http-error')
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
        password
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
  
    const { email, password } = req.body;
  
    db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, results) => {
      if (err) {
        return next(new HttpError('Login failed, please try again later.', 500));
      }
  
      if (results.length === 0) {
        return next(new HttpError('Invalid credentials, please check your email and password.', 401));
      }
  
      // 登入成功，可以根據需要返回用戶信息或其他數據
      const loggedInUser = results[0];
      res.status(200).json({ user: loggedInUser, message:"is login" });
    });
  };

exports.getUsers = getUsers
exports.login = login
exports.signup = signup
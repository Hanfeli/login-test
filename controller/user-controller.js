const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const HttpError = require('../model/http-error')
const bcryptjs = require('bcryptjs');
const { db } = require('../db.js')

const log4js = require('log4js');

log4js.configure({
  appenders: {
    file: { type: 'file', filename: 'logs/app.log' },
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'info' },
    error: { appenders: ['file', 'console'], level: 'error' }
  }
});

const logger = log4js.getLogger();


const getUsers = (req, res, next) => {
  logger.info('API/Function 開始');
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      logger.error(err)
      return next(new HttpError('Fetching users failed, please try again later.', 500));
    }
    logger.info(`User value ${results.name}`);
    res.json({ users: results });
  });
  logger.info('API/Function 結束');
  };

  const signup = (req, res, next) => {
    logger.info('API/Function 開始');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Please check if all fields are filled in.')
      throw new HttpError('Please check if all fields are filled in.', 422);
    }

    
    const { name, email, password } = req.body;
    
    const salt = bcryptjs.genSaltSync(10)
    const hashedPassword = bcryptjs.hashSync(password, salt)

    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
      if (err) {
        logger.error(err)
        return next(new HttpError('Signup failed, please try again later.', 500));
      }
  
      if (results.length > 0) {
        logger.error('Email has already been used', 422)
        return next(new HttpError('Email has already been used', 422));
      }
  
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword
      };
  
      db.query('INSERT INTO user SET ?', newUser, (err) => {
        if (err) {
          logger.error(err)
          return next(new HttpError('Signup failed, please try again later.', 500));
        }
        logger.info(`newUser value ${newUser}`);
        res.status(201).json({ user: newUser });
      });
    });
    logger.info('API/Function 結束');
  };


  const login = (req, res, next) => {
    logger.info('API/Function 開始');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Please check if all fields are filled in')
      throw new HttpError('Please check if all fields are filled in', 422);
    }
  
    const { email, password } = req.body;
  
    db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
      if (err) {
        logger.error(err)
        return next(new HttpError('Login failed, please try again later.', 500));
      }
  
      if (results.length === 0) {
        logger.error('Invalid credentials, user does not exist.')
        return next(new HttpError('Invalid credentials, user does not exist.', 401));
      }
  
      const loggedInUser = results[0];
  
      const checkPassword = bcryptjs.compareSync(password, loggedInUser.password);
      if (!checkPassword) {
        logger.error('Invalid credentials, please check your email and password.')
        return next(new HttpError('Invalid credentials, please check your email and password.', 401));
      }
  
      const token = jwt.sign({ id: loggedInUser.id, name:loggedInUser.name, email: loggedInUser.email, }, "secretkey", { expiresIn: '1h' });
  
      const { password: userPassword, ...others } = loggedInUser;
      
      logger.info(`newUser TOKEN ${token}`);
      res.cookie("accessToken", token, {
        httpOnly: true,
      }).status(200).json({ user: others, token });
    });
    logger.info('API/Function 結束');
  };

  const logout = (req, res, next) => {
    logger.info('API/Function 開始');
    const userName = req.userData.name
    const userEmail = req.userData.email

    res.clearCookie('accessToken')
    logger.info(`newUser TOKEN ${userName}`);
    res.status(200).json({ message: `成功登出，使用者 name: ${userName}, Email: ${userEmail}` });
    logger.info('API/Function 結束');
  }

  

  

exports.getUsers = getUsers
exports.login = login
exports.signup = signup
exports.logout = logout
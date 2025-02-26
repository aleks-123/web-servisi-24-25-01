const User = require('../pkg/user/userSchema');
//! npm install jsonwebtoken
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // const token = jwt.sign(
    //   { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: process.env.JWT_EXPIRES,
    //   }
    // );

    // res.cookie('jwt', token, {
    //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
    //   secure: false,
    //   httpOnly: true,
    // });

    res.status(201).json({
      status: 'Success',
      // token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    //!1 . Proveruvame dali korisnikot ima vneseno email ili password
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Please provide email or password!');
    }

    //!2. Proveruvame dali korisnikot posti
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    //!3. Sporeduvame passvordite
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    //!4. Se generira token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    //!5. Se generira i isprakja cookie
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
      secure: false,
      httpOnly: true,
    });

    //!6. Se isprkja tokenot
    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(500).send('You are not logged in! please log in');
    }

    // function verifyToken(token) {
    //   return new Promise((resolve, reject) => {
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //       if (err) {
    //         reject(new Error('Token verification failed'));
    //       } else {
    //         resolve(decodedToken);
    //       }
    //     });
    //   });
    // }
    // const tokenDecoded = await verifyToken(token);
    // console.log(tokenDecoded);
    // const verifyAsync = promisify(jwt.verify);
    // const decoded = await verifyAsync(token, process.env.JWT_SECRET);

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const userTrue = await User.findById(decoded.id);
    if (!userTrue) {
      return res.status(401).send('User doesnt longer exist!');
    }

    req.auth = userTrue;

    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

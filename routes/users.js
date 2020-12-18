const express = require ('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
//const config = require('config');
const keys = require("../config/keys");

const validateRegisterInput = require("../validations/register"); //New 
const validateLoginInput = require("../validations/login"); //New

const User = require('../models/user');


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// @desc Register user
// @access Public
router.post("/signup", (req, res) => {
  // Form validationconst { errors, isValid } = validateRegisterInput(req.body);// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        //name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @desc Login user and return JWT token
// @access Public
router.post("/signin", (req, res) => {
  // Form validationconst { errors, isValid } = validateLoginInput(req.body);// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id
          //name: user.name
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get('/', async (req, res) => {
  const users = await User.find().sort('email');
  res.send(users);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const users = await User.findByIdAndRemove(req.params.id);

  if (!users) return res.status(404).send('The user with the given ID was not found.');

  res.send(users);
});

module.exports = router;
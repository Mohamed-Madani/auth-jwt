const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const secret = require("../.env");

//mock users
let users = [
  {
    email: "test@gmail.com",
    password: "123456",
  },
];

router.post(
  "/signup",
  [
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password that is greater than 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    //Validate the email and password
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check if the email already exists
    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: "this user already exists",
          },
        ],
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    //Create a token
    const token = await JWT.sign(email, secret);
    return res.json({ token });

  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //Check if the user exists
  let user = users.find((user) => {
    return user.email === email
  });

  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "invalid email or password",
        },
      ],
    });
  }

  //Check if the password is correct
  let isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      errors: [
        {
          msg: "invalid email or password",
        },
      ],
    });
  }

  //Create a token
  const token = await JWT.sign(email, secret);
  return res.json({ token });

}); 

//Get all users
router.get("/users", async (req, res) => {
  res.send(users);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const SocialController = require('../controllers/social');


router.get("/",(req, res, next) => {
    res.status(200).json({"message":"social root route is not available"});
  });

router.get("/users", authenticate, SocialController.get_all_users);

router.get("/users/:userId",authenticate, SocialController.get_user);

router.get("/friends/:userId", authenticate, SocialController.get_all_friends);

router.get("/foff/:userId", authenticate, SocialController.get_friends_of_friends);


module.exports = router;
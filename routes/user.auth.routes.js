const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/authMiddleware.js");
const {
  registerPhoneOTP,
  registerPhoneOTPVerify,
  loginPhoneOTP,
  loginPhoneOTPVerify,
  loginPhonePasskey,
  logout,
  Userprofile,
} = require("../controllers/user.auth.controller.js");

// ROUTES      --REGISTER/LOGIN/LOGOUT--

/**
 *  REGISTER
 */
// SEND OTP           ROUTE -> /user/auth/rgister/phone-otp
router.post("/register/phone-otp", registerPhoneOTP);
// VERIFY OTP         ROUTE -> /user/auth/rgister/phone-otp-verify
router.post("/register/phone-otp-verify", registerPhoneOTPVerify);

/**
 *  LOGIN
 */
// SEND OTP           ROUTE -> /user/auth/login/phone-otp
router.post("/login/phone-otp", loginPhoneOTP);
// VERIFY OTP         ROUTE -> /user/auth/login/phone-otp-verify
router.post("/login/phone-otp-verify", loginPhoneOTPVerify);
// LOGIN PASSKEY      ROUTE -> /user/auth/login/passkey
router.post("/login/passkey", loginPhonePasskey);

router.get('/current-user',isAuth,Userprofile)
/**
 *  LOGOUT
 */
// logout            ROUTE -> /user/auth/logout
router.get("/logout", isAuth, logout);

module.exports = router;

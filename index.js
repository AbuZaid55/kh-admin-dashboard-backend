require("dotenv").config();
const express = require("express");
const cors = require("cors")
const { apiKeyMiddleware } = require("./middlewares/apiKey");
const { dbConnect } = require("./config/dbConnect");

const userProfileRouter=require("./routes/user.profile.routes.js");
const userRouter=require("./routes/user.auth.routes.js");
const adminAuthRouter = require("./routes/admin.auth.routes.js");
const testimonialRoutes = require('./routes/testimonial.routes.js');
const pressReleaseRoutes = require('./routes/pressRelease.routes');
const storeEshopRouter = require("./routes/store-eshop.routes.js")
const eshopBenefitsRoutes = require("./routes/eshopBenefits.routes");

const errorMiddleware = require("./middlewares/error.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : [];

// database and redis
dbConnect().then().catch(err=>console.log(err));

// Middleware
// app.use(apiKeyMiddleware);
app.use(express.json());
app.use(cookieParser());

// database
dbConnect().then().catch(err=>console.log(err));
async function createAdmin(phone, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the provided password

    const admin = new User({
        phone,
        email,
        phone_verified: true,
        email_verified: true,
        password: hashedPassword,
        roles: ["Admin"]
    });

    await admin.save();
    console.log(`Admin created with email: ${email} and phone: ${phone}`);
}



// Example usage
// createAdmin("+911234567890", "example@rittzdigital.com","rittzdigital92").catch(err => console.log(err));

// USER AUTH API 
app.use(cors({
    origin:"*",
    credentials:true
}))

app.get("/test",(req,res)=>{
    res.status(200).json({message:"Success"})
})
app.use("/user/auth",userRouter);
app.use("/user/profile/",userProfileRouter);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/store/eshop', storeEshopRouter);


// app.use("/admin/auth", adminAuthRouter);
app.use("/api/testimonials", testimonialRoutes);
app.use("/eshopBenefits", eshopBenefitsRoutes);


// Not Found Route & Error Middleware 
app.use("*",(req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

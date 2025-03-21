require("dotenv").config();
const express = require("express");
const cors = require("cors")
const { apiKeyMiddleware } = require("./middlewares/apiKey");
const { dbConnect } = require("./config/dbConnect");

const userProfileRouter=require("./routes/user.profile.routes.js");
const userRouter=require("./routes/user.auth.routes.js");
const adminAuthRouter = require("./routes/admin.auth.routes.js");
const pressReleaseRoutes = require('./routes/pressRelease.routes');
const storeEshopRouter = require("./routes/store-eshop.routes.js");


const commonCustomizationRoutes= require("./routes/common-customization.routes.js");
const khwaahishCustomizationRoutes= require("./routes/khw-customization.routes.js");
const maw_homepageCustomizationRouter = require("./routes/maw_homepage-customization.routes.js");
const eshopCustomizationRoutes=require("./routes/eshop-customization.routes.js");

const cartRoutes = require("./routes/cart.routes.js");
const orderRoutes = require("./routes/order.routes.js");

const qoh_HomepageCustomizationRouter = require("./routes/qoh_homepage-customization.routes.js");
const collectionHomepageCustomizationRouter = require("./routes/collection_homepage-customization.routes.js");

const storeKhwRouter = require("./routes/store-khw.routes.js")
// const eshopBenefitsRoutes = require("./routes/eshopBenefits.routes");

const errorMiddleware = require("./middlewares/error.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
const { isAuth } = require("./middlewares/authMiddleware.js");

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
// createAdmin("actualadminPhone", "actualAdminEmail","DummyPass").catch(err => console.log(err));


app.get("/test",(req,res)=>{
    res.status(200).json({message:"Server is running successfully"})
})

// USER AUTH API 
app.use(cors({
    origin:[...ALLOWED_ORIGINS],
    credentials:true
}))
app.use("/user/auth",userRouter);
app.use("/user/profile/",userProfileRouter);
app.use('/api/press-releases', pressReleaseRoutes);
app.use('/store/eshop', storeEshopRouter);
app.use('/store/khw', storeKhwRouter);

// Cart Routes
app.use('/api/v1/carts',isAuth,cartRoutes);


app.use("/admin/auth",isAuth, adminAuthRouter);


// Customization
app.use("/eshop/customization/",eshopCustomizationRoutes);
app.use("/common/customization/", commonCustomizationRoutes);

// app.use("/api/testimonials", testimonialRoutes);
// app.use("/eshopBenefits", eshopBenefitsRoutes);

// QOH Homepage Customization Routes
app.use("/api/v1/qoh-homepage/customization", qoh_HomepageCustomizationRouter);

// Collection Homepage Customization Routes
app.use("/api/v1/collection-homepage/customization", collectionHomepageCustomizationRouter);

// Customization khwaahish 
app.use("/khwaahish/customization/homepage",khwaahishCustomizationRoutes);

// MAW Homepage Customization Routes
app.use("/api/v1/maw-homepage/customization", maw_homepageCustomizationRouter);

// Order Routes
app.use("/api/v1/orders", orderRoutes);

// Not Found Route & Error Middleware 
app.use("*",(req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

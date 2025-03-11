require("dotenv").config();
const express = require("express");
const cors = require("cors")
const { apiKeyMiddleware } = require("./middlewares/apiKey");
const { dbConnect } = require("./config/dbConnect");

const userProfileRouter=require("./routes/user.profile.routes.js");
const userRouter=require("./routes/user.auth.routes.js");
const adminAuthRouter = require("./routes/admin.auth.routes.js");
const pressReleaseRoutes = require('./routes/pressRelease.routes');
const storeEshopRouter = require("./routes/store-eshop.routes.js")

const commonCustomizationRoutes= require("./routes/common-customization.routes.js");
const khwaahishCustomizationRoutes= require("./routes/khw-customization.routes.js");

const storeKhwRouter = require("./routes/store-khw.routes.js");

const eshopCustomizationRoutes=require("./routes/eshop-customization.routes.js");


const qoh_HomepageCustomizationRouter = require("./routes/qoh_homepage-customization.routes.js");
const collectionHomepageCustomizationRouter = require("./routes/collection_homepage-customization.routes.js");

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


// Increase Express request timeout to 10 minutes
// app.use((req, res, next) => {
//     req.setTimeout(600000); // ⏳ 10-minute timeout for incoming requests
//     res.setTimeout(600000); // ⏳ 10-minute timeout for responses
//     next();
// });

app.use((req, res, next) => {
    req.setTimeout(600000); // ⏳ 10-minute timeout for incoming requests
    res.setTimeout(600000); // ⏳ 10-minute timeout for responses
    next();
});

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
app.use('/store/khw', storeKhwRouter);


// app.use("/admin/auth", adminAuthRouter);


// Customization
app.use("/eshop/customization/",eshopCustomizationRoutes);
app.use("/common/customization/", commonCustomizationRoutes);
// app.use("/admin/auth", adminAuthRouter);
// app.use("/api/testimonials", testimonialRoutes);

// Customization
app.use("/eshop/customization/",eshopCustomizationRoutes);
// app.use("/eshopBenefits", eshopBenefitsRoutes);

// QOH Homepage Customization Routes
app.use("/api/v1/qoh-homepage/customization", qoh_HomepageCustomizationRouter);

// Collection Homepage Customization Routes
app.use("/api/v1/collection-homepage/customization", collectionHomepageCustomizationRouter);

// Customization khwaahish 
app.use("/khwaahish/customization/homepage",khwaahishCustomizationRoutes);

// Not Found Route & Error Middleware 
app.use("*",(req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

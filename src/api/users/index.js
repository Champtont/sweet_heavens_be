import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { adminOnlyMiddleware } from "../../lib/adminAuth.js";
import { JWTAuthMiddleware } from "../../lib/jwtAuth.js";
import { createAccessToken } from "../../lib/tools.js";
import UsersModel from "./model.js";

const usersRouter = express.Router();

//***USER ENDPOINTS*** */
//Register

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    if ({ _id }) {
      const payload = { _id: newUser._id, role: newUser.role };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    }
  } catch (error) {
    next(error);
  }
});

//Google Endpoints

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
  "/googleRedirect",
  passport.authenticate("google", { session: false }),
  async (req, res, next) => {
    console.log(req.user);
    res.redirect(`${process.env.FE_URL}/${req.user.accessToken}`);
  }
);

//Login

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };

      const accessToken = await createAccessToken(payload);
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

//Logout

usersRouter.get("/logout", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.clearCookie("jwt");
    await user.save();
    res.status(200).send({ message: "You're logged out" });
  } catch (error) {
    next(error);
  }
});

//Get my info

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id)
      .populate([
        {
          path: "calendar",
          model: "Menu",
          populate: { path: "recipes", model: "Recipe" },
        },
      ])
      .populate("recipeBook")
      .populate([
        {
          path: "shoppingMenus",
          populate: { path: "recipes", model: "Recipe" },
        },
      ])
      .populate([
        {
          path: "favorites",
          model: "Recipe",
        },
      ]);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

//Edit my info

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createError(404, `User with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//Edit my profile pic

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "ReciGaurd_profiles",
    },
  }),
}).single("avatar");

usersRouter.post(
  "/me/avatar",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { avatar: req.file.path },
        { new: true }
      );
      if (!user)
        next(createError(404, `No user wtih the id of ${req.user._id}`));
      res.status(201).send(user);
    } catch (error) {
      res.send(error);
      next(error);
    }
  }
);

//****Item Endpoints */
//Post to cart - this will add or push items to cart
//Get my cart
//edit my cart
//delete my cart

//Post a favorite

usersRouter.post("/favorites", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const favoriteToInsert = req.body;
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      { $push: { favorites: favoriteToInsert } },
      { new: true, runValidators: true }
    );
    if (favoriteToInsert && updatedUser) {
      res.send(updatedUser);
    }
  } catch (error) {
    res.send(error);
    next(error);
  }
});

//delete a favorite

usersRouter.delete(
  "/favorite/:itemId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { favorites: req.params.itemId } },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(
            404,
            `Item with id ${req.params.itemId} was not found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default usersRouter;

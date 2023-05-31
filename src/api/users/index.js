import express from "express";
import createHttpError from "http-errors";
import passport from "passport";
import q2m from "query-to-mongo";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { adminOnlyMiddleware } from "../../lib/auth/adminAuth.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { createAccessToken } from "../../lib/auth/tools.js";
import UsersModel from "./model.js";

//***USER ENDPOINTS*** */
//Register
//Google Endpoints
//Login
//Logout
//Get my info
//Edit my info
//Edit my profile pic
//****Item Endpoints */
//Post to cart - this will add or push items to cart
//Get my cart
//edit my cart
//delete my cart
//Post a favorite
//delete a favorite

import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminAuth.js";
import ItemsModel from "./model.js";

//***Admin Only***
//Post an Item
//Edit an Item
//Delete an Item
//***All users***
//Get All Items
//Get single Item

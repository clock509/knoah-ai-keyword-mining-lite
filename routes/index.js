import { Router } from "express";
import { searchRouter } from './searchRouter.js';


export const router = Router();
router.use('/search', searchRouter);



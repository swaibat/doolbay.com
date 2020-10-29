import express from 'express';
import User from '../controller/user.controller';
import Middleware from '../middleware';

const app = express.Router();

app.get(
  '/auth/github/login',
  Middleware.createAccessToken,
  Middleware.getAccessToken,
  User.signup
);

export default app;

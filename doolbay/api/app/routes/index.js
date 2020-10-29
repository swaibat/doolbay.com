import express from 'express';
import User from '../controller/user.controller';
import Middleware from '../middleware';

const app = express.Router();

app.get(
  '/users/auth/github/login',
  Middleware.createAccessToken,
  Middleware.getAccessToken,
  Middleware.checkIfUserFollowsMe,
  Middleware.getUser,
  User.signup
);

export default app;
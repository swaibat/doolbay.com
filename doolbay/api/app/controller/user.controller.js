/* eslint-disable camelcase */
import helpers from '../helpers';
import db from '../database/models';

const User = {
  async signup(req, res) {
    const {
      login,
      password,
      email,
      location,
      avatar_url,
      company,
      twitter_username,
      follows_me,
    } = req.user;
    const user = await db.User.create({
      email,
      password: helpers.hashPassword(password),
      username: login,
      location,
      avatar_url,
      company,
      twitter_username,
      follows_me,
    });
    delete user.dataValues.password;
    res
      .status(201)
      .send({
        status: 201,
        message: 'registration successful',
        data: user.dataValues,
      });
  },

  async login(req, res) {
    const data = helpers.createToken(req.user);
    res.status(200).send({ status: 200, message: 'login successful', data });
  },
};

export default User;

import { request } from '@octokit/request';
import superagent from 'superagent';
import db from '../database/models';
import helpers from '../helpers';

const UserMiddleware = {

  async getUser(req, res, next) {
    const user = await db.User.findOne({ where: { email: req.body.email }, raw: true });
    user
      ? res.status(409).send({ status: 409, message: 'user with email already exists' })
      : next();
  },

  async checkUserExist(req, res, next) {
    const user = await db.User.findOne({ where: { email: req.body.email }, raw: true });
    const password = user && helpers.comparePassword(req.body.password, user.password);
    if (!password) {
      return res.status(400).send({ status: 400, message: 'invalid login details' });
    }
    delete user.password;
    req.user = user;
    return next();
  },

  async createAccessToken(req, res, next) {
    if (req.query.code) {
      superagent
        .post('https://github.com/login/oauth/access_token')
        .send({
          client_id: '905e1189617d542b8d53',
          client_secret: '413b3fdde0dd28592054e65b42f279643992c146',
          code: req.query.code,
        })
        .set('accept', 'application/json')
        .then((response) => {
          req.body = response.body;
          next();
        })
        .catch(console.error);
    } else {
      res.send('hello');
    }
  },

  async getAccessToken(req, res, next) {
    //   res.send(req.body.access_token);
    const result = await request('GET https://api.github.com/user', {
      headers: {
        authorization: `token ${req.body.access_token}`,
      },
      org: 'octokit',
      type: 'private',
    });
    req.user = result.data;
    next();
  },

};


export default UserMiddleware;

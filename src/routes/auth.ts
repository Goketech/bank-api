import express from 'express';
import { register, login } from '../controllers';
import { validateRegister, validateLogin } from '../middleware';

const auth = express.Router();

auth.post('/register', validateRegister, register);
auth.post('/login', validateLogin, login);

export { auth };

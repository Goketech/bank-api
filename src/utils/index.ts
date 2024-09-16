import rateLimit from 'express-rate-limit';

export const Limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

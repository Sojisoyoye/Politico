import { body, param, validationResult } from 'express-validator/check';

const validatePartyId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be integer from 1 upwards'),
];

const validateOfficeId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be integer from 1 upwards'),
];

const validateResult = [
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be an integer from 1 upwards'),
];

const validateRegister = [
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be an integer'),
  body('party')
    .isInt({ min: 1 })
    .withMessage('party must be an integer'),
];

const validateParty = [
  body('name')
    .isString()
    .withMessage('party name must contain string'),
  body('hqAddress')
    .isString()
    .withMessage('party address must be string')
    .isLength({ min: 5 })
    .withMessage('address must be at least 5 characters long'),
  body('logoUrl')
    .isURL()
    .withMessage('logoURl must be a URL'),
];

const validateOffice = [
  body('type')
    .isString()
    .withMessage('type must be a string'),
  body('name')
    .isString()
    .withMessage('name must be a string'),
];

const validateNameUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be integer from 1 upwards'),
  body('name')
    .isString()
    .withMessage('name must contain a string'),
];

const validateSignup = [
  body('firstname')
    .isString()
    .withMessage('firstname must be a string')
    .isLength({ min: 2 }),
  body('lastname')
    .isString()
    .withMessage('lastname must be a string')
    .isLength({ min: 2 }),
  body('othername')
    .isString()
    .withMessage('othername must be a string')
    .isLength({ min: 2 }),
  body('email')
    .isEmail()
    .withMessage('email must be in the required format'),
  body('phonenumber')
    .isInt()
    .withMessage('phone number must be a number'),
  body('passporturl')
    .isAlphanumeric()
    .withMessage('passporturl must contain combination of letters and numbers'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('email must be in the required format'),
];

const validateVote = [
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be integer from 1 upwards'),
  body('candidate')
    .isInt({ min: 1 })
    .withMessage('candidate must be integer from 1 upwards'),
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0],
    });
  }
  return next();
};

const validations = {
  validatePartyId,
  validateOfficeId,
  validateParty,
  validateOffice,
  validateNameUpdate,
  validationHandler,
  validateSignup,
  validateLogin,
  validateVote,
  validateResult,
  validateRegister,
};

export default validations;

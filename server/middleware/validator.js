import {
  body, param, check, validationResult,
} from 'express-validator/check';


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
  check('office')
    .not()
    .isEmpty()
    .withMessage('please provide a office id'),
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be an integer from 1 upwards'),
];

const validateRegister = [
  check('office')
    .not()
    .isEmpty()
    .withMessage('please provide a office id'),
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be an integer'),
  check('party')
    .not()
    .isEmpty()
    .withMessage('please provide a party id'),
  body('party')
    .isInt({ min: 1 })
    .withMessage('party must be an integer'),
];

const validateParty = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('please provide a party name'),
  body('name')
    .custom(name => /^[a-zA-Z\s]+$/.test(name))
    .withMessage('please enter a valid name'),
  check('hqAddress')
    .not()
    .isEmpty()
    .withMessage('please provide a party address'),
  body('hqAddress')
    .custom(hqAddress => /[a-zA-Z]+$/.test(hqAddress))
    .withMessage('party address must be string')
    .isLength({ min: 5 })
    .withMessage('address must be at least 5 characters long'),
  check('logoUrl')
    .not()
    .isEmpty()
    .withMessage('please provide a logo url'),
  body('logoUrl')
    .isURL()
    .withMessage('logoURl must be a URL'),
];

const validateOffice = [
  check('type')
    .not()
    .isEmpty()
    .withMessage('please provide an office type'),
  body('type')
    .custom(type => /^[a-zA-Z\s]+$/.test(type))
    .withMessage('please provide a valid office type'),
  check('name')
    .not()
    .isEmpty()
    .withMessage('please provide an office name'),
  body('name')
    .custom(name => /^[a-zA-Z\s]+$/.test(name))
    .withMessage('please provide a valid office name'),
];

const validateNameUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be integer from 1 upwards'),
  check('name')
    .not()
    .isEmpty()
    .withMessage('please provide a name to update'),
  body('name')
    .custom(name => /^[a-zA-Z\s]+$/.test(name))
    .withMessage('name must contain only letters'),
];

const validateSignup = [
  check('firstname')
    .not()
    .isEmpty()
    .withMessage('please provide a firstname'),
  body('firstname')
    .custom(firstname => /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(firstname))
    .withMessage('please provide a valid firstname')
    .isLength({ min: 2 })
    .withMessage('firstname must be more than two characters'),
  check('lastname')
    .not()
    .isEmpty()
    .withMessage('please provide a lastname'),
  body('lastname')
    .custom(lastname => /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(lastname))
    .withMessage('please provide a valid lastname')
    .isLength({ min: 2 })
    .withMessage('lastname must be more than two characters'),
  check('othername')
    .optional()
    .isString()
    .withMessage('please provide a valid othername'),
  check('email')
    .not()
    .isEmpty()
    .withMessage('please provide an email'),
  body('email')
    .custom(email => /^([A-z0-9]+)([._-]{0,1})([A-z0-9]+)@([A-z0-9-_.]+)\.([A-z]{2,3})$/.test(email))
    .normalizeEmail()
    .withMessage('please provide a valid email'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('please provide a password'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  check('phonenumber')
    .not()
    .isEmpty()
    .withMessage('please provide a phonenumber'),
  body('phonenumber')
    .isInt()
    .withMessage('please provide a valid phone number')
    .isLength({ min: 6, max: 13 })
    .withMessage('phone number must be at least 6 numbers and at most 14 numbers'),
  check('passporturl')
    .optional(),
  body('passporturl')
    .optional()
    .isURL()
    .withMessage('please provide a valid url'),
];

const validateLogin = [
  check('email')
    .not()
    .isEmpty()
    .withMessage('please enter an email'),
  body('email')
    .custom(email => /\S+@\S+\.\S+/.test(email))
    .withMessage('please provide a valid email'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('please enter a password'),
];

const validateVote = [
  check('office')
    .not()
    .isEmpty()
    .withMessage('please enter an office id'),
  body('office')
    .isInt({ min: 1 })
    .withMessage('office must be integer from 1 upwards'),
  check('candidate')
    .not()
    .isEmpty()
    .withMessage('please enter candidate\'s id'),
  body('candidate')
    .isInt({ min: 1 })
    .withMessage('candidate must be integer from 1 upwards'),
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 422,
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

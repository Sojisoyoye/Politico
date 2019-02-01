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

const validateParty = [
  body('name')
    .isAlpha()
    .withMessage('party name must contain only letters'),
  body('hqAddress')
    .isString()
    .withMessage('party address must be string')
    .isLength({ min: 5 })
    .withMessage('address must be at least 5 characters long'),
  body('logoUrl')
    .isURL()
    .withMessage('logoURl must be a URL'),
  body('acroymn')
    .isAlpha()
    .withMessage('acroymn must contain only letters'),
];

const validateOffice = [
  body('type')
    .isAlpha()
    .withMessage('type must contain only letters'),
  body('name')
    .isAlpha()
    .withMessage('name must contain only letters'),
];

const validateNameUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be integer from 1 upwards'),
  param('name')
    .isAlpha()
    .withMessage('only name can be updated'),
  body('name')
    .isAlpha()
    .withMessage('name must contain only letters'),
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array().map(error => error.msg),
    });
  } else {
    next();
  }
};

const validations = {
  validatePartyId,
  validateOfficeId,
  validateParty,
  validateOffice,
  validateNameUpdate,
  validationHandler,
};

export default validations;

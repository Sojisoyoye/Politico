import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import parser from '../config/cloudinaryConfig';
import PartyController from '../controllers/partycontroller';
import OfficeController from '../controllers/officecontroller';
import UserController from '../controllers/usercontroller';
import VoteController from '../controllers/votecontroller';
import Authenticate from '../middleware/Auth';
import validations from '../middleware/validator';


dotenv.config();
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico API version 1' });
});

// Parties endpoints
router.post('/parties', parser.single('logoUrl'), validations.validateParty, validations.validationHandler, Authenticate.verifyAdmin, PartyController.postParty);

router.get('/parties', Authenticate.verifyToken, PartyController.getParties);

router.get('/parties/:id', Authenticate.verifyToken, PartyController.getAParty);

router.patch('/parties/:id', validations.validateNameUpdate, validations.validationHandler, Authenticate.verifyAdmin, PartyController.updateName);

router.delete('/parties/:id', validations.validatePartyId, validations.validationHandler, Authenticate.verifyAdmin, PartyController.deleteParty);

// Offices endpoints

router.post('/offices', validations.validateOffice, validations.validationHandler, Authenticate.verifyAdmin, OfficeController.postOffice);

router.get('/offices', Authenticate.verifyToken, OfficeController.getOffices);

router.get('/offices/:id', Authenticate.verifyToken, OfficeController.getAOffice);

// Sign up and log in

router.post('/auth/signup', parser.single('passporturl'), validations.validateSignup, validations.validationHandler, UserController.createUser);

router.post('/auth/login', validations.validateLogin, validations.validationHandler, UserController.loginUser);

// Other endpoints

router.post('/office/:id/register', validations.validateOfficeId, validations.validateRegister, validations.validationHandler, Authenticate.verifyAdmin, OfficeController.registerUser);

router.post('/office/:id/result', validations.validateOfficeId, validations.validateResult, validations.validationHandler, Authenticate.verifyToken, OfficeController.getResult);

// vote endpoint

router.post('/votes', validations.validateVote, validations.validationHandler, Authenticate.verifyToken, VoteController.voteCandidate);


export default router;

import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import PartyController from '../controllers/partycontroller';
import OfficeController from '../controllers/officecontroller';
import UserController from '../controllers/usercontroller';
import VoteController from '../controllers/votecontroller';
import Authenticate from '../middleware/Auth';
import validations from '../middleware/validator';


dotenv.config();
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico API version1' });
});

router.post('/parties', validations.validateParty, validations.validationHandler, Authenticate.verifyAdmin, PartyController.postParty);

router.get('/parties', PartyController.getParties);

router.get('/parties/:id', PartyController.getAParty);

router.patch('/parties/:id/name', validations.validateNameUpdate, validations.validationHandler, Authenticate.verifyAdmin, PartyController.updateName);

router.delete('/parties/:id', validations.validatePartyId, validations.validationHandler, Authenticate.verifyAdmin, PartyController.deleteParty);

router.post('/offices', validations.validateOffice, validations.validationHandler, Authenticate.verifyAdmin, OfficeController.postOffice);

router.get('/offices', OfficeController.getOffices);

router.get('/offices/:id', OfficeController.getAOffice);

// Sign up and log in

router.post('/auth/signup', validations.validateSignup, validations.validationHandler, UserController.createUser);

router.post('/auth/login', validations.validateLogin, validations.validationHandler, UserController.loginUser);

// Other endpoints

router.post('/office/:id/register', validations.validateOfficeId, validations.validateRegister, validations.validationHandler, Authenticate.verifyAdmin, OfficeController.registerUser);

router.post('/office/:id/result', validations.validateOfficeId, validations.validateResult, validations.validationHandler, OfficeController.getResult);

// vote endpoint

router.post('/votes', validations.validateVote, validations.validationHandler, Authenticate.verifyToken, VoteController.voteCandidate);


export default router;

import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import PartyController from '../controllers/partycontroller';
import OfficeController from '../controllers/officecontroller';
import UserController from '../controllers/usercontroller';
import VoteController from '../controllers/votecontroller';


dotenv.config();
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico API version1' });
});

router.post('/parties', PartyController.postParty);

router.get('/parties', PartyController.getParties);

router.get('/parties/:id', PartyController.getAParty);

router.patch('/parties/:id/name', PartyController.updateName);

router.delete('/parties/:id', PartyController.deleteParty);

router.post('/offices', OfficeController.postOffice);

router.get('/offices', OfficeController.getOffices);

router.get('/offices/:id', OfficeController.getAOffice);

// Sign up and log in

router.post('/auth/signup', UserController.createUser);

router.post('/auth/login', UserController.loginUser);

// Other endpoints

router.post('/office/:id/register', OfficeController.registerUser);

router.post('/office/:id/result', OfficeController.getResult);

// vote endpoint

router.post('/votes', VoteController.voteCandidate);


export default router;

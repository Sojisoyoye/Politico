import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import PartyController from '../controllers/partycontroller';
import OfficeController from '../controllers/officecontroller';
//  import validation from '../middleware/validator';

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


export default router;

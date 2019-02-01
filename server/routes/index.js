import express from 'express';
import PartyController from '../controllers/partycontroller';
import OfficeController from '../controllers/officecontroller';
import validation from '../middleware/validator';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico API version1' });
});

router.post(
  '/parties',
  validation.validateParty,
  validation.validationHandler,
  PartyController.postParty,
);

router.get('/parties', PartyController.getParties);

router.get(
  '/parties/:id',
  validation.validatePartyId,
  validation.validationHandler,
  PartyController.getAParty,
);

router.patch(
  '/parties/:id/name',
  validation.validatePartyId,
  validation.validationHandler,
  PartyController.updateName,
);

router.delete('/parties/:id', PartyController.deleteParty);

router.post(
  '/offices',
  validation.validateOffice,
  validation.validationHandler,
  OfficeController.postOffice,
);

router.get('/offices', OfficeController.getOffices);

router.get(
  '/offices/:id',
  validation.validateOfficeId,
  validation.validationHandler,
  OfficeController.getAOffice,
);

export default router;

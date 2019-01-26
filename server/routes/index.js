import express from 'express';
import PartyController from '../controllers/partycontroller';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico API version1' });
});

router.post('/parties', PartyController.postParty);

router.get('/parties', PartyController.getParties);

export default router;

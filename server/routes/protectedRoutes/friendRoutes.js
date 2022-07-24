import express from 'express';
import tokenChecker from '../../middleware/tokenChecker.js';
import { addFriend, deleteFriend, getFriends } from '../../services/friendService.js';

const router = express.Router();

router.post('/addFriend', tokenChecker, addFriend);
router.delete('/deleteFriend/:id', tokenChecker, deleteFriend);
router.get('/getFriends', tokenChecker, getFriends);

export default router;
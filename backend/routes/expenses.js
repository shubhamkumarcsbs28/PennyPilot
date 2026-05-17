const router = require('express').Router();
const {
  getExpenses, createExpense, updateExpense, deleteExpense, getStats
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

router.use(protect); // All expense routes require auth

router.get('/stats', getStats);
router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;

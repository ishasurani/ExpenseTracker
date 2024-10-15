import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
const PORT = 3000;
const app = express()

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/expenses-db').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const Expense = mongoose.model('expenses', new mongoose.Schema({
    id: String,
    date: Number,
    amount: Number,
    comments: String,
}))

app.get('/expenses/:startDate/:endDate', async (req, res) => {
    const startDate = parseInt(req.params.startDate);
    const endDate = parseInt(req.params.endDate);
    try {
        const expenses = await Expense
            .find({
                'date': { $gt: startDate, $lt: endDate }
            })
            .sort({ 'date': 1 })
            .exec();
        res.json(expenses)
    } 
    catch (error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.get('/expenses/:id', async (req, res) => {
    const { id } = req.params;
  
    const expense = await Expense.findOne({ id });
    res.json(expense);
  });

app.put('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    const updatedExpense = await Expense.findOneAndUpdate({ id: id }, { $set: updated }, { new: true });
    res.json(updatedExpense);
    if (!updatedExpense) {
        return res.status(404).send('Expense not found');
    }
})

app.post('/expenses', async (req, res) => {
    const { id, date, amount, comments } = req.body;

    const newExpense = new Expense({
        id,
        date,
        amount,
        comments,
    });

    try {
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
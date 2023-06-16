import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.mjs';

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv.config({ path: './config.env' });

//Connect database
const db = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);
mongoose.set('strictQuery', true);
mongoose.connect(db, {}).then(() => {
    console.log('Database connected sucessfully!');
});

//Listen server

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App is listening at port ${port} `);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

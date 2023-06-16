import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Store from '../models/storeModel.mjs';
import Laptop from '../models/productModel.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: './config.env' });

//DB Connection
const db = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);
mongoose.connect(db, {});

// READ JSON FILE
const stores = JSON.parse(fs.readFileSync(`${__dirname}/store.json`, 'utf-8'));
const laptops = JSON.parse(
    fs.readFileSync(`${__dirname}/laptop.json`, 'utf-8')
);

const importData = async () => {
    try {
        await Laptop.create(laptops);
        console.log('Read data successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

//DELETE DATA FORM COLLECTION
const deleteData = async () => {
    try {
        await Laptop.deleteMany();

        console.log('Delete data successfully');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();

import mongoose from 'mongoose';
import Store from './models/storeModel.mjs';
(async () => {
    const stores = await Store.find();
    const ids = stores.map((el) => el.id);
    console.log(ids);
})();

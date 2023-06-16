class apiFeatures {
    constructor(query, queryStr) {
        (this.query = query), (this.queryStr = queryStr);
    }

    filter() {
        const queryObj = { ...this.queryStr };
        let { minPrice, maxPrice, minRam, maxRam } = queryObj;
        const excludedField = ['limit', 'page', 'sort', 'min', 'max'];
        excludedField.forEach((ele) => {
            delete queryObj[ele];
        });
        //1B. Advanced filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        if (!minPrice) minPrice = 0;
        if (!maxPrice) maxPrice = 9999999999;
        if (!minRam) minRam = 0;
        if (!maxRam) maxRam = 9999999999;
        this.query = this.query
            .where('new_price')
            .lte(parseInt(maxPrice))
            .gte(parseInt(minPrice))
            .where('ram')
            .lte(parseInt(maxRam))
            .gte(parseInt(minRam));
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            let sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this;
    }
    limit() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

export default apiFeatures;

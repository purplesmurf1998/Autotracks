const asyncHandler = require('../middleware/async');

const advancedFilter = asyncHandler(async (model, query) => {
  let queryResponse;

  // copy the query parameters from the request
  const reqQuery = { query };

  // fields to exclude from filtering
  const removeFields = ['select', 'populate'];

  // loop removeFields array and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // convert into a json string so we can replace some parts if needed
  let queryStr = JSON.stringify(reqQuery);

  // convert the operators into mongoose operators ex. gt->$gt
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|ne)\b/g, match => `$${match}`);
  queryResponse = model.find(JSON.parse(queryStr).query);

  // select specific fields if some have been entered
  if (query.select) {
    const fields = query.select.split(',').join(' ');
    queryResponse = queryResponse.select(fields);
  }

  // populate specific fields if some have been entered
  if (query.populate) {
    const fields = query.populate.split(',').join(' ');
    queryResponse = queryResponse.populate(fields);
  }

  return await queryResponse;
});

module.exports = advancedFilter;
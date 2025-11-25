export const mongooseConfig = {
  uri: process.env.MONGO_URI || 'mongodb://mongoadmin:mongo_pass@localhost:27017/ecommerce?authSource=admin',
};

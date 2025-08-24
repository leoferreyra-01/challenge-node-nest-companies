export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiKey: process.env.API_KEY || 'your-super-secret-api-key-here',
});

const path = require('path');

module.exports = {
  // Define multiple entry points for each subdirectory
  entry: {
    addevent: './addevent/addevent.ts',
    admindashboard: './admindashboard/admin-dashboard.ts',
    agenda: './agenda/agenda.ts',
    dashboard: './dashboard/dashboard.ts',
    eventcategory: './eventcategory/eventcategory.ts',
    guestManagement: './guest-management/guest-management.ts',
    login: './login/login.ts',
    signup: './signup/signup.ts'
  },
  output: {
    // Output the bundled files to the 'dist' folder
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'  // Dynamic output file names based on entry point names
  },
  resolve: {
    // Resolve both TypeScript and JavaScript files
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        // Use 'ts-loader' to compile TypeScript files
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        // Handle CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  // Enable source maps for easier debugging
  devtool: 'source-map',
  // Set the mode based on environment
  mode: 'development'
};

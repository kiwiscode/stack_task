# ![Project Logo](../stack-task/client/src/assets/logo.png): Chat Application

This project is a todo application that allows users to manage their tasks efficiently. Users can create tasks by selecting categories such as 'work,' 'personal,' 'family,' or 'pet.' They can assign due dates, edit, delete, and prioritize tasks based on importance.

## Technologies

### Backend

- **Mongoose**: Used for database management.
- **MongoDB**: The database used, hosted on MongoDB Atlas.
- **Cloudinary**: Used for user uploads (images and media).
- **bcrypt**: Used for user password security.
- **Express**: Used for the API service.
- **jsonwebtoken**: Used for user authentication.

### Frontend

- **React.js**: Used for building the user interface.
- **Vite**: Used for the development and build process.
- **Material UI**: Used for styling and components.
- **Pure CSS**: Used for custom styling and utility classes.
- **Axios**: Used for making API calls.

## Features

- Users can create and manage tasks by selecting categories such as 'work,' 'personal,' 'family,' or 'pet.'
- Tasks can be assigned due dates, edited, deleted, and prioritized.
- Users can filter tasks by category or search for specific tasks.
- Users can switch between dark and light theme modes.
- Greeting messages such as 'Good Morning,' 'Good Afternoon,' 'Good Evening,' and 'Good Night' are displayed based on the time of day.
- Tasks can be marked as 'in progress,' 'todo,' or 'completed,' and users can view tasks in these statuses.
- Soft delete and hard delete methods are implemented for tasks. Users can restore tasks that were soft deleted within a certain time frame.
- Users can also restore tasks that were hard deleted within a specified period.
- Completed tasks can be reverted to their previous state if necessary, using a soft database system.
- The application is fully responsive and optimized for all devices and screen sizes.
- Users can upload images and media via Cloudinary.
- Secure authentication and password storage are implemented.

## Installation

### Backend Setup

1. **Install Backend Dependencies**:

   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**: Create a `.env` file and add the required configuration details.

3. **Database Setup**:

   - **Supabase**: You can use Supabase to host your PostgreSQL database. Create a PostgreSQL database on Supabase and add the connection details to the `.env` file.
   - **Local**: Alternatively, you can set up a PostgreSQL database locally. Use pgAdmin or a similar tool to manage the database and update the connection details in the `.env` file.

4. **Start the Server**:
   ```bash
   node server.js
   ```

### Frontend Setup

1. **Install Frontend Dependencies**:

   ```bash
   cd client
   npm install
   ```

2. **Configure Environment Variables**: Create a `.env` file and add the required configuration details.

3. **Start the Application**:
   ```bash
   npm run dev
   ```

## Usage

- **Register and Login**: Users can create a new account or log in with existing credentials.
- **Add Friends and Coworkers**: Users can search for and add both friends and coworkers.
- **Real-Time Chat**: Communicate with added friends in real-time.
- **Profile Management**: Users can update their profile pictures.

## Contributing

If you would like to contribute, please submit a pull request or open an issue.

## Contact

For questions or feedback, please contact [aykutkav.dev@gmail.com](mailto:aykutkav.dev@gmail.com).

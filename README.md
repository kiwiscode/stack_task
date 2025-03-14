# <div style="display: flex; align-items: center; gap: 10px;"><img src="/images/stack_task_logo.png" alt="Project Logo" height="33.5px"><h1>Stack Task</h1></div>

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

   - **MongoDB Atlas**: You can use MongoDB Atlas to host your MongoDB database. Create a MongoDB database on MongoDB Atlas and add the connection details to the `.env` file.
   - **Local**: Alternatively, you can set up a MongoDB database locally. Use MongoDB Compass or a similar tool to manage the database and update the connection details in the `.env` file.

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

- **Register and Login**: Users can create a new account or log in with existing credentials to access their task management dashboard.
- **Task Management**: Users can create, edit, delete, and prioritize tasks. Tasks can be categorized into 'work,' 'personal,' 'family,' or 'pet,' and assigned due dates.
- **Task Filtering and Searching**: Users can filter tasks by category or search for specific tasks using keywords.
- **Theme Switching**: Users can switch between dark and light theme modes based on their preference.
- **Greeting Messages**: The application displays greeting messages such as 'Good Morning,' 'Good Afternoon,' 'Good Evening,' and 'Good Night' based on the time of day.
- **Task Status Tracking**: Users can track tasks as 'in progress,' 'todo,' or 'completed.' Tasks can be viewed and managed according to their status.
- **Task Restoration**: Soft deleted tasks can be restored within a certain time frame, and hard deleted tasks can also be recovered within a specified period.
- **Responsive Design**: The application is fully responsive and optimized for various devices and screen sizes.
- **Image and Media Upload**: Users can upload images and media files, which are managed through Cloudinary.
- **Secure Authentication**: User authentication and password storage are handled securely to protect user information.

## Contributing

If you would like to contribute, please submit a pull request or open an issue.

## Contact

For questions or feedback, please contact [aykutkav.dev@gmail.com](mailto:aykutkav.dev@gmail.com).

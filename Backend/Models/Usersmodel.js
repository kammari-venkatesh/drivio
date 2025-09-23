import mongoose from 'mongoose';
const { Schema } = mongoose;

// 1. Define the User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        // Regex to validate email format
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
        // In a real application, you should never store plain text passwords.
        // Use a pre-save hook here to hash the password with a library like bcrypt.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true
});

// 2. Create the User Model from the Schema
const UserrpModel = mongoose.model('Userrp', userSchema);

// 3. Export the Model
export default UserrpModel;
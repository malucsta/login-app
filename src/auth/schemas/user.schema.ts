import mongoose from 'mongoose';
import AuthService from '../services/auth.service';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isAdmin: {
            type: Boolean, 
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
            },
        },
    }
);


UserSchema.pre('save', async function (): Promise<void> {

    if (!this.password || !this.isModified('password'))
        return

    try {
        const hashedPassword = await AuthService.hashPassword(this.password);
        this.password = hashedPassword;
    } catch (err) {
        console.error(`Error hashing the password for the user ${this.name}`)
    }
}); 

export const User = mongoose.model('User', UserSchema);

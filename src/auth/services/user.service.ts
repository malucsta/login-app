import { User } from '../schemas/user.schema';
import { UserModel } from '../models/user.model';

export default class UserService {
    public async findAllUsers() {
        return await User.find();
    }

    public async findUserById(id: string) {
        return await User.findOne({ _id: id });
    }

    public async findUserByEmail(email: string) {
        return await User.findOne({ email: email });
    }

    public async findUserByEmailWithPassword(email: string) {
        return await User.findOne({ email: email }).select('+password');
    }

    public async createUser(user: UserModel) {
        await User.create(user);
        return await User.findOne({ email: user.email });
    }

    public async UpdateName(id: string, name: string) {
        
        const filter = { _id: id };
        const update = { name: name };

        const userToUpdate = await User.findOne(filter);

        if (!userToUpdate) 
            return;

        return await User.findOneAndUpdate(filter, update);
    }

    public async deleteUser(id: string) {
        const userToDelete = await User.findOne({ _id: id });

        if (!userToDelete) 
            return;

        return await User.deleteOne({ _id: userToDelete.id });
    }
}

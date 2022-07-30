import { User } from '../schemas/user.schema';
import { UserModel } from '../models/user.model';

export default class UserService {
    public async findAllUsers() {
        return await User.find();
    }

    public async findUser(email: string) {
        return await User.findOne({ email: email });
    }

    public async findUserWithPassword(email: string) {
        return await User.findOne({ email: email }).select('+password');
    }

    public async createUser(user: UserModel) {
        await User.create(user);
        return await User.findOne({ email: user.email });
    }

    public async UpdateName(id: string, name: string) {
        
        const filter = { id: id };
        const update = { name: name };

        const userToUpdate = await User.findOne({ id: id });

        if (!userToUpdate) 
            return;

        return await User.findOneAndUpdate(filter, update);
    }

    public async deleteUser(id: string) {
        const userToDelete = await User.findOne({ id: id });

        if (!userToDelete) 
            return;

        return await User.deleteOne({ id: userToDelete.id });
    }
}

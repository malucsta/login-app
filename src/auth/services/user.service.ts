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

        try {
            const createdUser = await User.create(user);
            return createdUser.toJSON();

        } catch (err) {
            return err;
        }
    }

    public async deleteUser(id: string) {
        console.log(id)
        
        const userToDelete = await User.findOne({ id: id });

        if(!userToDelete)
            return

        return await User.deleteOne({ id: userToDelete.id }); 
    }
}
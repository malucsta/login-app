import { User } from '../schemas/user.schema';
import { UserModel } from '../models/user.model';

export default class UserService {

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
}
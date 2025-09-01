
import bcrypt from 'bcryptjs';
import User from '../../models/User';



async function userSeed() {
	console.info(`Start seeding user ...`)
	const password = await bcrypt.hash('password', 10);
	for (let index = 1; index <= 50; index++) {
		const user = new User({
			name: `User ${index}`,
			email: `user${index}@example.com`,
			password: password,
			created_at: new Date(),
			updated_at: new Date()
		});
		await user.save();
	}
}

export default userSeed
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import  jwt  from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = (): string[] => {
   // build a jwt payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
   // create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

   // build session object. {jwt: JWT_KEY}
    const session = { jwt: token };

   // turn that session into json
    const sessionJSON = JSON.stringify(session);

   //take json and decode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

   //return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}
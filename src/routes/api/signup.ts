import { APIEvent } from "@solidjs/start/server/types";
import { User } from "~/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function POST({ request }: APIEvent) {
    const { username, password } = await request.json();
    if (username == null || password == null) { 
        return new Response("Missing field", { status: 400 }); 
    }

    // TODO: Check username is free
    const existing = await User.findOne({ username });
    if (existing != null) {
        console.log(existing);
        return new Response("Username taken", { status: 409 });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User();
    user.username = username;
    user.password = hashed;
    await user.save();

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    return new Response(token);
}
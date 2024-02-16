import { APIEvent } from "@solidjs/start/server/types";
import { User } from "~/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST({ request }: APIEvent) {
    const {username, password} = await request.json();

    const user = await User.findOne({username});
    if (!await bcrypt.compare(password, user.password)) {
        return new Response("Incorrect username or password", {status: 401})
    }

    const token = jwt.sign({username}, process.env.JWT_SECRET);
    return new Response(token)
}
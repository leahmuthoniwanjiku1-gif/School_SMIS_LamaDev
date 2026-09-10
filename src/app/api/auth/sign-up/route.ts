import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "");
        const name = String(body.name ?? "").trim();
        const email = String(body.email ?? "").trim();
        const role = String(body.role ?? "STUDENT").toUpperCase();

        if (!username || !password || !name) {
            return NextResponse.json(
                { error: "Username, password, and name are required." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long." },
                { status: 400 }
            );
        }

        const normalizedRole = ["ADMIN", "TEACHER", "STUDENT", "PARENT"].includes(role)
            ? role
            : "STUDENT";

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return NextResponse.json(
                { error: "Username is already taken." },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email: email || null,
                role: normalizedRole as any,
            },
        });

        return NextResponse.json({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        console.error("Sign-up error:", error);
        return NextResponse.json(
            { error: "Unable to create account. Please try again." },
            { status: 500 }
        );
    }
}

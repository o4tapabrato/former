import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

export interface SessionPayload extends JWTPayload {
  userId: string;
}

export async function createSession(userId: string): Promise<void> {
    const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d')
    .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 3
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session')?.value;

        if(!token) {
            return null;
        }

        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as SessionPayload;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export async function getCurrentUser(): Promise<string | null> {
    const session = await getSession();
    return session?.userId || null;
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set('session', '', {
        maxAge: 0,
        path: '/'
    });
}
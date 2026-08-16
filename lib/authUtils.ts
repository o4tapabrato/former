import bcrypt from "bcryptjs"

export async function isPasswordMatched(inputPassowrd: string, savedPassowrd: string): Promise<boolean> {
    try {
        const isValid: boolean = await bcrypt.compare(inputPassowrd, savedPassowrd);
        return isValid;
    }
    catch (error) {
        throw error;
    }
}
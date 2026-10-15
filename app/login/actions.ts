"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type SignInActionState = {
    error?: string;
};

export const signInWithGoogle = async (
    _prevState: SignInActionState,
    _formData: FormData,
): Promise<SignInActionState> => {
    // Explicitly consume to satisfy TypeScript/ESLint without disabling rules
    void _prevState;
    void _formData;

    try {
        await signIn("google", { redirectTo: "/dashboard" });
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "Unable to sign in with Google. Please try again.",
            };
        }

        throw error;
    }

    return {};
};

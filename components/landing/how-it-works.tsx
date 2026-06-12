import React from "react";

export default function HowItWorks() {
    return (
        <section className="max-w-5xl mx-auto px-4 py-16 space-y-12">
            <div className="text-center space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight">
                    Three steps to get started
                </h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                    A simple, fast, and secure platform to organize your study
                    life.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 relative">
                {/* Step 1 */}
                <div className="p-6 bg-stone-100 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 relative space-y-4">
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-400">
                        1
                    </div>
                    <h4 className="font-bold text-md pt-2">
                        Create your account
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Sign up easily and securely using Google OAuth to lock
                        in your study credentials.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="p-6 bg-stone-100 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 relative space-y-4">
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-400">
                        2
                    </div>
                    <h4 className="font-bold text-md pt-2">
                        Build your targets
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Record your exams, add study chapters, and configure the
                        habits you want to master.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="p-6 bg-stone-100 dark:bg-stone-900/40 rounded-2xl border border-stone-200 dark:border-stone-800 relative space-y-4">
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-bold text-stone-400">
                        3
                    </div>
                    <h4 className="font-bold text-md pt-2">Plan and execute</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Map out daily blocks, check off checklist tasks, and
                        watch your consistency grow.
                    </p>
                </div>
            </div>
        </section>
    );
}

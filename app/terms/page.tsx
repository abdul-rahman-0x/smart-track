import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen w-full bg-white px-6 py-20 font-sans text-stone-800 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-300">
            <div className="mx-auto max-w-2xl space-y-12">
                <div>
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50">
                        <ArrowLeft
                            size={14}
                            className="transition-transform group-hover:-translate-x-0.5"
                        />
                        Back to home
                    </Link>
                </div>

                <header className="space-y-3">
                    <h1 className="font-serif text-4xl font-medium tracking-tight text-stone-900 dark:text-white sm:text-5xl">
                        Terms
                    </h1>
                    <p className="font-mono text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        Effective 1 September 2026
                    </p>
                </header>

                <div className="border-l-2 border-[#6E42F4] pl-4 py-1 text-sm leading-relaxed text-stone-600 dark:border-[#B19CFF] dark:text-stone-400">
                    Your database entries are yours. You are on the hook for how
                    you manage your goals. Cancel your subscription whenever you
                    want. That is most of it.
                </div>

                <div className="space-y-10">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            The deal
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Smart Track is made and run by Abdul Rahman. It is a
                            focused productivity workspace, not an enterprise
                            platform, and it is priced and supported like one.
                            Using this product means you agree to maintain
                            respectful, manual interaction with our database,
                            actions, and API boundaries.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Your account
                        </h2>
                        <p className="text-sm leading-relaxed">
                            You must be an actual human to register an account.
                            Automated script registrations or botting inputs to
                            inflate metrics are strictly prohibited. Keep your
                            OAuth session keys secure to safeguard your data.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Plans
                        </h2>
                        <ul className="space-y-4 text-sm leading-relaxed">
                            <li>
                                <strong className="font-medium text-stone-950 dark:text-white">
                                    Free tier:
                                </strong>{" "}
                                Gives you standard habit tracking limits, core
                                task lists, and default workspace capabilities.
                            </li>
                            <li>
                                <strong className="font-medium text-stone-950 dark:text-white">
                                    Pro tier:
                                </strong>{" "}
                                Billed at $10 a month to lift standard tracking
                                limits and unlock deep analytical visualizers.
                                All billing is handled safely by Stripe.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            When it breaks
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Smart Track is provided as-is. While I strive to
                            maintain stable performance, there is no uptime
                            guarantee. If something breaks, the most I can owe
                            you is what you have paid me over the past twelve
                            months.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Changes & contact
                        </h2>
                        <p className="text-sm leading-relaxed">
                            If these terms undergo major changes, active account
                            holders will be notified via email first. If you
                            find a security bug or have a question, please
                            report it to me at{" "}
                            <a
                                href="mailto:support@smarttrack-hub.com"
                                className="font-semibold text-stone-900 underline transition-colors hover:text-orange-500 dark:text-stone-100">
                                support@smarttrack-hub.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                        Privacy
                    </h1>
                    <p className="font-mono text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500">
                        Effective 1 September 2026
                    </p>
                </header>

                <div className="border-l-2 border-[#6E42F4] pl-4 py-1 text-sm leading-relaxed text-stone-600 dark:border-[#B19CFF] dark:text-stone-400">
                    Smart Track stores your account, your habit logs, your
                    scheduled tasks, and your subscription metadata. Payment
                    details never hit our servers, nothing is sold to third
                    parties, and you retain complete control over deleting your
                    data.
                </div>

                <div className="space-y-10">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Who runs this
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Smart Track is built and run by Abdul Rahman as an
                            independent, single-developer platform. There is no
                            large corporation or massive data-broker behind this
                            product. If you have questions, concerns, or
                            requests regarding your data, you can contact me
                            directly at{" "}
                            <a
                                href="mailto:support@smarttrack-hub.com"
                                className="font-semibold text-stone-900 underline transition-colors hover:text-orange-500 dark:text-stone-100">
                                support@smarttrack-hub.com
                            </a>
                            .
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            What gets stored
                        </h2>
                        <ul className="space-y-4 text-sm leading-relaxed">
                            <li>
                                <strong className="font-medium text-stone-950 dark:text-white">
                                    Your account:
                                </strong>{" "}
                                When registering, we store your name, email, and
                                avatar provided by Google or GitHub OAuth. We do
                                not handle or store raw passwords on our
                                servers.
                            </li>
                            <li>
                                <strong className="font-medium text-stone-950 dark:text-white">
                                    Your productivity:
                                </strong>{" "}
                                To calculate your consistency metrics, we store
                                your tasks, academic logs, habits, and daily
                                streak counts in a secure, serverless Neon
                                PostgreSQL database.
                            </li>
                            <li>
                                <strong className="font-medium text-stone-950 dark:text-white">
                                    Billing metadata:
                                </strong>{" "}
                                All credit card details are handled directly by
                                Stripe. We only store transaction event
                                references and subscription status indicators.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Who else touches it
                        </h2>
                        <p className="text-sm leading-relaxed">
                            We partner with a few trusted service providers to
                            make Smart Track run reliably. Here is exactly what
                            they see:
                        </p>

                        <div className="overflow-x-auto pt-2">
                            <table className="w-full text-left text-xs text-stone-600 dark:text-stone-400">
                                <thead>
                                    <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-950 dark:text-white">
                                        <th className="pb-3 font-semibold">
                                            Service
                                        </th>
                                        <th className="pb-3 font-semibold">
                                            What it does
                                        </th>
                                        <th className="pb-3 font-semibold">
                                            What it sees
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                                    <tr>
                                        <td className="py-3.5 font-medium text-stone-950 dark:text-white">
                                            Neon
                                        </td>
                                        <td className="py-3.5">Database</td>
                                        <td className="py-3.5">
                                            Your email, goals, habit entries,
                                            and scheduler logs
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3.5 font-medium text-stone-950 dark:text-white">
                                            Vercel
                                        </td>
                                        <td className="py-3.5">Hosting</td>
                                        <td className="py-3.5">
                                            Incoming network requests and basic
                                            server logs
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3.5 font-medium text-stone-950 dark:text-white">
                                            Stripe
                                        </td>
                                        <td className="py-3.5">Payments</td>
                                        <td className="py-3.5">
                                            Billing details, email, and
                                            subscription lifecycle events
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3.5 font-medium text-stone-950 dark:text-white">
                                            Google, GitHub
                                        </td>
                                        <td className="py-3.5">
                                            Authentication
                                        </td>
                                        <td className="py-3.5">
                                            Your email address and profile name
                                            during signup
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
                            Deleting it
                        </h2>
                        <p className="text-sm leading-relaxed">
                            You own your database entries. You can wipe your
                            metrics, clear your habit trackers, and delete your
                            account cleanly from your settings panel. This
                            initiates an immediate deletion of your records from
                            our Neon PostgreSQL production database.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

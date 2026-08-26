import {
    pgTable,
    text,
    timestamp,
    integer,
    boolean,
    uuid,
    primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        {
            parentKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ],
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" })
        .unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    status: text("status").notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
        mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habits = pgTable("habit", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").default("general").notNull(),
    streak: integer("streak").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitCompletions = pgTable("habit_completion", {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habitId")
        .notNull()
        .references(() => habits.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { mode: "date" }).notNull(),
});

export const exams = pgTable("exam", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    date: timestamp("date", { mode: "date" }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("task", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    completed: boolean("completed").default(false).notNull(),
    dueDate: timestamp("due_date", { mode: "date" }),
    priority: text("priority").default("medium").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    examId: uuid("exam_id").references(() => exams.id, {
        onDelete: "set null",
    }),
});

export const usersRelations = relations(users, ({ many }) => ({
    habits: many(habits),
    exams: many(exams),
}));

export const habitsRelations = relations(habits, ({ one, many }) => ({
    user: one(users, { fields: [habits.userId], references: [users.id] }),
    completions: many(habitCompletions),
}));

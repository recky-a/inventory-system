import { relations } from "drizzle-orm/relations";
import { user, account, session, tBarang, tTransaksi } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const tTransaksiRelations = relations(tTransaksi, ({one}) => ({
	tBarang: one(tBarang, {
		fields: [tTransaksi.idBarang],
		references: [tBarang.idBarang]
	}),
}));

export const tBarangRelations = relations(tBarang, ({many}) => ({
	tTransaksis: many(tTransaksi),
}));
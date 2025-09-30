CREATE TABLE "t_barang" (
	"id_barang" serial PRIMARY KEY NOT NULL,
	"kode_barang" varchar(15),
	"nama_barang" varchar(50),
	"jumlah_barang" integer,
	"harga" numeric(15, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t_transaksi" (
	"id_transaksi" serial PRIMARY KEY NOT NULL,
	"tgl_transaksi" timestamp,
	"item_transaksi" integer,
	"total_transaksi" integer,
	"id_barang" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "t_transaksi" ADD CONSTRAINT "t_transaksi_id_barang_t_barang_id_barang_fk" FOREIGN KEY ("id_barang") REFERENCES "public"."t_barang"("id_barang") ON DELETE no action ON UPDATE no action;
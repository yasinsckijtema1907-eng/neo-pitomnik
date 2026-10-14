CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`goal` text NOT NULL,
	`budget` text NOT NULL,
	`message` text NOT NULL,
	`selection_json` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_contact_created` ON `inquiries` (`contact`,`created_at`);
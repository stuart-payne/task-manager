CREATE TABLE `PriorityTable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`priority` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `TaskStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`statusId` integer,
	`priorityId` integer,
	`dateCreated` integer,
	FOREIGN KEY (`statusId`) REFERENCES `TaskStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`priorityId`) REFERENCES `PriorityTable`(`id`) ON UPDATE no action ON DELETE no action
);

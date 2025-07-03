ALTER TABLE `PriorityTable` RENAME TO `Priority`;--> statement-breakpoint
ALTER TABLE `Tasks` RENAME TO `Task`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`statusId` integer,
	`priorityId` integer,
	`dateCreated` integer,
	FOREIGN KEY (`statusId`) REFERENCES `TaskStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`priorityId`) REFERENCES `Priority`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Task`("id", "name", "description", "statusId", "priorityId", "dateCreated") SELECT "id", "name", "description", "statusId", "priorityId", "dateCreated" FROM `Task`;--> statement-breakpoint

DROP TABLE `Task`;--> statement-breakpoint
ALTER TABLE `__new_Task` RENAME TO `Task`;--> statement-breakpoint
PRAGMA foreign_keys=ON;

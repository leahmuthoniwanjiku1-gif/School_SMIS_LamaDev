/**
 * Clerk User Seeder
 * -----------------
 * Creates Clerk users that match the database seed data in prisma/seed.ts.
 * Run ONCE after running `prisma db seed`.
 *
 * Usage:
 *   npx ts-node --compiler-options {"module":"CommonJS"} prisma/clerkSeed.ts
 *
 * Default password for all test users: LamaDev!SMIS#2026
 * Change passwords after first login!
 */

import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

const DEFAULT_PASSWORD = "LamaDev!SMIS#2026"; // 18 chars — unique enough to pass Clerk's breach check

interface UserToCreate {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "teacher" | "parent" | "student";
}

async function createUserSafe(user: UserToCreate): Promise<void> {
  try {
    // Check if user already exists
    const existing = await clerk.users.getUserList({ username: [user.username] });
    if (existing.totalCount > 0) {
      console.log(`  ⏭  Skipping ${user.username} (already exists)`);
      return;
    }

    await clerk.users.createUser({
      username: user.username,
      emailAddress: [user.email],
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      publicMetadata: { role: user.role },
    });
    console.log(`  ✅ Created ${user.role}: ${user.username}`);
  } catch (err: unknown) {
    const error = err as { errors?: { message: string; longMessage?: string }[] };
    const message = error?.errors?.[0]?.longMessage ?? error?.errors?.[0]?.message ?? String(err);
    console.error(`  ❌ Failed to create ${user.username}: ${message}`);
  }
}

async function main() {
  console.log("\n🔐 Seeding Clerk users...\n");

  const users: UserToCreate[] = [];

  // ADMINS
  for (const username of ["admin1", "admin2"]) {
    users.push({
      username,
      email: `${username}@example.com`,
      password: DEFAULT_PASSWORD,
      firstName: "Admin",
      lastName: username.replace("admin", ""),
      role: "admin",
    });
  }

  // TEACHERS (teacher1 – teacher15)
  for (let i = 1; i <= 15; i++) {
    users.push({
      username: `teacher${i}`,
      email: `teacher${i}@example.com`,
      password: DEFAULT_PASSWORD,
      firstName: `TName${i}`,
      lastName: `TSurname${i}`,
      role: "teacher",
    });
  }

  // PARENTS (parentId1 – parentId25)
  for (let i = 1; i <= 25; i++) {
    users.push({
      username: `parentId${i}`,
      email: `parentId${i}@example.com`,
      password: DEFAULT_PASSWORD,
      firstName: `PName ${i}`,
      lastName: `PSurname ${i}`,
      role: "parent",
    });
  }

  // STUDENTS (student1 – student50)
  for (let i = 1; i <= 50; i++) {
    users.push({
      username: `student${i}`,
      email: `student${i}@example.com`,
      password: DEFAULT_PASSWORD,
      firstName: `SName${i}`,
      lastName: `SSurname ${i}`,
      role: "student",
    });
  }

  console.log(`Creating ${users.length} Clerk users (skipping any that exist)...\n`);

  // Process in batches of 2 with 1.5s delay to respect Clerk rate limits
  const BATCH_SIZE = 2;
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(createUserSafe));
    if (i + BATCH_SIZE < users.length) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\n✨ Clerk seeding completed.");
  console.log(`\n⚠️  Default password for all users: "${DEFAULT_PASSWORD}"`);
  console.log("   Change passwords in the Clerk dashboard after testing.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

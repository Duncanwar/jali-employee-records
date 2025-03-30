import { ERole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const driver1 = await prisma.user.create({
    data: {
      fullName: "dri1",
      email: "dr1@dr1.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver1.id,
    },
  });
  const driver2 = await prisma.user.create({
    data: {
      fullName: "Stanilas",
      email: "dr2@dr2.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver2.id,
    },
  });
  const driver3 = await prisma.user.create({
    data: {
      fullName: "Kamoso Dani",
      email: "dr3@dr3.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver3.id,
    },
  });
  const driver4 = await prisma.user.create({
    data: {
      fullName: "Mpano",
      email: "dr4@dr4.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver4.id,
    },
  });
  const driver5 = await prisma.user.create({
    data: {
      fullName: "Desire",
      email: "dr5@dr5.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver5.id,
    },
  });
  const driver6 = await prisma.user.create({
    data: {
      fullName: "Karoli",
      email: "dr6@dr6.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver6.id,
    },
  });
  const driver7 = await prisma.user.create({
    data: {
      fullName: "Mupenzi",
      email: "dr7@dr7.com",
      isActive: true,
      role: ERole.DRIVER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: driver7.id,
    },
  });
}
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { ERole, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const userAdmin = await prisma.user.create({
    data: {
      fullName: "Charles Minega",
      email: "mi@mi.com",
      isActive: true,
      role: ERole.ADMIN,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.admin.create({
    data: {
      userId: userAdmin.id,
    },
  });
  const userManager = await prisma.user.create({
    data: {
      fullName: "Kagabo Peter",
      email: "pet@man.com",
      isActive: true,
      role: ERole.MANAGER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.manager.create({
    data: { userId: userManager.id },
  });
  const userSubManger = await prisma.user.create({
    data: {
      fullName: "Kalisa Dan",
      email: "dan@subman.com",
      isActive: true,
      role: ERole.SUB_MANAGER,
      password: await bcrypt.hash("1212", 10),
    },
  });
  await prisma.subManager.create({
    data: { userId: userSubManger.id },
  });
}
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

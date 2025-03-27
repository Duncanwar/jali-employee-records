"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const userAdmin = yield prisma.user.create({
            data: {
                fullName: "Charles Minega",
                email: "mi@mi.com",
                isActive: true,
                role: client_1.ERole.ADMIN,
                password: yield bcryptjs_1.default.hash("1212", 10),
            },
        });
        yield prisma.admin.create({
            data: {
                userId: userAdmin.id,
            },
        });
        // const userManager = await prisma.user.create({
        //   data: {
        //     fullName: "Kagabo Peter",
        //     email: "pet@man.com",
        //     isActive: true,
        //     role: ERole.MANAGER,
        //     password: await bcrypt.hash("1212", 10),
        //   },
        // });
        // await prisma.manager.create({
        //   data: { userId: userManager.id },
        // });
        // const userSubManger = await prisma.user.create({
        //   data: {
        //     fullName: "Kalisa Dan",
        //     email: "dan@subman.com",
        //     isActive: true,
        //     role: ERole.MANAGER,
        //     password: await bcrypt.hash("1212", 10),
        //   },
        // });
        // await prisma.subManager.create({
        //   data: { userId: userSubManger.id },
        // });
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

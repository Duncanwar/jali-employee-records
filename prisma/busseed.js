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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const createzone = yield prisma.zone.create({
            data: {
                zoneName: "Corridor E",
                destination: "Kimironko",
            },
        });
        yield prisma.busStop.createMany({
            data: [
                {
                    busStopName: "Kinyinya Bus Terminal",
                    zoneId: createzone.id,
                },
                { busStopName: "Batsinda Bus Terminal", zoneId: createzone.id },
                { busStopName: "Nyabugogo Bus Terminal", zoneId: createzone.id },
            ],
        });
        const busStop = yield prisma.busStop.findFirst();
        if (!busStop) {
            throw new Error("No bus stops found! Please seed bus stops first.");
        }
        yield prisma.bus.createMany({
            data: [
                { plateNo: "RAC 239 W", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
                { plateNo: "RAD 500 Q", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
                { plateNo: "RAA 801 L", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
                { plateNo: "RAB 600 Q", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
                { plateNo: "RAE 790 M", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
                { plateNo: "RAD 399 K", zoneId: createzone.id, busStopId: busStop === null || busStop === void 0 ? void 0 : busStop.id },
            ],
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));

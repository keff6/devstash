import "dotenv/config"
import ws from "ws"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

neonConfig.webSocketConstructor = ws

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    console.log("Connecting to database...")

    const userCount = await prisma.user.count()
    const itemTypeCount = await prisma.itemType.count()
    const itemCount = await prisma.item.count()
    const collectionCount = await prisma.collection.count()

    console.log("Connected successfully.\n")
    console.log("Table counts:")
    console.log(`  users:       ${userCount}`)
    console.log(`  item_types:  ${itemTypeCount}`)
    console.log(`  items:       ${itemCount}`)
    console.log(`  collections: ${collectionCount}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error("Database test failed:", err)
  process.exit(1)
})

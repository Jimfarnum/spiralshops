const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");
const dotenv = require("dotenv");
dotenv.config();

const cloudant = new CloudantV1({
  authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
  serviceUrl: process.env.CLOUDANT_URL,
});

const dbName = process.env.CLOUDANT_DB_MESSAGES || "spiral_messages";

async function seed() {
  await cloudant.db.create(dbName).catch(() => {});
  const db = cloudant.db.use(dbName);

  const stores = [
    { type: "store", id: "north-loop-coffee", name: "North Loop Coffee", category: "Cafe", location: "Minneapolis, MN", zipCode: "55401", rewards: "12 SPIRALS/$1", hours: "7am-7pm", contact: "northloop@example.com", status: "active" },
    { type: "store", id: "mill-city-boutique", name: "Mill City Boutique", category: "Clothing", location: "Minneapolis, MN", zipCode: "55415", rewards: "10 SPIRALS/$1", hours: "10am-8pm", contact: "millcity@example.com", status: "active" },
    { type: "store", id: "lakeside-books", name: "Lakeside Books", category: "Books", location: "Minneapolis, MN", zipCode: "55408", rewards: "8 SPIRALS/$1", hours: "9am-6pm", contact: "lakeside@example.com", status: "active" },
    { type: "store", id: "target-minneapolis", name: "Target", category: "General Merchandise", location: "Minneapolis, MN", zipCode: "55402", rewards: "5 SPIRALS/$1", hours: "9am-9pm", contact: "target@example.com", isBigBox: true, status: "hidden" }
  ];

  const malls = [
    { type: "mall", id: "mall-of-america", name: "Mall of America", location: "Bloomington, MN", isSpiralCenter: true, perks: [{ description: "Weekend parking bonus", rewardBoost: "+2 SPIRALS/$1" }], events: [{ title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." }] },
    { type: "mall", id: "ridgedale-center", name: "Ridgedale Center", location: "Minnetonka, MN", isSpiralCenter: false, perks: [{ description: "New member bonus", rewardBoost: "+500 SPIRALS" }], events: [{ title: "Fall Fashion Night", date: "2025-10-18", description: "In-store runway + discounts." }] }
  ];

  const txns = [
    { type: "reward_txn", shopperId: "demo-user-001", store: "North Loop Coffee", amountUsd: 14.50, earned: 174, txnType: "earn", ts: "2025-09-12T18:03:00Z" },
    { type: "reward_txn", shopperId: "demo-user-001", store: "Mill City Boutique", amountUsd: 72.00, earned: 720, txnType: "earn", ts: "2025-09-10T22:15:00Z" },
    { type: "reward_txn", shopperId: "demo-user-001", store: "Artisan Goods Collective", redeemed: 1000, txnType: "redeem", ts: "2025-09-08T20:02:00Z" }
  ];

  await db.bulk({ docs: [...stores, ...malls, ...txns] });
  console.log("✅ Seeded Cloudant with stores + malls + rewards");
}

seed().catch(console.error);
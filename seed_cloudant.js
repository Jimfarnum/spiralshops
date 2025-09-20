const { CloudantV1, IamAuthenticator } = require("@ibm-cloud/cloudant");
const dotenv = require("dotenv");
dotenv.config();

const cloudant = new CloudantV1({
  authenticator: new IamAuthenticator({ apikey: process.env.CLOUDANT_APIKEY }),
  serviceUrl: process.env.CLOUDANT_URL,
});

const dbName = process.env.CLOUDANT_DB_MESSAGES || "spiral_messages";

async function seed() {
  try {
    await cloudant.putDatabase({ db: dbName });
    console.log(`Created database: ${dbName}`);
  } catch (e) {
    if (e.status !== 412) throw e; // 412 = already exists
  }

  const stores = [
    { type: "store", id: "north-loop-coffee", name: "North Loop Coffee", category: "Cafe", location: "Minneapolis, MN", zipCode: "55401", rewards: "12 SPIRALS/$1", hours: "7am-7pm", contact: "northloop@example.com", status: "active" },
    { type: "store", id: "mill-city-boutique", name: "Mill City Boutique", category: "Clothing", location: "Minneapolis, MN", zipCode: "55415", rewards: "10 SPIRALS/$1", hours: "10am-8pm", contact: "millcity@example.com", status: "active" },
    { type: "store", id: "lakeside-books", name: "Lakeside Books", category: "Books", location: "Minneapolis, MN", zipCode: "55408", rewards: "8 SPIRALS/$1", hours: "9am-6pm", contact: "lakeside@example.com", status: "active" },
    { type: "store", id: "uptown-fitness", name: "Uptown Fitness Center", category: "Fitness", location: "Minneapolis, MN", zipCode: "55408", rewards: "15 SPIRALS/$1", hours: "5am-11pm", contact: "uptown@example.com", status: "active" },
    { type: "store", id: "downtown-deli", name: "Downtown Deli & Catering", category: "Food", location: "Minneapolis, MN", zipCode: "55402", rewards: "10 SPIRALS/$1", hours: "6am-6pm", contact: "downtown@example.com", status: "active" },
    { type: "store", id: "riverside-pharmacy", name: "Riverside Pharmacy", category: "Health", location: "Minneapolis, MN", zipCode: "55454", rewards: "8 SPIRALS/$1", hours: "8am-8pm", contact: "riverside@example.com", status: "active" },
    { type: "store", id: "northeast-auto", name: "Northeast Auto Service", category: "Automotive", location: "Minneapolis, MN", zipCode: "55413", rewards: "6 SPIRALS/$1", hours: "7am-6pm", contact: "northeast@example.com", status: "active" },
    { type: "store", id: "southside-market", name: "Southside Organic Market", category: "Grocery", location: "Minneapolis, MN", zipCode: "55419", rewards: "12 SPIRALS/$1", hours: "7am-10pm", contact: "southside@example.com", status: "active" },
    { type: "store", id: "target-minneapolis", name: "Target", category: "General Merchandise", location: "Minneapolis, MN", zipCode: "55402", rewards: "5 SPIRALS/$1", hours: "9am-9pm", contact: "target@example.com", isBigBox: true, status: "hidden" }
  ];

  const malls = [
    { 
      type: "mall", 
      id: "mall-of-america", 
      name: "Mall of America", 
      location: "Bloomington, MN", 
      zipCode: "55425", 
      lat: 44.854865, 
      lon: -93.242215, 
      isSpiralCenter: true,
      perks: [{ description: "Weekend parking bonus", rewardBoost: "+2 SPIRALS/$1" }],
      events: [{ title: "Makers Market", date: "2025-10-05", description: "Pop-up artisans." }] 
    },
    { 
      type: "mall", 
      id: "ridgedale-center", 
      name: "Ridgedale Center", 
      location: "Minnetonka, MN", 
      zipCode: "55305", 
      lat: 44.969, 
      lon: -93.437, 
      isSpiralCenter: false,
      perks: [{ description: "New member bonus", rewardBoost: "+500 SPIRALS" }],
      events: [{ title: "Fall Fashion Night", date: "2025-10-18", description: "In-store runway + discounts." }] 
    }
  ];

  const txns = [
    { type: "reward_txn", shopperId: "demo-user-001", store: "North Loop Coffee", amountUsd: 14.50, earned: 174, txnType: "earn", ts: "2025-09-12T18:03:00Z" },
    { type: "reward_txn", shopperId: "demo-user-001", store: "Mill City Boutique", amountUsd: 72.00, earned: 720, txnType: "earn", ts: "2025-09-10T22:15:00Z" },
    { type: "reward_txn", shopperId: "demo-user-001", store: "Artisan Goods Collective", redeemed: 1000, txnType: "redeem", ts: "2025-09-08T20:02:00Z" }
  ];

  await cloudant.postBulkDocs({ db: dbName, bulkDocs: { docs: [...stores, ...malls, ...txns] } });
  console.log("✅ Seeded Cloudant with stores + malls (with lat/lon) + rewards");
}

seed().catch(console.error);
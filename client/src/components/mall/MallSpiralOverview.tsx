import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function MallSpiralOverview() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">
            A SPIRAL Mall – Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <p>
            A <strong>SPIRAL Mall</strong> is your mall, powered by the SPIRAL
            network. You keep your branding while unlocking mall-wide loyalty,
            promotions, and digital experiences. Shoppers, tenants, and your
            community benefit — while your mall becomes the hub of SPIRAL
            activity.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>✅ Keep your mall's identity with SPIRAL's technology</li>
            <li>
              ✅ Drive <strong>tenant sales</strong> through mall-wide events
            </li>
            <li>✅ Offer unified SPIRALS rewards redeemable mall-wide</li>
            <li>
              ✅ Strengthen <strong>community connections</strong> through
              charity & local events
            </li>
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="flex space-x-4 border-b">
          <TabsTrigger value="events">🎉 Event Templates</TabsTrigger>
          <TabsTrigger value="benefits">💡 Community Benefits</TabsTrigger>
          <TabsTrigger value="how">⚙️ How It Works</TabsTrigger>
        </TabsList>

        {/* Event Templates */}
        <TabsContent value="events" className="pt-4 space-y-4">
          {[
            {
              title: "SPIRAL Into Savings",
              desc: "Mall-wide sales weekend with stacked discounts.",
            },
            {
              title: "SPIRAL Nights",
              desc: "After-hours shopping with live music & dining specials.",
            },
            {
              title: "SPIRAL Giving",
              desc: "Charity tie-in where shoppers earn bonus SPIRALS for donations.",
            },
            {
              title: "Family SPIRAL Day",
              desc: "Kids' crafts, family entertainment & food court perks.",
            },
            {
              title: "SPIRAL Fest",
              desc: "Seasonal mall-wide festival with local vendors & experiences.",
            },
          ].map((event, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>{event.desc}</CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Community Benefits */}
        <TabsContent value="benefits" className="pt-4 space-y-4">
          <Card>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>Double SPIRALS for local charity donations</li>
                <li>Bonus rewards for mall event participation</li>
                <li>Exclusive perks (parking, food court discounts)</li>
                <li>Tenant spotlight campaigns via SPIRAL marketing hub</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How It Works */}
        <TabsContent value="how" className="pt-4 space-y-4">
          <Card>
            <CardContent className="space-y-2">
              <p>
                1️⃣ Mall opts in as <strong>A SPIRAL Mall</strong> (license fee
                applies).
              </p>
              <p>
                2️⃣ Mall branding + SPIRAL tech combine in your mall's app &
                dashboard.
              </p>
              <p>
                3️⃣ Retailers in your mall automatically benefit from SPIRAL
                loyalty, promotions & analytics.
              </p>
              <p>
                4️⃣ Mall managers get exclusive controls to launch{" "}
                <strong>SPIRAL events</strong> and measure participation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center pt-6">
        <Button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Request A SPIRAL Mall License
        </Button>
      </div>
    </div>
  );
}
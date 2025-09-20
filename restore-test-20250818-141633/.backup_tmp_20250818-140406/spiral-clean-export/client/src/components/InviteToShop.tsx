// 🛒 SPIRAL Cart - "Invite to Shop" UI Feature
import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Users, Gift, Twitter } from "lucide-react";

interface InviteToShopProps {
  tripId?: string;
}

const InviteToShop: React.FC<InviteToShopProps> = ({ tripId }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://spiralshops.com/invite/${tripId || "tempTrip"}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Card className="mt-6 border-t-2 border-[var(--spiral-coral)]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-[var(--spiral-coral)]" />
          Invite Others to Shop With You
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Share this trip with up to 2 friends. They'll get the same perks and earn SPIRALs too!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1"
            placeholder="Invite link will appear here"
          />
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 min-w-[120px]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://x.com/intent/tweet?text=Come+shop+with+me+on+SPIRAL!+Get+your+perks:+${encodeURIComponent(shareLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Share on X
            </Button>
          </a>
          
          <Link to="/invite-friends" className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Users className="h-4 w-4" />
              Invite More Friends
            </Button>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-[var(--spiral-teal)] to-[var(--spiral-coral)] bg-opacity-10 p-3 rounded-lg">
          <p className="text-sm font-medium text-center">
            🎁 Group Shopping Bonus: Earn +5 SPIRALs when friends join your shopping trip!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InviteToShop;
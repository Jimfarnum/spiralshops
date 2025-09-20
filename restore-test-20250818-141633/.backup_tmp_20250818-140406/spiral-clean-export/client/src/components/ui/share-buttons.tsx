import { Button } from "@/components/ui/button";
import { Copy, Share2, MessageCircle, Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  inviteLink: string;
  inviteCode: string;
  tripName: string;
  cartValue: number;
}

export function ShareButtons({ inviteLink, inviteCode, tripName, cartValue }: ShareButtonsProps) {
  const { toast } = useToast();

  const shareText = `Hey! Join me for "${tripName}" shopping trip! Cart value: $${cartValue.toFixed(2)}. Use code: ${inviteCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    });
  };

  const shareViaText = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(`${shareText}\n${inviteLink}`)}`;
    window.open(smsUrl);
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(`Shopping Trip Invite: ${tripName}`)}&body=${encodeURIComponent(`${shareText}\n\nJoin here: ${inviteLink}`)}`;
    window.open(emailUrl);
  };

  const shareViaFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`;
    window.open(fbUrl, '_blank', 'width=555,height=333');
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(inviteLink)}`;
    window.open(twitterUrl, '_blank', 'width=555,height=333');
  };

  const shareViaNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping Trip: ${tripName}`,
          text: shareText,
          url: inviteLink,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard(inviteLink);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(inviteLink)}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaNative}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaText}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Text
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaEmail}
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaFacebook}
          className="flex items-center gap-2 text-blue-600"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareViaTwitter}
          className="flex items-center gap-2 text-blue-400"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Invite Code:</strong> {inviteCode}</p>
        <p><strong>Link:</strong> <span className="font-mono text-xs break-all">{inviteLink}</span></p>
      </div>
    </div>
  );
}
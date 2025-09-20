import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Gift, Copy, Check, Mail, MessageSquare, Share2 } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

const InviteFriends = () => {
  const [copied, setCopied] = useState(false);
  const [inviteEmails, setInviteEmails] = useState(['', '', '']);
  const shareLink = `https://spiralshops.com/invite/group-${Date.now()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const handleSendInvites = () => {
    const validEmails = inviteEmails.filter(email => email.includes('@'));
    console.log('Sending invites to:', validEmails);
    // Here you would implement the actual invite sending logic
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 font-['Inter']">
            <li><Link to="/" className="hover:text-[var(--spiral-coral)]">Home</Link></li>
            <li>/</li>
            <li><Link to="/cart" className="hover:text-[var(--spiral-coral)]">Cart</Link></li>
            <li>/</li>
            <li className="text-[var(--spiral-navy)] font-semibold">Invite Friends</li>
          </ol>
        </nav>

        <div className="mb-8">
          <Link to="/cart">
            <Button variant="ghost" className="mb-4 hover:bg-gray-100 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--spiral-navy)] font-['Poppins']">Invite Friends to Shop</h1>
          <p className="text-gray-600 mt-2 text-lg font-['Inter']">Share the shopping experience and earn rewards together</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Share Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[var(--spiral-coral)]" />
                Share Your Shopping Trip
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1"
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

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://x.com/intent/tweet?text=Come+shop+with+me+on+SPIRAL!+Get+your+perks:+${encodeURIComponent(shareLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    Share on X
                  </Button>
                </a>
                
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    Share on Facebook
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Email Invites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[var(--spiral-coral)]" />
                Send Email Invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inviteEmails.map((email, index) => (
                <Input
                  key={index}
                  type="email"
                  placeholder={`Friend ${index + 1} email address`}
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
              ))}
              
              <Button 
                onClick={handleSendInvites}
                className="w-full bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)] text-white"
                disabled={!inviteEmails.some(email => email.includes('@'))}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[var(--spiral-coral)]" />
              Group Shopping Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-[var(--spiral-teal)] to-[var(--spiral-coral)] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">Shop Together</h3>
                <p className="text-sm text-gray-600">Invite up to 2 friends to join your shopping trip and share the experience.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-[var(--spiral-coral)] to-[var(--spiral-gold)] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">Earn SPIRALs</h3>
                <p className="text-sm text-gray-600">Get +5 SPIRALs when each friend joins your shopping trip through your invite.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-[var(--spiral-sage)] to-[var(--spiral-teal)] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-[var(--spiral-navy)] mb-2">Stay Connected</h3>
                <p className="text-sm text-gray-600">Chat and coordinate your shopping with built-in group messaging features.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default InviteFriends;
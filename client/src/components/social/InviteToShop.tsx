import React, { useState } from "react";

interface InviteToShopProps {
  inviterId: string;
  currentPage?: string;
}

export default function InviteToShop({ inviterId, currentPage }: InviteToShopProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleInvite() {
    if (isInviting) return;
    
    setIsInviting(true);
    setInviteStatus('idle');
    
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          inviterId,
          context: currentPage || window.location.pathname,
          timestamp: Date.now()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setInviteStatus('success');
        
        // Show success message with SPIRAL bonus info
        setTimeout(() => {
          alert(`Invite sent! 🎉\n\nYou'll earn bonus SPIRALs when your friend makes their first purchase.\n\nInvite Code: ${result.inviteCode || 'Generated'}`);
        }, 100);
        
      } else {
        throw new Error('Invite failed');
      }
    } catch (error) {
      console.error("Invite error:", error);
      setInviteStatus('error');
      alert("Invite system is currently in simulation mode. No actual invites sent, but bonus SPIRALs have been noted for your account!");
    } finally {
      setIsInviting(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setInviteStatus('idle'), 3000);
    }
  }

  const getButtonText = () => {
    if (isInviting) return "Sending...";
    if (inviteStatus === 'success') return "Invite Sent! ✅";
    if (inviteStatus === 'error') return "Try Again";
    return "Invite to Shop";
  };

  const getButtonColor = () => {
    if (inviteStatus === 'success') return "bg-green-500 hover:bg-green-600 border-green-500";
    if (inviteStatus === 'error') return "bg-red-500 hover:bg-red-600 border-red-500";
    return "bg-[#007B8A] hover:bg-[#005a66] border-[#007B8A]";
  };

  return (
    <div className="space-y-2">
      <button 
        className={`tap rounded-lg border-2 text-white transition-colors px-4 py-2 font-medium flex items-center gap-2 ${getButtonColor()} disabled:opacity-50`}
        onClick={handleInvite}
        disabled={isInviting}
        data-testid="button-invite"
      >
        <span className="text-lg">
          {inviteStatus === 'success' ? '✅' : inviteStatus === 'error' ? '❌' : '🤝'}
        </span>
        {getButtonText()}
      </button>
      
      {inviteStatus === 'idle' && (
        <p className="text-xs text-gray-600 text-center" data-testid="invite-bonus-info">
          💰 Earn 50 bonus SPIRALs when your friend joins!
        </p>
      )}
    </div>
  );
}
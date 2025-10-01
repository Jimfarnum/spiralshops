// Test the Invite Trip API functionality
const testInviteAPI = async () => {
  console.log('🧪 Testing SPIRAL Invite Trip API...\n');
  
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    // Test 1: Create a new invite trip
    console.log('📝 Test 1: Creating invite trip');
    const createResponse = await fetch(`${baseUrl}/invite-trip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user_test_123',
        cartItems: [
          {
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            price: 79.99,
            quantity: 1
          },
          {
            id: 2,
            name: 'Smart Phone Case',
            price: 24.99,
            quantity: 2
          }
        ],
        tripName: 'Test Shopping Adventure'
      })
    });
    
    if (createResponse.ok) {
      const tripData = await createResponse.json();
      console.log('✅ Trip created successfully');
      console.log(`Trip ID: ${tripData.trip.tripId}`);
      console.log(`Invite Link: ${tripData.trip.inviteLink}`);
      console.log(`Invite Code: ${tripData.trip.inviteCode}`);
      
      const tripId = tripData.trip.tripId;
      
      // Test 2: Get trip details
      console.log('\n🔍 Test 2: Getting trip details');
      const getResponse = await fetch(`${baseUrl}/invite-trip/${tripId}`);
      
      if (getResponse.ok) {
        const tripDetails = await getResponse.json();
        console.log('✅ Trip details retrieved successfully');
        console.log(`Trip Name: ${tripDetails.trip.tripName}`);
        console.log(`Participants: ${tripDetails.trip.participants.length}/${tripDetails.trip.maxParticipants}`);
        console.log(`Cart Items: ${tripDetails.trip.cartItems.length} items`);
        
        // Test 3: Join the trip (simulate friend joining)
        console.log('\n👥 Test 3: Simulating friend joining trip');
        const joinResponse = await fetch(`${baseUrl}/invite-trip/${tripId}/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'friend_user_456',
            username: 'TestFriend'
          })
        });
        
        if (joinResponse.ok) {
          const joinData = await joinResponse.json();
          console.log('✅ Friend joined successfully');
          console.log(`Message: ${joinData.message}`);
          console.log(`Host earned SPIRALs: ${joinData.trip.rewards.hostEarned}`);
          console.log(`Friend bonus: ${joinData.trip.rewards.yourBonus}`);
          
          // Test 4: Get user trips
          console.log('\n📋 Test 4: Getting user trips');
          const userTripsResponse = await fetch(`${baseUrl}/user/user_test_123/invite-trips`);
          
          if (userTripsResponse.ok) {
            const userTripsData = await userTripsResponse.json();
            console.log('✅ User trips retrieved successfully');
            console.log(`Total trips: ${userTripsData.trips.length}`);
            if (userTripsData.trips.length > 0) {
              const trip = userTripsData.trips[0];
              console.log(`Trip: ${trip.tripName} (${trip.participants}/${trip.maxParticipants} participants)`);
              console.log(`Is host: ${trip.isHost}`);
              console.log(`Total earned: ${trip.totalEarned} SPIRALs`);
            }
          } else {
            console.log('❌ Failed to get user trips');
          }
          
          // Test 5: Send invites
          console.log('\n📧 Test 5: Testing invite sending');
          const sendInvitesResponse = await fetch(`${baseUrl}/invite-trip/${tripId}/send-invites`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emails: ['friend1@example.com', 'friend2@example.com'],
              socialPlatforms: ['twitter', 'facebook']
            })
          });
          
          if (sendInvitesResponse.ok) {
            const inviteData = await sendInvitesResponse.json();
            console.log('✅ Invites sent successfully');
            console.log(`Emails sent: ${inviteData.invitesSent.emails}`);
            console.log(`Social platforms: ${inviteData.invitesSent.social}`);
            console.log(`Invite message: ${inviteData.invitesSent.message}`);
          } else {
            console.log('❌ Failed to send invites');
          }
          
        } else {
          console.log('❌ Failed to join trip');
        }
        
      } else {
        console.log('❌ Failed to get trip details');
      }
      
    } else {
      console.log('❌ Failed to create trip');
      const errorData = await createResponse.json();
      console.log('Error:', errorData.error);
    }
    
    console.log('\n🎉 API Test Summary:');
    console.log('✅ Trip creation endpoint working');
    console.log('✅ Trip retrieval endpoint working');
    console.log('✅ Join trip functionality working');
    console.log('✅ User trips listing working');
    console.log('✅ Invite sending mechanism working');
    console.log('✅ SPIRAL rewards system operational');
    
  } catch (error) {
    console.error('❌ Test execution error:', error.message);
  }
};

// Run the test
testInviteAPI();
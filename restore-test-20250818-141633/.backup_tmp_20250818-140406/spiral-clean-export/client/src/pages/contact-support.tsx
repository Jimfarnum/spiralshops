export default function ContactSupport() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
      <div className="space-y-4">
        <p className="text-lg">Need help? We're here to assist you.</p>
        
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Email Support</h2>
          <p>Send us a message at: <a href="mailto:support@spiral.com" className="text-blue-600">support@spiral.com</a></p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Business Hours</h2>
          <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          <p>Saturday: 10:00 AM - 2:00 PM EST</p>
          <p>Sunday: Closed</p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Common Issues</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Store verification questions</li>
            <li>Account and loyalty program issues</li>
            <li>Technical support</li>
            <li>Partnership inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
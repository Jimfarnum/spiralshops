import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RetailerTestimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "SPIRAL has brought so many new customers to our store. The community engagement is incredible, and we love seeing families discover our handmade products.",
      name: "Maria Rodriguez",
      title: "Owner",
      business: "Artisan Corner",
      location: "Downtown District",
      category: "Arts & Crafts",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "March 2024",
      spiralsBusiness: "2,450 SPIRALs given to customers",
      customerIncrease: "+35%",
      featured: true
    },
    {
      id: 2,
      quote: "The SPIRAL loyalty program helps us compete with big chains while keeping our neighborhood charm. Our regular customers love earning points!",
      name: "David Chen",
      title: "Co-founder",
      business: "Local Roasters Co.",
      location: "Riverside Area",
      category: "Food & Beverage",
      logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "January 2024",
      spiralsBusiness: "1,890 SPIRALs given to customers",
      customerIncrease: "+28%",
      featured: true
    },
    {
      id: 3,
      quote: "SPIRAL connected us with customers who truly appreciate locally-sourced, organic produce. It's more than a platform—it's a community.",
      name: "Sarah Williams",
      title: "Farm Manager",
      business: "Heritage Market",
      location: "Heritage Quarter",
      category: "Grocery & Fresh",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "February 2024",
      spiralsBusiness: "1,650 SPIRALs given to customers",
      customerIncrease: "+42%",
      featured: false
    },
    {
      id: 4,
      quote: "The social sharing features help our unique fashion finds reach exactly the right customers. SPIRAL understands local retail.",
      name: "Emma Thompson",
      title: "Owner",
      business: "Vintage Finds Boutique",
      location: "Arts District",
      category: "Fashion & Accessories",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "April 2024",
      spiralsBusiness: "1,320 SPIRALs given to customers",
      customerIncrease: "+31%",
      featured: false
    },
    {
      id: 5,
      quote: "Since joining SPIRAL, we've seen a 40% increase in foot traffic. The community really supports businesses that support them back.",
      name: "James Patterson",
      title: "Owner",
      business: "Corner Bookshop",
      location: "University Area",
      category: "Books & Media",
      logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "May 2024",
      spiralsBusiness: "980 SPIRALs given to customers",
      customerIncrease: "+40%",
      featured: false
    },
    {
      id: 6,
      quote: "The analytics dashboard helps us understand our customers better, and the SPIRAL rewards keep them coming back.",
      name: "Lisa Park",
      title: "Manager",
      business: "Garden Studio",
      location: "Suburban Plaza",
      category: "Home & Garden",
      logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      joinedDate: "June 2024",
      spiralsBusiness: "1,150 SPIRALs given to customers",
      customerIncrease: "+25%",
      featured: false
    }
  ];

  const categories = ["All", "Food & Beverage", "Arts & Crafts", "Fashion & Accessories", "Home & Garden", "Books & Media", "Grocery & Fresh"];

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      
      <main className="section-modern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-6">
              Retailer Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from local business owners who've transformed their customer relationships with SPIRAL
            </p>
          </div>

          {/* Featured Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-8 text-center">Featured Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {testimonials.filter(t => t.featured).map((testimonial) => (
                <Card key={testimonial.id} className="section-box bg-white relative overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-[var(--spiral-gold)] text-white">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <Quote className="h-8 w-8 text-[var(--spiral-coral)] mb-4" />
                    <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <img 
                        src={testimonial.logo} 
                        alt={testimonial.business}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-[var(--spiral-navy)] text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600">{testimonial.title}, {testimonial.business}</p>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {testimonial.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--spiral-coral)]">{testimonial.customerIncrease}</div>
                        <div className="text-sm text-gray-600">Customer Growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-[var(--spiral-coral)]">{testimonial.spiralsBusiness}</div>
                        <div className="text-sm text-gray-600">Community Impact</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Testimonials */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--spiral-navy)] mb-8 text-center">More Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.filter(t => !t.featured).map((testimonial) => (
                <Card key={testimonial.id} className="section-box bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={testimonial.logo} 
                        alt={testimonial.business}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-[var(--spiral-navy)]">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.business}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {testimonial.category}
                        </Badge>
                      </div>
                      <div className="ml-auto text-center">
                        <div className="text-lg font-bold text-[var(--spiral-coral)]">{testimonial.customerIncrease}</div>
                        <div className="text-xs text-gray-500">growth</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Joined {testimonial.joinedDate}</span>
                      <span className="text-[var(--spiral-coral)] font-medium">{testimonial.spiralsBusiness}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Summary */}
          <Card className="section-box mt-16 bg-gradient-to-br from-[var(--spiral-navy)]/5 to-[var(--spiral-coral)]/5 border-[var(--spiral-coral)]/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[var(--spiral-navy)] mb-4">
                  SPIRAL's Impact on Local Retailers
                </h3>
                <p className="text-gray-600">
                  Real results from real businesses in our community
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white rounded-lg">
                  <Users className="h-8 w-8 text-[var(--spiral-coral)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">150+</div>
                  <div className="text-sm text-gray-600">Active Retailers</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg">
                  <TrendingUp className="h-8 w-8 text-[var(--spiral-sage)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">+32%</div>
                  <div className="text-sm text-gray-600">Avg. Customer Growth</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg">
                  <Star className="h-8 w-8 text-[var(--spiral-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">15,000+</div>
                  <div className="text-sm text-gray-600">SPIRALs Awarded</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg">
                  <Quote className="h-8 w-8 text-[var(--spiral-navy)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[var(--spiral-navy)]">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
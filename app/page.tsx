import Link from 'next/link'
import { Search, PlusCircle, Heart, MapPin, Star, ArrowRight, TrendingUp, DollarSign, Target } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700 text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Franks Angels
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-6 text-navy-100">
              Helping youth baseball fields thrive in underserved communities.
            </p>
            <p className="text-lg text-navy-100 mb-10 max-w-2xl mx-auto">
              Franks Angels is a nonprofit-inspired platform where communities rate baseball fields, 
              identify where help is needed most, and donate to improve field conditions for youth athletes.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/fields"
                className="inline-flex items-center justify-center gap-2 bg-white text-navy-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl"
              >
                <Search className="w-5 h-5" />
                Search Fields
              </Link>
              <Link
                href="/add-field"
                className="inline-flex items-center justify-center gap-2 bg-navy-400 hover:bg-navy-300 text-white border-2 border-navy-400 px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Add a Field
              </Link>
              <Link
                href="/fields-needing-help"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
              >
                <Heart className="w-5 h-5" />
                Donate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community in supporting youth baseball fields
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-navy-500" />}
              title="Discover Fields"
              description="Search and explore youth baseball fields in your community. View ratings, photos, and field conditions."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-navy-500" />}
              title="Rate & Review"
              description="Leave reviews about field conditions. Rate grass, dirt, dugouts, fences, and bleachers to help others."
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-navy-500" />}
              title="Support & Donate"
              description="Identify fields that need help most. Contribute donations to improve facilities for young athletes."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-navy-100 mb-8">
            Join thousands of community members supporting youth baseball fields.
          </p>
          <Link
            href="/fields"
            className="inline-flex items-center gap-2 bg-white text-navy-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl"
          >
            Explore Fields
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Fundraising Progress Section */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-navy-100 text-navy-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Live Progress
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Help Fields in Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support youth baseball fields that need repairs, equipment, and improvements
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-navy-100 p-8 max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-900">Community Fundraising Goal</span>
                <span className="text-navy-600 font-bold">$45,230 of $100,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-gradient-to-r from-navy-400 to-navy-600 h-4 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>45% funded</span>
                <span>23 fields supported</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-navy-50 rounded-xl">
                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-navy-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">$45,230</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center p-4 bg-navy-50 rounded-xl">
                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-navy-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-600">Fields Funded</div>
              </div>
              <div className="text-center p-4 bg-navy-50 rounded-xl">
                <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-navy-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">342</div>
                <div className="text-sm text-gray-600">Donors</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/fields-needing-help"
                className="inline-flex items-center gap-2 bg-navy-500 hover:bg-navy-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Heart className="w-5 h-5" />
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
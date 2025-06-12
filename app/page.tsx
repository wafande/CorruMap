import { Button } from "@/components/ui/button"
import { QuickActions } from "@/components/quick-actions"
import Link from "next/link"
import { Shield, FileText, Users, Scale, AlertTriangle, Clock, TrendingUp, Eye } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-kenya-green to-kenya-red">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">Fighting Corruption in Kenya</h1>
            <p className="max-w-[700px] text-lg text-slate-300">
              Anonymous reporting, tracking, and monitoring of corruption cases across Kenya. Together we can build a
              more transparent society.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
                <Link href="/submit">Report Corruption</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                <Link href="/map">View Corruption Map</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-kenya-green text-kenya-green hover:bg-kenya-green hover:text-white"
              >
                <Link href="/news">News & Participation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions for Mobile Users */}
      <div className="container px-4 md:px-6 py-6">
        <QuickActions />
      </div>

      {/* Real-Time Statistics */}
      <section className="py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <Clock className="mr-3 h-8 w-8 text-kenya-red" />
              Real-Time Corruption Tracker
            </h2>
            <p className="text-slate-300">
              Live data on corruption cases, missing persons, and judicial misconduct across Kenya
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-kenya-red">247</div>
              <div className="text-slate-400 text-sm">Active Cases</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">23</div>
              <div className="text-slate-400 text-sm">Missing Persons</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">12</div>
              <div className="text-slate-400 text-sm">Judicial Cases</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">KSh 2.8B</div>
              <div className="text-slate-400 text-sm">Exposed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Issues Tracking */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">What We Track & Monitor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Corruption Cases */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-kenya-red mr-3" />
                <h3 className="text-xl font-semibold text-white">Corruption Cases</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Government contract fraud</li>
                <li>• Embezzlement of public funds</li>
                <li>• Bribery in public service</li>
                <li>• Procurement irregularities</li>
                <li>• Misuse of development funds</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-kenya-red hover:bg-red-700 text-white">
                <Link href="/reports">View Cases</Link>
              </Button>
            </div>

            {/* Extra-Judicial Killings & Police Brutality */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Police Brutality</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Extra-judicial killings</li>
                <li>• Police brutality cases</li>
                <li>• Unlawful arrests</li>
                <li>• Torture in custody</li>
                <li>• Excessive force incidents</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white">
                <Link href="/police-brutality">Report Cases</Link>
              </Button>
            </div>

            {/* Missing Persons & Abductions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Missing Persons</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Enforced disappearances</li>
                <li>• Abductions by unknown persons</li>
                <li>• Missing activists & journalists</li>
                <li>• Whistleblower disappearances</li>
                <li>• Unexplained missing cases</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/missing-persons">Track Missing</Link>
              </Button>
            </div>

            {/* Judicial Corruption */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Scale className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Judicial Corruption</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Corrupt judges & magistrates</li>
                <li>• Case fixing & bribery</li>
                <li>• Delayed justice for payment</li>
                <li>• Biased court decisions</li>
                <li>• Legal system manipulation</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/judicial">Monitor Courts</Link>
              </Button>
            </div>

            {/* Finance Bills & Policy Tracking */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-8 w-8 text-kenya-green mr-3" />
                <h3 className="text-xl font-semibold text-white">Finance Bills</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Finance Bill 2024 protests</li>
                <li>• Tax policy transparency</li>
                <li>• Public participation tracking</li>
                <li>• Legislative corruption</li>
                <li>• Policy impact analysis</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-kenya-green hover:bg-green-700 text-white">
                <Link href="/finance-bills">Track Bills</Link>
              </Button>
            </div>

            {/* Corrupt Individuals & Companies */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold text-white">Corruption Profiles</h3>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Corrupt government officials</li>
                <li>• Fraudulent companies</li>
                <li>• Blacklisted contractors</li>
                <li>• Money laundering networks</li>
                <li>• Asset recovery tracking</li>
              </ul>
              <Button asChild className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white">
                <Link href="/profiles">View Profiles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events & Lives Lost */}
      <section className="py-12 md:py-16 bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-white">Recent Events & Impact</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-kenya-red/20 border border-kenya-red rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Lives Lost in Fight Against Corruption</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-kenya-red pl-4">
                  <p className="text-white font-medium">Finance Bill 2024 Protests</p>
                  <p className="text-slate-300 text-sm">Over 50 protesters killed during peaceful demonstrations</p>
                  <p className="text-slate-400 text-xs">June 2024</p>
                </div>
                <div className="border-l-4 border-kenya-red pl-4">
                  <p className="text-white font-medium">Whistleblower Disappearances</p>
                  <p className="text-slate-300 text-sm">23 corruption whistleblowers reported missing in 2024</p>
                  <p className="text-slate-400 text-xs">Ongoing</p>
                </div>
              </div>
            </div>

            <div className="bg-kenya-green/20 border border-kenya-green rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Victories & Progress</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-kenya-green pl-4">
                  <p className="text-white font-medium">Finance Bill Withdrawal</p>
                  <p className="text-slate-300 text-sm">
                    Public pressure forced government to withdraw controversial bill
                  </p>
                  <p className="text-slate-400 text-xs">June 2024</p>
                </div>
                <div className="border-l-4 border-kenya-green pl-4">
                  <p className="text-white font-medium">Corruption Convictions</p>
                  <p className="text-slate-300 text-sm">12 high-profile officials convicted in 2024</p>
                  <p className="text-slate-400 text-xs">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-slate-900/80">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Join the Fight Against Corruption</h2>
            <p className="max-w-[600px] text-slate-300">
              Your voice matters. Report corruption, share information, and help us build a more transparent Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
                <Link href="/submit">Submit a Report</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-900"
              >
                <Link href="/legal">Learn About Protection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

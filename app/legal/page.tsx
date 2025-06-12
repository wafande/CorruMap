"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Scale, FileText, Phone, ExternalLink, Download } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LegalPage() {
  const protectionLaws = [
    {
      title: "Witness Protection Act, 2006",
      description: "Provides protection for witnesses in criminal proceedings, including corruption cases",
      keyPoints: [
        "Identity protection for witnesses",
        "Physical protection measures",
        "Relocation assistance if needed",
        "Legal immunity for testimony",
      ],
    },
    {
      title: "Ethics and Anti-Corruption Commission Act, 2011",
      description: "Establishes EACC and provides framework for corruption reporting and investigation",
      keyPoints: [
        "Anonymous reporting mechanisms",
        "Protection from retaliation",
        "Whistleblower rewards program",
        "Investigation procedures",
      ],
    },
    {
      title: "Public Officer Ethics Act, 2003",
      description: "Sets ethical standards for public officers and reporting mechanisms",
      keyPoints: [
        "Code of conduct for public officers",
        "Conflict of interest reporting",
        "Asset declaration requirements",
        "Disciplinary procedures",
      ],
    },
  ]

  const legalResources = [
    {
      title: "Whistleblower Protection Guide",
      description: "Comprehensive guide on your rights and protections as a whistleblower",
      type: "PDF Guide",
      size: "2.3 MB",
    },
    {
      title: "How to Report Corruption Safely",
      description: "Step-by-step guide on secure reporting procedures",
      type: "PDF Guide",
      size: "1.8 MB",
    },
    {
      title: "Legal Aid Directory",
      description: "Directory of legal aid organizations that assist corruption whistleblowers",
      type: "PDF Directory",
      size: "1.2 MB",
    },
    {
      title: "Know Your Rights Pamphlet",
      description: "Quick reference guide on whistleblower rights in Kenya",
      type: "PDF Pamphlet",
      size: "0.8 MB",
    },
  ]

  const legalContacts = [
    {
      organization: "Kenya National Commission on Human Rights (KNCHR)",
      description: "Protects and promotes human rights, including whistleblower rights",
      phone: "+254 20 2227394",
      email: "haki@knchr.org",
      website: "https://www.knchr.org",
    },
    {
      organization: "Law Society of Kenya (LSK)",
      description: "Professional body that can provide legal assistance and referrals",
      phone: "+254 20 2719077",
      email: "info@lsk.or.ke",
      website: "https://www.lsk.or.ke",
    },
    {
      organization: "Kenya Legal Aid Network",
      description: "Network of organizations providing free legal aid",
      phone: "+254 20 2713095",
      email: "info@klan.or.ke",
      website: "https://www.klan.or.ke",
    },
    {
      organization: "Transparency International Kenya",
      description: "Anti-corruption organization providing support to whistleblowers",
      phone: "+254 20 2727763",
      email: "info@tikenya.org",
      website: "https://www.tikenya.org",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">CorruMap</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/map" className="text-slate-300 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/reports" className="text-slate-300 hover:text-white transition-colors">
              Reports
            </Link>
            <Link href="/counties" className="text-slate-300 hover:text-white transition-colors">
              Counties
            </Link>
            <Link href="/submit" className="text-slate-300 hover:text-white transition-colors">
              Submit Report
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
            <Scale className="mr-3 h-8 w-8 text-blue-500" />
            Legal Resources & Whistleblower Protection
          </h2>
          <p className="text-slate-300">Understanding your rights and protections when reporting corruption in Kenya</p>
        </div>

        {/* Protection Laws */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Whistleblower Protection Laws</h3>
          <div className="grid lg:grid-cols-1 gap-6">
            {protectionLaws.map((law, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-blue-400" />
                    {law.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400">{law.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-white mb-3">Key Protections:</h4>
                  <ul className="space-y-2">
                    {law.keyPoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start text-slate-300">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal Resources */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Legal Resources & Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {legalResources.map((resource, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Download className="mr-2 h-5 w-5 text-green-400" />
                      {resource.title}
                    </span>
                    <span className="text-sm text-slate-400">{resource.size}</span>
                  </CardTitle>
                  <CardDescription className="text-slate-400">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{resource.type}</span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal Contacts */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Legal Aid & Support Organizations</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {legalContacts.map((contact, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    {contact.organization}
                    <ExternalLink className="h-5 w-5 text-slate-400" />
                  </CardTitle>
                  <CardDescription className="text-slate-400">{contact.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone:
                      </span>
                      <span className="text-slate-400">{contact.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Email:</span>
                      <span className="text-slate-400">{contact.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Website:</span>
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <Card className="bg-red-900/20 border-red-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Phone className="mr-2 h-5 w-5 text-red-400" />
                Emergency Contacts
              </CardTitle>
              <CardDescription className="text-slate-300">
                If you feel threatened or in immediate danger due to your whistleblowing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">999</div>
                  <div className="text-slate-300">Police Emergency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">0800 720 721</div>
                  <div className="text-slate-300">EACC Hotline</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400 mb-2">116</div>
                  <div className="text-slate-300">Gender Violence Helpline</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Report Corruption?</h3>
          <p className="text-slate-300 mb-6">
            You are protected by law. Your identity will be kept confidential and you have legal protections.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Link href="/submit">Submit Anonymous Report</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

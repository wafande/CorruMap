"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Scale, Book, Search, ExternalLink, AlertTriangle, Users, Gavel } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ConstitutionPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const constitutionalViolations = [
    {
      id: "CV-001",
      title: "Violation of Article 10 - National Values",
      article: "Article 10",
      description: "Public officials failing to uphold integrity, transparency, and accountability in governance",
      examples: [
        "Corruption in procurement",
        "Lack of transparency in government contracts",
        "Abuse of public resources",
      ],
      status: "ongoing",
      reportedCases: 45,
    },
    {
      id: "CV-002",
      title: "Violation of Article 35 - Access to Information",
      article: "Article 35",
      description: "Government institutions denying citizens access to public information",
      examples: [
        "Refusal to release budget documents",
        "Blocking access to audit reports",
        "Withholding procurement information",
      ],
      status: "ongoing",
      reportedCases: 32,
    },
    {
      id: "CV-003",
      title: "Violation of Article 232 - Public Service Values",
      article: "Article 232",
      description: "Public service failing to maintain high standards of professional ethics",
      examples: ["Nepotism in hiring", "Bribery in service delivery", "Abuse of office"],
      status: "ongoing",
      reportedCases: 67,
    },
  ]

  const keyArticles = [
    {
      number: "Article 10",
      title: "National Values and Principles of Governance",
      summary: "Establishes integrity, transparency, and accountability as core national values",
      relevance: "Foundation for anti-corruption efforts",
      fullText:
        "The national values and principles of governance include: patriotism, national unity, sharing and devolution of power, the rule of law, democracy and participation of the people, human dignity, equity, social justice, inclusiveness, equality, human rights, non-discrimination and protection of the marginalized, good governance, integrity, transparency and accountability.",
    },
    {
      number: "Article 35",
      title: "Access to Information",
      summary: "Guarantees citizens' right to access information held by the state",
      relevance: "Critical for transparency and accountability",
      fullText:
        "Every citizen has the right of access to information held by the State, and information held by another person and required for the exercise or protection of any right or fundamental freedom.",
    },
    {
      number: "Article 73",
      title: "Responsibilities of Leadership",
      summary: "Sets ethical standards for public officers and leaders",
      relevance: "Defines anti-corruption obligations for leaders",
      fullText:
        "Authority assigned to a State officer is a public trust to be exercised in a manner that is consistent with the purposes and objects of this Constitution, demonstrates respect for the people, brings honor to the nation and dignity to the office, and promotes public confidence in the integrity of the office.",
    },
    {
      number: "Article 232",
      title: "Values and Principles of Public Service",
      summary: "Establishes ethical standards for public service",
      relevance: "Framework for public service integrity",
      fullText:
        "The values and principles of public service include: high standards of professional ethics, efficient, effective and economic use of resources, responsive, prompt, effective, impartial, equitable and fair provision of services, involvement of the people in the process of policy making, accountability for administrative acts, transparency and provision to the public of timely, accurate information, subject to this Constitution and any other law.",
    },
  ]

  const filteredArticles = keyArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-kenya-red" />
            <h1 className="text-2xl font-bold text-white">CorruMap</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/map" className="text-slate-300 hover:text-white transition-colors">
              Map
            </Link>
            <Link href="/reports" className="text-slate-300 hover:text-white transition-colors">
              Reports
            </Link>
            <Link href="/judicial" className="text-slate-300 hover:text-white transition-colors">
              Judicial
            </Link>
            <Link href="/finance-bills" className="text-slate-300 hover:text-white transition-colors">
              Finance Bills
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
            <Book className="mr-3 h-8 w-8 text-kenya-red" />
            Kenyan Constitution & Anti-Corruption
          </h2>
          <p className="text-slate-300">
            Understanding constitutional provisions that support transparency, accountability, and anti-corruption
            efforts
          </p>
        </div>

        {/* Constitution Overview */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Scale className="mr-2 h-5 w-5 text-kenya-green" />
              Constitution of Kenya 2010
            </CardTitle>
            <CardDescription className="text-slate-400">
              The supreme law that establishes the framework for governance, human rights, and anti-corruption measures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-kenya-green mb-2">264</div>
                <div className="text-slate-400">Total Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-kenya-red mb-2">18</div>
                <div className="text-slate-400">Chapters</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500 mb-2">2010</div>
                <div className="text-slate-400">Year Enacted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="articles" className="data-[state=active]:bg-slate-700">
              <Book className="h-4 w-4 mr-2" />
              Key Articles
            </TabsTrigger>
            <TabsTrigger value="violations" className="data-[state=active]:bg-slate-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Constitutional Violations
            </TabsTrigger>
            <TabsTrigger value="rights" className="data-[state=active]:bg-slate-700">
              <Users className="h-4 w-4 mr-2" />
              Citizens' Rights
            </TabsTrigger>
          </TabsList>

          {/* Key Articles */}
          <TabsContent value="articles">
            <Card className="mb-6 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Search Constitutional Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles by number, title, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {filteredArticles.map((article, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">
                          {article.number}: {article.title}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-2">{article.summary}</CardDescription>
                      </div>
                      <Badge className="bg-kenya-green text-white">{article.relevance}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-white mb-2">Full Text:</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{article.fullText}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View Full Article
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Report Violation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Constitutional Violations */}
          <TabsContent value="violations">
            <div className="space-y-6">
              {constitutionalViolations.map((violation, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">{violation.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">{violation.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-kenya-red text-white mb-2">{violation.article}</Badge>
                        <div className="text-sm text-slate-400">{violation.reportedCases} reported cases</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Common Examples:</h4>
                      <div className="space-y-2">
                        {violation.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-kenya-red rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-slate-300 text-sm">{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button size="sm" className="bg-kenya-red hover:bg-red-700">
                        Report This Violation
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        View Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Citizens' Rights */}
          <TabsContent value="rights">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2 h-5 w-5 text-kenya-green" />
                    Your Constitutional Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-kenya-green pl-4">
                      <h4 className="font-semibold text-white">Right to Information (Article 35)</h4>
                      <p className="text-slate-400 text-sm">Access government information and documents</p>
                    </div>
                    <div className="border-l-4 border-kenya-red pl-4">
                      <h4 className="font-semibold text-white">Right to Petition (Article 37)</h4>
                      <p className="text-slate-400 text-sm">Petition government and public authorities</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-white">Right to Fair Trial (Article 50)</h4>
                      <p className="text-slate-400 text-sm">Fair and public hearing by independent tribunal</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-semibold text-white">Right to Participate (Article 174)</h4>
                      <p className="text-slate-400 text-sm">Participate in governance and decision-making</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Gavel className="mr-2 h-5 w-5 text-kenya-red" />
                    How to Exercise Your Rights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">1. Request Information</h4>
                      <p className="text-slate-300 text-sm">
                        Submit formal requests to government institutions for public information
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">2. File Petitions</h4>
                      <p className="text-slate-300 text-sm">
                        Petition courts or government bodies when your rights are violated
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">3. Report Violations</h4>
                      <p className="text-slate-300 text-sm">Report constitutional violations to relevant authorities</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">4. Seek Legal Aid</h4>
                      <p className="text-slate-300 text-sm">Access legal assistance for constitutional matters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Section */}
        <div className="mt-12 text-center">
          <Card className="bg-kenya-red/20 border-kenya-red">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-white mb-4">Defend the Constitution</h3>
              <p className="text-slate-300 mb-6">
                The Constitution is the supreme law. Help protect it by reporting violations and exercising your rights.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-kenya-red hover:bg-red-700 text-white">
                  Report Constitutional Violation
                </Button>
                <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Download Full Constitution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export type Language = "en" | "sw"
export type TranslationKey =
  | "nav.home"
  | "nav.map"
  | "nav.reports"
  | "nav.missing"
  | "nav.judicial"
  | "nav.profiles"
  | "nav.counties"
  | "nav.finance"
  | "nav.constitution"
  | "nav.report"
  | "actions.quick_actions"
  | "actions.report_corruption"
  | "actions.report_missing"
  | "actions.report_judicial"
  | "actions.report_profile"
  | "donation.donate"
  | "donation.support"
  | "donation.help_text"
  | "donation.why_donate"

export const translations = {
  en: {
    nav: {
      home: "Home",
      map: "Map",
      reports: "Reports",
      missing: "Missing Persons",
      judicial: "Judicial",
      profiles: "Profiles",
      counties: "Counties",
      finance: "Finance Bills",
      constitution: "Constitution",
      report: "Report",
    },
    actions: {
      quick_actions: "Quick Actions",
      report_corruption: "Report Corruption",
      report_missing: "Report Missing",
      report_judicial: "Report Judicial",
      report_profile: "Report Profile",
    },
    donation: {
      donate: "Donate",
      support: "Support CorruMap",
      help_text: "Your donations help us maintain this platform and continue fighting corruption in Kenya.",
      why_donate: "Why donate?",
    },
  },
  sw: {
    nav: {
      home: "Nyumbani",
      map: "Ramani",
      reports: "Ripoti",
      missing: "Waliopotea",
      judicial: "Mahakama",
      profiles: "Wasifu",
      counties: "Kaunti",
      finance: "Miswada ya Fedha",
      constitution: "Katiba",
      report: "Ripoti",
    },
    actions: {
      quick_actions: "Vitendo vya Haraka",
      report_corruption: "Ripoti Rushwa",
      report_missing: "Ripoti Aliyepotea",
      report_judicial: "Ripoti Mahakama",
      report_profile: "Ripoti Mtu",
    },
    donation: {
      donate: "Changia",
      support: "Saidia CorruMap",
      help_text: "Michango yako inatusaidia kudumisha jukwaa hili na kuendelea kupambana na rushwa nchini Kenya.",
      why_donate: "Kwa nini uchangie?",
    },
  },
}

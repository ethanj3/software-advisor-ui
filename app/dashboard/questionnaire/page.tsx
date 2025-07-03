'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

/** All 30 questions (optional dropdowns) **/
const QUESTIONS: {
  name: string
  label: string
  options: string[]
}[] = [
  {
    name: 'q1',
    label: '1. Do you need multi-entity accounting (consolidation)?',
    options: [
      'Single entity only',
      'Yes – a few entities',
      'Yes – many entities (full consolidation)',
    ],
  },
  {
    name: 'q2',
    label: '2. What level of inventory management do you require?',
    options: [
      'None (service-based, no inventory)',
      'Basic inventory tracking',
      'Advanced inventory & warehouse management',
    ],
  },
  {
    name: 'q3',
    label: '3. Do you need project accounting or job costing features?',
    options: [
      'No (not needed)',
      'Yes – basic project tracking',
      'Yes – advanced job costing and budgeting',
    ],
  },
  {
    name: 'q4',
    label: '4. Is built-in payroll processing a requirement for you?',
    options: [
      'No (we use external payroll)',
      'Nice-to-have but not required',
      'Yes – must have native payroll',
    ],
  },
  {
    name: 'q5',
    label:
      '5. How important are automated approval workflows (e.g. for purchase orders or expenses)?',
    options: [
      'Not needed',
      'Nice to have',
      'Critical requirement (must have approval routing)',
    ],
  },
  {
    name: 'q6',
    label:
      '6. Do you need recurring automation (e.g. recurring invoices, scheduled reports)?',
    options: ['No', 'Some automation (basic scheduling)', 'Yes – extensive automation of tasks'],
  },
  {
    name: 'q7',
    label:
      '7. Would you benefit from AI-driven automation (e.g. auto-categorizing transactions)?',
    options: ['Not necessary', 'Could be useful', 'Yes – interested in AI/auto-process features'],
  },
  {
    name: 'q8',
    label: '8. What level of financial reporting do you need?',
    options: [
      'Basic reports (standard P&L, balance sheet)',
      'Custom reports and dashboards',
      'Advanced analytics & forecasting (FP&A)',
    ],
  },
  {
    name: 'q9',
    label: '9. Do you require real-time dashboards for KPIs and financial metrics?',
    options: [
      'No – static reports are fine',
      'Would be helpful',
      'Yes – interactive real-time dashboards are needed',
    ],
  },
  {
    name: 'q10',
    label: '10. Do you need built-in budgeting and forecasting tools?',
    options: ['No', 'Basic budgeting only', 'Yes – robust budgeting & scenario planning features'],
  },
  {
    name: 'q11',
    label:
      '11. Are there specific accounting standards or regulations you must adhere to?',
    options: [
      'Standard compliance (GAAP/local rules)',
      'International standards (IFRS) support needed',
      'Industry-specific compliance requirements',
    ],
  },
  {
    name: 'q12',
    label:
      '12. How important is a comprehensive audit trail (record of changes and user actions)?',
    options: ['Not important', 'Nice to have', 'Very important (must have detailed audit logs)'],
  },
  {
    name: 'q13',
    label:
      '13. Do you require the software vendor to have security/compliance certifications (e.g. SOC 2, GDPR)?',
    options: [
      'Not a priority',
      'Preferable (SOC 2/GDPR compliance is a plus)',
      'Yes – required for our vendor selection',
    ],
  },
  {
    name: 'q14',
    label: '14. Approximately how many users will need access to the system?',
    options: ['1–5', '6–20', '21–100', '100+'],
  },
  {
    name: 'q15',
    label: '15. What level of permission control do you need for users?',
    options: [
      'Basic roles (admin vs. user)',
      'Granular roles/permissions (department-level)',
      'Very detailed access control (down to field or module level)',
    ],
  },
  {
    name: 'q16',
    label:
      '16. Do you require Single Sign-On or 2-Factor Authentication for user logins?',
    options: ['No', 'Nice to have', 'Yes – firm requirement'],
  },
  {
    name: 'q17',
    label:
      '17. How important is integration with other software in your solution choice?',
    options: [
      'Not important (standalone okay)',
      'Some integrations needed',
      'Critical – must connect with many systems',
    ],
  },
  {
    name: 'q18',
    label: '18. Which external systems do you need to integrate with?',
    options: [
      'QuickBooks, Xero',
      'Salesforce, HubSpot',
      'Shopify, Magento',
      'ADP, Gusto',
      'Microsoft 365, Google Workspace',
      'Other',
    ],
  },
  {
    name: 'q19',
    label:
      '19. Do you need a public API or developer platform for custom extensions?',
    options: ['No', 'Basic API access', 'Yes – robust API required'],
  },
  {
    name: 'q20',
    label:
      '20. How important is an app marketplace or add-on modules for extending the software?',
    options: ['Not important', 'Somewhat important', 'Very important'],
  },
  {
    name: 'q21',
    label:
      '21. What level of scalability do you require as your business grows?',
    options: ['Low', 'Medium', 'High'],
  },
  {
    name: 'q22',
    label:
      '22. Do you need the ability to customize or add modules as your needs change?',
    options: ['No', 'Some customization', 'Yes – full modularity'],
  },
  {
    name: 'q23',
    label:
      '23. Will you operate in multiple currencies or countries, requiring global support?',
    options: ['No', 'Possibly in future', 'Yes – multi-currency & global'],
  },
  {
    name: 'q24',
    label: '24. What is your preference regarding the software’s user interface?',
    options: [
      'Very simple & easy',
      'Moderate learning curve',
      'Power-user interface (training okay)',
    ],
  },
  {
    name: 'q25',
    label: '25. What level of customer support do you expect?',
    options: [
      'Basic (docs only)',
      'Standard (email/chat biz hours)',
      'Premium (24/7 phone or dedicated rep)',
    ],
  },
  {
    name: 'q26',
    label:
      '26. How important are training resources (tutorials, onboarding) for your team?',
    options: ['Not important', 'Some training', 'Very important'],
  },
  {
    name: 'q27',
    label: '27. Which pricing model do you prefer?',
    options: ['Subscription', 'One-time license', 'No preference'],
  },
  {
    name: 'q28',
    label: '28. What is your budget range (annual)?',
    options: ['< $5k', '$5k – $20k', '$20k – $50k', '> $50k'],
  },
  {
    name: 'q29',
    label: '29. Deployment preference: cloud vs. on-prem?',
    options: ['Cloud SaaS', 'On-premises', 'No preference'],
  },
  {
    name: 'q30',
    label:
      '30. Are you willing to pay for implementation services or consulting?',
    options: [
      'No – self-implement',
      'Maybe – for complex setup',
      'Yes – budgeted expert help',
    ],
  },
]

export default function QuestionnairePage() {
  const router = useRouter()
  const [formData, setFormData] = useState(
    QUESTIONS.reduce((acc, q) => {
      acc[q.name] = ''   // default empty
      return acc
    }, {} as Record<string,string>)
  )

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
       ...prev,
       [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // you can still insert null user if not logged in
    const {
      data: { session },
    } = await supabase.auth.getSession()

    await supabase
      .from('client_responses')
      .insert([{ 
        ...formData,
        submitted_by: session?.user.id || null,
      }])
    router.push('/dashboard/search')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-6">
      {QUESTIONS.map(q => (
        <div key={q.name}>
          <label htmlFor={q.name} className="block font-medium mb-1">
            {q.label}
          </label>
          <select
            id={q.name}
            name={q.name}
            value={formData[q.name]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">(skip)</option>
            {q.options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Submit
      </button>
    </form>
  )
}

import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

const STORAGE_KEY = 'starquezz.onboarded'

export function Onboarding() {
  return <OnboardingWizard />
}

export function checkOnboarded(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

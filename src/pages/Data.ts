import type { ComponentType, SVGProps } from 'react'
import {Brain, Lock, BookOpen, Moon} from "lucide-react"

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export const features: {icon: IconComponent, title: string, desc: string} [] = [
    {
        icon: Brain,
        title:'AI powered support',
        desc:'Choose between OpenAI and Deepseek for ypur mental health support',
    },
    {
        icon: Lock,
        title: "Privacy and Security",
        desc:'Your data is safeguarded. Only you have access to your data',
    },
    {
        icon:Moon,
        title:'Availble 24/7',
        desc:'Anxiety doesn’t keep office hours. Access a listening ear at 3 AM or 3 PM, instantly.',
    },
    {
    icon: BookOpen,
    title: 'Progress Tracking',
    desc: 'Gently look back at your journey to see how far you’ve come and identify patterns in your mood.',
  },
]

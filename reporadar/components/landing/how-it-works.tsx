export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Paste GitHub URL',
      description: 'Simply enter any public GitHub repository URL into our analysis tool.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      number: '2',
      title: 'AI Analysis Begins',
      description:
        'Our AI agents analyze code quality, security, architecture, and team dynamics in real-time.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      number: '3',
      title: 'Reports Generated',
      description:
        'Within 5 minutes, receive a comprehensive report, pitch deck, and voice overview.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      number: '4',
      title: 'Make Decisions',
      description:
        'Download, share, or present your findings to investors and stakeholders immediately.',
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <section className="py-20 px-4 bg-white" id="how-it-works">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            From repository to investor-ready in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Progress Line */}
        <div className="hidden md:block relative -mt-[280px] mb-[280px]">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-1 bg-gray-200">
            <div className="h-full bg-gradient-to-r from-orange-600 to-orange-500 w-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

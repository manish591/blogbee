import Link from 'next/link';

export function FaqSection() {
  const faqs = [
    {
      question: 'How many team member seats do I need?',
      answer: (
        <>
          Each team member who accesses our software via the Streamline web app,
          plugins, desktop app should have their own license.{' '}
          <Link href="#" className="underline hover:no-underline">
            Read more about the pricing here
          </Link>
          . Additional seats can be added at checkout or later from your account
          page.
        </>
      ),
    },
    {
      question: 'Can I use them for unlimited projects?',
      answer: (
        <>
          Yes. You can use them for all personal and commercial projects. You
          are allowed to use up to 100 icons (or 50 illustrations) per project.
          For example, you can include 100 icons in a pitch deck, and 100
          different icons in a marketing website.{' '}
          <Link href="#" className="underline hover:no-underline">
            Read our full license
          </Link>
          .
        </>
      ),
    },
    {
      question: 'Can I try out before I buy?',
      answer: (
        <>
          Yes, you can access our free and open-source content on{' '}
          <Link href="#" className="underline hover:no-underline">
            streamlinehq.com/freebies
          </Link>
          .
        </>
      ),
    },
    {
      question: 'Can I make a one-time purchase for individual sets?',
      answer: (
        <>
          Yes. We offer{' '}
          <Link href="#" className="underline hover:no-underline">
            one-time purchase for the icons families here
          </Link>
          . You can conveniently download specific Streamline sets directly to
          your computer. No subscriptions required!
        </>
      ),
    },
  ];

  return (
    <section className="border-b bg-accent/20">
      <div>
        <div className="border-b">
          <div className="max-w-[1080px] mx-auto border-r border-l py-16">
            <h2 className="text-4xl font-bold text-center">
              Frequently asked questions
            </h2>
          </div>
        </div>
        <div className="max-w-[1080px] mx-auto border-r border-l">
          <div>
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="py-8 border-b last:border-0 px-20"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="py-16 text-center border-t">
          <p>
            Have more questions?{' '}
            <Link href="#" className="underline">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

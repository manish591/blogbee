import Link from 'next/link';
import { APP_NAME } from '@/constants';

const faqs = [
  {
    question: 'Can I create multiple blogs under one account?',
    answer: (
      <>
        Yes! You can create and manage multiple blogs from a single account.
        Each blog gets its own unique subdomain so you can separate your content
        while keeping everything managed in one place.
      </>
    ),
  },
  {
    question: 'Do I need coding skills to write or publish posts?',
    answer: (
      <>
        Not at all. Our editor works just like Notion — intuitive,
        drag-and-drop, and distraction-free. You can format, add media, and
        organize your posts without touching a line of code.
      </>
    ),
  },
  {
    question: 'Can I organize my posts into categories?',
    answer: (
      <>
        Absolutely! You can create and manage categories for each blog, making
        it easy to group related posts and help readers discover content.
      </>
    ),
  },
  {
    question: 'Will my blog have its own subdomain?',
    answer: (
      <>
        Yes, every blog you create comes with a free subdomain (like{' '}
        <code className="font-medium">yourblog.{APP_NAME}.site</code>). This
        makes it easy to share and build a unique identity for each blog.
      </>
    ),
  },
];

export function FaqsSection() {
  return (
    <section className="border-b bg-accent/30">
      <div>
        <div className="border-b">
          <div className="max-w-[1080px] mx-auto border-r border-l py-20">
            <h2 className="text-5xl font-bold text-center">
              Frequently asked questions
            </h2>
          </div>
        </div>
        <div className="max-w-[1080px] mx-auto border-r border-l">
          <div>
            {faqs.map((faq, index) => (
              <div
                key={`${faq.question}-${index}`}
                className="py-8 border-b last:border-0 px-20"
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-foreground/70 leading-relaxed max-w-[90%]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="py-16 text-center border-t">
          <p>
            Have more questions?{' '}
            <Link
              href={`mailto:manishdevrani777@gmail.com`}
              className="underline"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

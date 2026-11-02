import PageHeader from '../components/PageHeader';
import { faqs } from '../data/wedding';

export default function FAQ() {
  return (
    <div className="page">
      <PageHeader title="Frequently Asked Questions" />
      <div>
        {faqs.map((faq) => (
          <div key={faq.question} className="card faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

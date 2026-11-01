export default function FAQ() {
  const faqs = [
    {
      q: 'What is the dress code?',
      a: 'Semi-formal / Cocktail attire. We want you to feel comfortable and ready to dance!',
    },
    {
      q: 'Are children invited?',
      a: 'Although we love your little ones, our wedding will be an adults-only event so everyone can relax and celebrate.',
    },
    {
      q: 'Can I bring a plus one?',
      a: 'Due to capacity restrictions at the venue, we can only accommodate guests formally listed on your invitation.',
    },
    {
      q: 'What is your registry / gift policy?',
      a: 'Your presence at our wedding is the greatest gift of all! If you wish to honor us with a gift, a cash contribution towards our honeymoon pool would be warmly appreciated.',
    },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'serif', textAlign: 'center', color: '#2c3e50' }}>Frequently Asked Questions</h1>
      <div style={{ marginTop: '30px' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#8e44ad' }}>{faq.q}</h3>
            <p style={{ margin: 0, color: '#444' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
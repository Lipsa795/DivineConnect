import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [applicationStatus, setApplicationStatus] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Remote / Bhubaneswar',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'We are looking for a passionate Full Stack Developer to join our team. You will be responsible for building and maintaining our web applications.',
      responsibilities: [
        'Develop and maintain React frontend applications',
        'Build scalable Node.js backend APIs',
        'Integrate third-party services',
        'Optimize application performance',
        'Write clean, maintainable code'
      ],
      requirements: [
        '2+ years experience in React and Node.js',
        'Experience with MongoDB',
        'Knowledge of REST APIs',
        'Good problem-solving skills',
        'Bachelor\'s degree in CS or related field'
      ]
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Bhubaneswar',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Join our design team to create beautiful and intuitive user experiences for spiritual seekers.',
      responsibilities: [
        'Design user interfaces for web and mobile',
        'Create wireframes, prototypes, and mockups',
        'Conduct user research and usability testing',
        'Collaborate with developers',
        'Maintain design systems'
      ],
      requirements: [
        'Portfolio showcasing design work',
        'Proficiency in Figma or similar tools',
        'Understanding of user-centered design',
        'Knowledge of HTML/CSS is a plus',
        'Bachelor\'s degree in Design or related field'
      ]
    },
    {
      id: 3,
      title: 'Spiritual Content Writer',
      department: 'Content',
      location: 'Remote',
      type: 'Part-time',
      experience: '1+ years',
      description: 'Create engaging spiritual and devotional content for our platform.',
      responsibilities: [
        'Write articles on Hindu festivals and traditions',
        'Create blog posts and social media content',
        'Research spiritual topics',
        'Edit and proofread content',
        'Collaborate with SEO team'
      ],
      requirements: [
        'Excellent writing skills in English',
        'Knowledge of Hindu scriptures and traditions',
        'Experience with content management systems',
        'Ability to meet deadlines',
        'Portfolio of written work'
      ]
    },
    {
      id: 4,
      title: 'Customer Support Specialist',
      department: 'Support',
      location: 'Bhubaneswar',
      type: 'Full-time',
      experience: '0-2 years',
      description: 'Help our users with their queries and ensure a great experience.',
      responsibilities: [
        'Respond to user queries via email and chat',
        'Troubleshoot technical issues',
        'Document common issues and solutions',
        'Escalate complex issues to development team',
        'Maintain high customer satisfaction'
      ],
      requirements: [
        'Excellent communication skills',
        'Patience and empathy',
        'Basic computer knowledge',
        'Ability to work in shifts',
        'Graduate in any discipline'
      ]
    }
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setApplicationStatus('success');
      setTimeout(() => {
        setSelectedJob(null);
        setApplication({ name: '', email: '', phone: '', coverLetter: '', resume: null });
        setApplicationStatus('');
      }, 2000);
    }, 1500);
  };

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">Join Our Team</h1>
            <p className="text-gray-600 text-lg">Help us bring spirituality to millions of devotees worldwide</p>
          </div>

          {/* Why Join Us */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Remote First</h3>
              <p className="text-gray-600 text-sm">Work from anywhere in the world</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Growth Opportunity</h3>
              <p className="text-gray-600 text-sm">Learn and grow with us</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-3">❤️</div>
              <h3 className="text-lg font-bold text-amber-800 mb-2">Meaningful Work</h3>
              <p className="text-gray-600 text-sm">Make a difference in people's lives</p>
            </div>
          </div>

          {/* Open Positions */}
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-amber-800">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-sm text-gray-500"><i className="fas fa-building mr-1"></i>{job.department}</span>
                      <span className="text-sm text-gray-500"><i className="fas fa-map-marker-alt mr-1"></i>{job.location}</span>
                      <span className="text-sm text-gray-500"><i className="fas fa-clock mr-1"></i>{job.type}</span>
                      <span className="text-sm text-gray-500"><i className="fas fa-briefcase mr-1"></i>{job.experience}</span>
                    </div>
                    <p className="text-gray-600 mt-3">{job.description}</p>
                  </div>
                  <button
                    onClick={() => handleApply(job)}
                    className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-semibold">Apply for {selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="text-white hover:text-amber-200 text-2xl">&times;</button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">{selectedJob.title}</h4>
                <p className="text-sm text-gray-600">{selectedJob.department} • {selectedJob.location} • {selectedJob.type}</p>
              </div>
              
              <form onSubmit={handleApplicationSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={application.name}
                    onChange={(e) => setApplication({...application, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={application.email}
                    onChange={(e) => setApplication({...application, email: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={application.phone}
                    onChange={(e) => setApplication({...application, phone: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Cover Letter / Why you're a good fit *</label>
                  <textarea
                    value={application.coverLetter}
                    onChange={(e) => setApplication({...application, coverLetter: e.target.value})}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Resume/CV *</label>
                  <input
                    type="file"
                    onChange={(e) => setApplication({...application, resume: e.target.files[0]})}
                    required
                    accept=".pdf,.doc,.docx"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
                
                {applicationStatus === 'sending' && (
                  <div className="text-center py-2 text-amber-600">Submitting application...</div>
                )}
                
                {applicationStatus === 'success' && (
                  <div className="text-center py-2 text-green-600">Application submitted successfully!</div>
                )}
                
                <button
                  type="submit"
                  disabled={applicationStatus === 'sending'}
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
                >
                  {applicationStatus === 'sending' ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default Careers;
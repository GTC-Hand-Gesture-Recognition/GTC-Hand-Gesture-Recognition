import React, { useState } from 'react';
import { Send, Mail, MessageSquare, User } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600">
          Have questions about gesture recognition? We'd love to hear from you.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h4>
              <p className="text-gray-600">Your message has been sent successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about your questions, feedback, or ideas..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
        
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Development Team</h4>
                <p className="text-gray-600">
                  Our team of machine learning engineers and developers are passionate 
                  about making gesture recognition technology accessible to everyone.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Support</h4>
                <p className="text-gray-600">
                  Need help with implementation or have technical questions? 
                  We provide comprehensive support for developers and researchers.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Collaboration</h4>
                <p className="text-gray-600">
                  Interested in collaborating on gesture recognition research or 
                  building custom solutions? Let's discuss your project needs.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions?</h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <strong>Q:</strong> How accurate is the gesture recognition?
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>A:</strong> Our models achieve 95%+ accuracy under optimal conditions.
              </div>
              
              <div className="text-sm text-gray-700">
                <strong>Q:</strong> Can I integrate this with my own application?
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>A:</strong> Yes! The code is designed for easy integration with any ML model.
              </div>
              
              <div className="text-sm text-gray-700">
                <strong>Q:</strong> Do you support languages other than English?
              </div>
              <div className="text-sm text-gray-600">
                <strong>A:</strong> Currently English only, but we're working on multi-language support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
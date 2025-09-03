import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionContainer from '@/components/common/SectionContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MapComponent from '@/components/common/MapComponent';
import { ContactContent } from '@/types/wix';
import emailjs from '@emailjs/browser';
import { useQuoteRequest } from '@/contexts/QuoteRequestContext';
import { useProduct } from '@/hooks/useProduct';

interface ContactSectionProps {
  data?: ContactContent;
  isLoading: boolean;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enquiryType: 'general' | 'quote';
  message: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ data, isLoading }) => {
  const { requestedProduct, requestedProductId } = useQuoteRequest();

  // If we have a requested product ID, we can fetch detailed product information
  const { data: productDetails } = useProduct(requestedProductId);

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enquiryType: 'general',
    message: '',
  });

  // Update form when a product is requested
  useEffect(() => {
    if (requestedProduct) {
      // Use detailed product information if available, otherwise fallback to basic product name
      const productName = productDetails?.title || requestedProduct;

      setFormData(prev => ({
        ...prev,
        enquiryType: 'quote',
        message: `I'm interested in ${productName}. Please provide a quote.\n\n`,
      }));
    }
  }, [requestedProduct, productDetails]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  // Initialize EmailJS
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }
  }, []);

  // Map Wix CMS data to the contact info structure
  const contactInfo = data
    ? {
        title: data.sectionTitle || 'Get In Touch',
        description:
          data.sectionDescription ||
          '<p>Contact us for agricultural solutions and partnership opportunities.</p>',
        address:
          data.businessAddress || '403 - 65 Mutual Street, Toronto, M5B 0E5',
        phone: data.businessPhone || '+1 (403) 477-6059',
        email: data.businessEmail || 'info@agroventia.ca',
        hours:
          data.businessHours ||
          'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed',
      }
    : {
        title: 'Get In Touch',
        description:
          '<p>Contact us for agricultural solutions and partnership opportunities.</p>',
        address: '403 - 65 Mutual Street, Toronto, M5B 0E5',
        phone: '+1 (403) 477-6059',
        email: 'info@agroventia.ca',
        hours:
          'Monday - Friday: 8:00 AM - 6:00 PM EST Saturday: 9:00 AM - 2:00 PM EST Sunday: Closed',
      };

  // Function to sanitize and render HTML content from Wix CMS
  const renderWixHtmlContent = (htmlContent: string) => {
    // Remove or replace Wix-specific classes that might interfere with Tailwind
    const cleanHtml = htmlContent.replace(/class="[^"]*"/g, '');
    return { __html: cleanHtml };
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if EmailJS environment variables are set
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      console.error('EmailJS environment variables are not set');
      setErrors({
        ...errors,
        message:
          'Email service is not configured properly. Please contact the administrator.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare EmailJS template parameters
      const templateParams = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        enquiry_type:
          formData.enquiryType === 'quote'
            ? 'Request a Quote'
            : 'General Enquiry',
        message: formData.message,
        to_email: data?.businessEmail || 'info@agroventia.ca', // Send to business email
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log('Email sent successfully:', result);

      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        enquiryType: 'general',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message to user
      setErrors({
        ...errors,
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <SectionContainer id="contact" background="muted">
        <div className="max-w-6xl mx-auto p-6">
          {/* Section Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-6"></div>

                {/* Contact Info Items */}
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="flex items-start space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder Skeleton */}
              <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
            </div>

            {/* Contact Form Skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mb-6"></div>

              <div className="space-y-6">
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>

                <div className="flex">
                  <div className="w-12 h-10 bg-gray-200 rounded-l animate-pulse"></div>
                  <div className="flex-1 h-10 bg-gray-200 rounded-r animate-pulse"></div>
                </div>

                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>

                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="contact" background="muted" padding="large">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="heading-section">{contactInfo.title}</h2>
          <div className="text-lead max-w-3xl mx-auto">
            {contactInfo.description.startsWith('<') ? (
              <div
                dangerouslySetInnerHTML={renderWixHtmlContent(
                  contactInfo.description
                )}
              />
            ) : (
              <p>{contactInfo.description}</p>
            )}
          </div>
        </div>

        <div className="responsive-grid lg-2">
          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8 scroll-reveal">
            <div className="glass-card p-6 md:p-8">
              <h3 className="heading-subsection mb-4 md:mb-6">
                Contact Information
              </h3>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin
                      size={18}
                      className="text-green-600 md:w-5 md:h-5"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      Address
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-blue-600 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      Phone
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-purple-600 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      Email
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base break-all">
                      {contactInfo.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-amber-600 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                      Business Hours
                    </h4>
                    <p className="text-gray-600 text-sm md:text-base">
                      {contactInfo.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="rounded-xl overflow-hidden">
              <MapComponent
                address={contactInfo.address}
                position={
                  data?.latitude && data?.longitude
                    ? [data.latitude, data.longitude]
                    : undefined
                }
                className="h-48 md:h-64"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="scroll-reveal">
            <div className="glass-card p-6 md:p-8">
              <h3 className="heading-subsection mb-4 md:mb-6">
                Send us a Message
              </h3>

              {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="responsive-grid md-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm md:text-base">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={e =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={`text-sm md:text-base ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs md:text-sm">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm md:text-base">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={e =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className={`text-sm md:text-base ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs md:text-sm">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`text-sm md:text-base ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs md:text-sm">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm md:text-base">
                    Phone Number *
                  </Label>
                  <div className="flex">
                    <div className="relative border-r border-input px-3 py-2 bg-muted/40 rounded-l-md flex items-center text-sm">
                      +1
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className={`text-sm md:text-base rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs md:text-sm">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiryType" className="text-sm md:text-base">
                    Enquiry Type *
                  </Label>
                  <select
                    id="enquiryType"
                    value={formData.enquiryType}
                    onChange={e =>
                      handleInputChange(
                        'enquiryType',
                        e.target.value as 'general' | 'quote'
                      )
                    }
                    className={`block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.enquiryType ? 'border-red-500' : ''}`}
                  >
                    <option value="general">General Enquiry</option>
                    <option value="quote">Request a Quote</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                    className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Tell us more about your requirements..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-agro-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      {formData.enquiryType === 'quote'
                        ? 'Request Quote'
                        : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default ContactSection;

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] to-[#F6F2E7] py-12">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-[#225217] hover:text-[#CD7E0D] mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <Card className="bg-white/80 backdrop-blur-sm border border-[#281909]/10 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#225217] to-[#CD7E0D] text-[#FDF8F0]">
              <CardTitle className="text-3xl font-bold">
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-[#281909]/80 mb-6">
                  Last updated:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Introduction
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  AgroVentia Inc. (&quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;) operates the agroventia.ca website (the
                  &quot;Service&quot;). This page informs you of our policies
                  regarding the collection, use, and disclosure of personal data
                  when you use our Service and the choices you have associated
                  with that data.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  We use your data to provide and improve the Service. By using
                  the Service, you agree to the collection and use of
                  information in accordance with this policy.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Information Collection and Use
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  We collect several different types of information for various
                  purposes to provide and improve our Service to you.
                </p>

                <h3 className="text-xl font-bold text-[#225217] mt-6 mb-3">
                  Types of Data Collected
                </h3>

                <h4 className="text-lg font-semibold text-[#281909] mt-4 mb-2">
                  Personal Data
                </h4>
                <p className="text-[#281909]/80 mb-4">
                  While using our Service, we may ask you to provide us with
                  certain personally identifiable information that can be used
                  to contact or identify you (&quot;Personal Data&quot;).
                  Personally identifiable information may include, but is not
                  limited to:
                </p>
                <ul className="list-disc pl-5 text-[#281909]/80 space-y-1 mb-4">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>

                <h4 className="text-lg font-semibold text-[#281909] mt-4 mb-2">
                  Usage Data
                </h4>
                <p className="text-[#281909]/80 mb-4">
                  We may also collect information on how the Service is accessed
                  and used (&quot;Usage Data&quot;). This Usage Data may include
                  information such as your computer&#39;s Internet Protocol
                  address (e.g. IP address), browser type, browser version, the
                  pages of our Service that you visit, the time and date of your
                  visit, the time spent on those pages, unique device
                  identifiers and other diagnostic data.
                </p>

                <h4 className="text-lg font-semibold text-[#281909] mt-4 mb-2">
                  Tracking & Cookies Data
                </h4>
                <p className="text-[#281909]/80 mb-4">
                  We use cookies and similar tracking technologies to track the
                  activity on our Service and hold certain information. Cookies
                  are files with small amount of data which may include an
                  anonymous unique identifier.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  You can visit our{' '}
                  <Link
                    href="/cookie-policy"
                    className="text-[#225217] hover:underline"
                  >
                    Cookie Policy
                  </Link>{' '}
                  page to learn more about how we use cookies and how you can
                  manage your preferences.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Use of Data
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  AgroVentia Inc. uses the collected data for various purposes:
                </p>
                <ul className="list-disc pl-5 text-[#281909]/80 space-y-1 mb-6">
                  <li>To provide and maintain the Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>
                    To allow you to participate in interactive features of our
                    Service when you choose to do so
                  </li>
                  <li>To provide customer care and support</li>
                  <li>
                    To provide analysis or valuable information so that we can
                    improve the Service
                  </li>
                  <li>To monitor the usage of the Service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Transfer of Data
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Your information, including Personal Data, may be transferred
                  to &#8212; and maintained on &#8212; computers located outside
                  of your state, province, country or other governmental
                  jurisdiction where the data protection laws may differ than
                  those from your jurisdiction. If you are located outside
                  Canada and choose to provide information to us, please note
                  that we transfer the data, including Personal Data, to Canada
                  and process it there.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Disclosure of Data
                </h2>
                <h3 className="text-xl font-bold text-[#225217] mt-6 mb-3">
                  Legal Requirements
                </h3>
                <p className="text-[#281909]/80 mb-4">
                  AgroVentia Inc. may disclose your Personal Data in the good
                  faith belief that such action is necessary to:
                </p>
                <ul className="list-disc pl-5 text-[#281909]/80 space-y-1 mb-6">
                  <li>To comply with a legal obligation</li>
                  <li>
                    To protect and defend the rights or property of AgroVentia
                    Inc.
                  </li>
                  <li>
                    To prevent or investigate possible wrongdoing in connection
                    with the Service
                  </li>
                  <li>
                    To protect the personal safety of users of the Service or
                    the public
                  </li>
                  <li>To protect against legal liability</li>
                </ul>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Security of Data
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  The security of your data is important to us, but remember
                  that no method of transmission over the Internet, or method of
                  electronic storage is 100% secure. While we strive to use
                  commercially acceptable means to protect your Personal Data,
                  we cannot guarantee its absolute security.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Service Providers
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  We may employ third party companies and individuals to
                  facilitate our Service (&quot;Service Providers&quot;), to
                  provide the Service on our behalf, to perform Service-related
                  services or to assist us in analyzing how our Service is used.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  These third parties have access to your Personal Data only to
                  perform these tasks on our behalf and are obligated not to
                  disclose or use it for any other purpose.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Links to Other Sites
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Our Service may contain links to other sites that are not
                  operated by us. If you click on a third party link, you will
                  be directed to that third party&#39;s site. We strongly advise
                  you to review the Privacy Policy of every site you visit. We
                  have no control over and assume no responsibility for the
                  content, privacy policies or practices of any third party
                  sites or services.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Children&#39;s Privacy
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Our Service does not address anyone under the age of 18
                  (&quot;Children&quot;). We do not knowingly collect personally
                  identifiable information from anyone under the age of 18. If
                  you are a parent or guardian and you are aware that your
                  Children has provided us with Personal Data, please contact
                  us. If we become aware that we have collected Personal Data
                  from children without verification of parental consent, we
                  take steps to remove that information from our servers.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  We will let you know via email and/or a prominent notice on
                  our Service, prior to the change becoming effective and update
                  the &quot;last updated&quot; date at the top of this Privacy
                  Policy.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Contact Us
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <ul className="list-disc pl-5 text-[#281909]/80 space-y-1 mb-6">
                  <li>By email: info@agroventia.ca</li>
                  <li>By phone: +1 (403) 477-6059</li>
                  <li>By mail: 403 - 65 Mutual Street, Toronto, M5B 0E5</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

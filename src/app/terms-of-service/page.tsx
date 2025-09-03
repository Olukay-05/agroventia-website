'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TermsOfServicePage = () => {
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
                Terms of Service
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
                  Welcome to AgroVentia Inc. (&quot;Company&quot;,
                  &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These
                  Terms of Service (&quot;Terms&quot;, &quot;Terms of
                  Service&quot;) govern your use of our website located at
                  agroventia.ca (together or individually &quot;Service&quot;)
                  operated by AgroVentia Inc.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  Our Privacy Policy also governs your use of our Service and
                  explains how we collect, safeguard and disclose information
                  that results from your use of our web pages. Please read it
                  carefully.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Communications
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  By using our Service, you agree to receive communications from
                  us electronically. We will communicate with you by email or by
                  posting notices on our website. You agree that all agreements,
                  notices, disclosures, and other communications that we provide
                  to you electronically satisfy any legal requirement that such
                  communications be in writing.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Intellectual Property
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Our Service and its original content (excluding Content
                  provided by users), features and functionality are and will
                  remain the exclusive property of AgroVentia Inc. and its
                  licensors. Our Service is protected by copyright, trademark,
                  and other laws of both Canada and foreign countries. Our
                  trademarks and trade dress may not be used in connection with
                  any product or service without the prior written consent of
                  AgroVentia Inc.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Accounts
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  When you create an account with us, you guarantee that you are
                  above the age of 18, and that the information you provide us
                  is accurate, complete, and current at all times. Inaccurate,
                  incomplete, or obsolete information may result in the
                  immediate termination of your account on Service.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Links To Other Web Sites
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Our Service may contain links to third-party web sites or
                  services that are not owned or controlled by AgroVentia Inc.
                  AgroVentia Inc. has no control over, and assumes no
                  responsibility for, the content, privacy policies, or
                  practices of any third party web sites or services. We do not
                  warrant the offerings of any of these entities/individuals or
                  their websites.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Termination
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  We may terminate or suspend your account and bar access to
                  Service immediately, without prior notice or liability, under
                  our sole discretion, for any reason whatsoever and without
                  limitation, including but not limited to a breach of Terms.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Governing Law
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  These Terms shall be governed and construed in accordance with
                  the laws of Canada, without regard to its conflict of law
                  provisions. Our failure to enforce any right or provision of
                  these Terms will not be considered a waiver of those rights.
                  If any provision of these Terms is held to be invalid or
                  unenforceable by a court, the remaining provisions of these
                  Terms will remain in effect. These Terms constitute the entire
                  agreement between us regarding our Service and supersede and
                  replace any prior agreements we might have had between us
                  regarding Service.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Changes To Service
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  We reserve the right to withdraw or amend our Service, and any
                  service or material we provide via Service, in our sole
                  discretion without notice. We will not be liable if for any
                  reason all or any part of the Service is unavailable at any
                  time or for any period. From time to time, we may restrict
                  access to some parts of the Service, or the entire Service, to
                  users, including registered users.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Disclaimer of Warranties
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Our Service is provided to you &quot;AS IS&quot; and &quot;AS
                  AVAILABLE&quot; with all faults and defects without warranty
                  of any kind. To the fullest extent permitted by applicable
                  law, we disclaim all warranties, express or implied, in
                  connection with the Service and your use thereof, including,
                  without limitation, the implied warranties of merchantability,
                  fitness for a particular purpose, title and non-infringement.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  Except as otherwise required by law, in no event shall
                  AgroVentia Inc., our directors, members, employees or agents
                  be liable for any special, incidental, indirect or
                  consequential damages whatsoever (including, without
                  limitation, damages for loss of profits, loss of data or other
                  information, business interruption, personal injury, loss of
                  privacy arising out of or in any way related to the use of or
                  inability to use the Service.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Contact Us
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  If you have any questions about these Terms of Service, please
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

export default TermsOfServicePage;

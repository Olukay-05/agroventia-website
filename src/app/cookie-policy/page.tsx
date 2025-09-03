'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCookieConsent from '@/hooks/useCookieConsent';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CookiePolicyPage = () => {
  const { consent, setConsent } = useCookieConsent();
  const [, setShowSettings] = useState(false);

  const handleConsentChange = (
    category: keyof typeof consent,
    value: boolean
  ) => {
    setConsent({ [category]: value });
  };

  const handleAcceptAll = () => {
    setConsent({
      analytics: true,
      marketing: true,
      functional: true,
    });
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    setConsent({
      analytics: false,
      marketing: false,
      functional: false,
    });
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    setShowSettings(false);
  };

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
                Cookie Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-[#281909]/80 mb-6">
                  This Cookie Policy explains how AgroVentia Inc.
                  (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses
                  cookies and similar technologies to recognize you when you
                  visit our website at agroventia.ca (&quot;Website&quot;). It
                  explains what these technologies are and why we use them, as
                  well as your rights to control our use of them.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  What are cookies?
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. Cookies are widely
                  used by website owners in order to make their websites work,
                  or to work more efficiently, as well as to provide reporting
                  information.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  Cookies set by the website owner (in this case, AgroVentia
                  Inc.) are called &quot;first-party cookies&quot;. Cookies set
                  by parties other than the website owner are called
                  &quot;third-party cookies&quot;. Third-party cookies enable
                  third-party features or functionality to be provided on or
                  through the website (e.g., advertising, interactive content,
                  and analytics). The parties that set these third-party cookies
                  can recognize your computer both when it visits the website in
                  question and also when it visits certain other websites.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Why do we use cookies?
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  We use first-party and third-party cookies for several
                  reasons. Some cookies are required for technical reasons in
                  order for our Website to operate, and we refer to these as
                  &quot;essential&quot; or &quot;strictly necessary&quot;
                  cookies. Other cookies also enable us to track and target the
                  interests of our users to enhance the experience on our
                  Website. Third parties serve cookies through our Website for
                  advertising, analytics, and other purposes.
                </p>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  How can I control cookies?
                </h2>
                <p className="text-[#281909]/80 mb-4">
                  You have the right to decide whether to accept or reject
                  cookies. You can set or amend your web browser controls to
                  accept or refuse cookies. If you choose to reject cookies, you
                  may still use our website though your access to some
                  functionality and areas of our website may be restricted.
                </p>
                <p className="text-[#281909]/80 mb-6">
                  You can also manage your cookie preferences directly through
                  our cookie consent banner or by clicking the &quot;Manage
                  Cookie Preferences&quot; button below.
                </p>

                <div className="bg-[#F6F2E7] rounded-2xl p-6 my-8">
                  <h3 className="text-xl font-bold text-[#225217] mb-4">
                    Your Current Cookie Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#281909]">
                          Necessary Cookies
                        </h4>
                        <p className="text-sm text-[#281909]/70">
                          These cookies are essential for the website to
                          function properly.
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-[#225217] text-[#FDF8F0] rounded-full text-sm font-medium">
                        Always Active
                      </span>
                    </div>

                    <Separator className="bg-[#281909]/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#281909]">
                          Analytics Cookies
                        </h4>
                        <p className="text-sm text-[#281909]/70">
                          These cookies help us understand how visitors interact
                          with our website.
                        </p>
                      </div>
                      <Button
                        variant={consent.analytics ? 'default' : 'outline'}
                        onClick={() =>
                          handleConsentChange('analytics', !consent.analytics)
                        }
                        className={
                          consent.analytics
                            ? 'bg-[#225217] hover:bg-[#CD7E0D] text-[#FDF8F0]'
                            : 'border-[#281909] text-[#281909]'
                        }
                      >
                        {consent.analytics ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>

                    <Separator className="bg-[#281909]/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#281909]">
                          Marketing Cookies
                        </h4>
                        <p className="text-sm text-[#281909]/70">
                          These cookies are used to make advertising messages
                          more relevant to you.
                        </p>
                      </div>
                      <Button
                        variant={consent.marketing ? 'default' : 'outline'}
                        onClick={() =>
                          handleConsentChange('marketing', !consent.marketing)
                        }
                        className={
                          consent.marketing
                            ? 'bg-[#225217] hover:bg-[#CD7E0D] text-[#FDF8F0]'
                            : 'border-[#281909] text-[#281909]'
                        }
                      >
                        {consent.marketing ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>

                    <Separator className="bg-[#281909]/10" />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-[#281909]">
                          Functional Cookies
                        </h4>
                        <p className="text-sm text-[#281909]/70">
                          These cookies enable the website to provide enhanced
                          functionality and personalization.
                        </p>
                      </div>
                      <Button
                        variant={consent.functional ? 'default' : 'outline'}
                        onClick={() =>
                          handleConsentChange('functional', !consent.functional)
                        }
                        className={
                          consent.functional
                            ? 'bg-[#225217] hover:bg-[#CD7E0D] text-[#FDF8F0]'
                            : 'border-[#281909] text-[#281909]'
                        }
                      >
                        {consent.functional ? 'Enabled' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-[#225217] hover:bg-[#CD7E0D] text-[#FDF8F0]"
                    >
                      Accept All
                    </Button>
                    <Button
                      onClick={handleRejectAll}
                      variant="outline"
                      className="border-[#281909] text-[#281909] hover:bg-[#281909] hover:text-[#FDF8F0]"
                    >
                      Reject All
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      variant="ghost"
                      className="text-[#281909]"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  Types of cookies we use
                </h2>

                <div className="space-y-6 mt-6">
                  <div className="bg-white border border-[#281909]/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-[#225217] mb-2">
                      Essential Cookies
                    </h3>
                    <p className="text-[#281909]/80 mb-3">
                      These cookies are strictly necessary to provide you with
                      services available through our Website and to use some of
                      its features.
                    </p>
                    <ul className="list-disc pl-5 text-[#281909]/80 space-y-1">
                      <li>Authentication cookies</li>
                      <li>Security cookies</li>
                      <li>Load balancing cookies</li>
                      <li>Cookie consent cookies</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#281909]/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-[#225217] mb-2">
                      Analytics and Performance Cookies
                    </h3>
                    <p className="text-[#281909]/80 mb-3">
                      These cookies are used to collect information about
                      traffic to our Website and how users use our Website.
                    </p>
                    <ul className="list-disc pl-5 text-[#281909]/80 space-y-1">
                      <li>Google Analytics cookies</li>
                      <li>Performance monitoring cookies</li>
                      <li>Usage statistics cookies</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#281909]/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-[#225217] mb-2">
                      Marketing Cookies
                    </h3>
                    <p className="text-[#281909]/80 mb-3">
                      These cookies are used to make advertising messages more
                      relevant to you.
                    </p>
                    <ul className="list-disc pl-5 text-[#281909]/80 space-y-1">
                      <li>Ad targeting cookies</li>
                      <li>Social media tracking cookies</li>
                      <li>Retargeting pixels</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-[#281909]/10 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-[#225217] mb-2">
                      Functional Cookies
                    </h3>
                    <p className="text-[#281909]/80 mb-3">
                      These cookies enable the website to provide enhanced
                      functionality and personalization.
                    </p>
                    <ul className="list-disc pl-5 text-[#281909]/80 space-y-1">
                      <li>Language preference cookies</li>
                      <li>Region settings cookies</li>
                      <li>Video preferences cookies</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-[#225217] mt-8 mb-4">
                  How often will you update this Cookie Policy?
                </h2>
                <p className="text-[#281909]/80 mb-6">
                  We may update this Cookie Policy from time to time in order to
                  reflect, for example, changes to the cookies we use or for
                  other operational, legal or regulatory reasons. Please
                  therefore revisit this Cookie Policy regularly to stay
                  informed about our use of cookies and related technologies.
                </p>
                <p className="text-[#281909]/80">
                  The date at the top of this Cookie Policy indicates when it
                  was last updated.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;

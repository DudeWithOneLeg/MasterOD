
import { useModal } from "../../context/Modal";

export default function TermsOfServicePage() {

  const {setClassName} = useModal()

  setClassName("relative m-5 rounded-lg z-60 h-1/2 w-fit flex items-center justify-center overflow-y-auto")

    return (
        <div class="container px-4 py-8 overflow-y-scroll bg-zinc-800 text-white rounded-md h-full">
        <section id="tos" class="rounded-lg shadow-lg p-6 mb-10 bg-zinc-700">
          <h1 class="text-3xl font-bold  mb-4">Terms of Service</h1>
          <p class="mb-4">Effective Date: <strong>10/2/2024</strong></p>

          <p class="mb-4">Welcome to Search Deck! By using our services, you agree to the following terms and conditions. Please read them carefully.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">1. Acceptance of Terms</h2>
          <p class="mb-4">By accessing or using Search Deck ("the Service"), you agree to be bound by these Terms of Service ("TOS"). If you do not agree to these terms, you are prohibited from using the Service.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">2. Description of Service</h2>
          <p class="mb-4">Search Deck provides a search platform that allows users to perform searches across multiple search engines, view results side by side, and save searches and results. We use one third-party API service (SERP API) to fetch search results.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">3. User Accounts</h2>
          <p class="mb-4">To use certain features of Search Deck, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and current information during registration.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">4. User Conduct</h2>
          <p class="mb-4">You agree not to misuse the Service. Misuse includes, but is not limited to:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Violating applicable laws and regulations</li>
            <li>Interfering with the proper functioning of the Service</li>
            <li>Attempting to access restricted areas of the Service</li>
          </ul>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">5. Privacy Policy</h2>
          <p class="mb-4">By using Search Deck, you agree to our <a href="#privacy-policy" class="text-blue-600">Privacy Policy</a>, which describes how we collect, use, and protect your data.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">6. Intellectual Property</h2>
          <p class="mb-4">All content on the Service, including but not limited to text, images, code, and trademarks, is the property of Search Deck or its licensors and is protected by intellectual property laws. You are prohibited from using any content from the Service without permission.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">7. Disclaimer of Warranties</h2>
          <p class="mb-4">The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be error-free or uninterrupted.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">8. Limitation of Liability</h2>
          <p class="mb-4">To the fullest extent permitted by law, Search Deck is not liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the Service.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">9. Termination</h2>
          <p class="mb-4">We reserve the right to suspend or terminate your account or access to the Service at any time for violation of these TOS or for any reason without prior notice.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">10. Changes to the TOS</h2>
          <p class="mb-4">We reserve the right to modify these TOS at any time. Your continued use of the Service after changes are made constitutes your acceptance of the new terms.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">11. Governing Law</h2>
          <p class="mb-4">These Terms of Service are governed by the laws of Texas, and any disputes will be subject to the jurisdiction of Texas' courts.</p>
        </section>

        <section id="privacy-policy" class="bg-zinc-700 rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold  mb-4">Privacy Policy</h1>
          <p class="mb-4">Effective Date: <strong>10/2/2024</strong></p>

          <p class="mb-4">At Search Deck, we respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect your data when you use our Service.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">1. Information We Collect</h2>
          <p class="mb-4">We collect the following types of information when you use the Service:</p>
          <ul class="list-disc list-inside mb-4">
            <li><strong>Account Information:</strong> When you create an account, we collect your username, email (if provided), and password.</li>
            <li><strong>Usage Data:</strong> We collect information about your interactions with the Service, including search queries, results history, and saved searches.</li>
            <li><strong>Device Information:</strong> We may collect information about the device you use to access the Service, such as IP address, browser type, and operating system.</li>
          </ul>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">2. How We Use Your Information</h2>
          <p class="mb-4">We use the information we collect to:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Provide, maintain, and improve the Service</li>
            <li>Personalize your experience</li>
            <li>Store your search history, saved searches, and results</li>
            <li>Monitor and analyze usage trends</li>
            <li>Enhance the security of the Service</li>
          </ul>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">3. Data Retention</h2>
          <p class="mb-4">We retain your account information and usage data for as long as your account is active or as necessary to provide the Service. If you delete your account, we will delete your information as well.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">4. Data Security</h2>
          <p class="mb-4">We implement reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no security measure is perfect, and we cannot guarantee the absolute security of your data.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">5. Your Rights</h2>
          <p class="mb-4">You have the right to:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Access the personal information we hold about you</li>
            <li>Correct or update your information</li>
            <li>Delete your account and personal data</li>
            <li>Object to certain uses of your data</li>
          </ul>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">6. Third-Party Services</h2>
          <p class="mb-4">We use third-party services (e.g., SERP API) to provide parts of our Service. These third parties have their own privacy policies, which you should review.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">7. Children's Privacy</h2>
          <p class="mb-4">Search Deck is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under 13.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">8. Changes to This Privacy Policy</h2>
          <p class="mb-4">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

          <h2 class="text-2xl font-semibold  mt-8 mb-2">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at [Insert Contact Information].</p>
        </section>

      </div>
    )
}

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Facebook, Twitter, Instagram, Github } from "lucide-react";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);

//     if (!email) {
//       setError("Please enter your email");
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     // Here you would typically send the email to your server
//     console.log("Subscribing email:", email);
//     setSuccess(true);
//     setEmail("");
//   };

//   return (
//     <footer className="bg-gray-200 text-foreground">
//       <div className="container mx-auto px-[120px] py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           <div className="space-y-4">
//             <img
//               className="h-6 w-auto"
//               src="https://res.cloudinary.com/dupo7yv88/image/upload/v1730692045/logo-no-background_poots9.png"
//               alt="Company logo"
//             />
//             <p className="text-sm text-muted-foreground">
//               Empowering innovation through cutting-edge technology solutions.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Facebook size={20} />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Twitter size={20} />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Instagram size={20} />
//               </a>
//               <a href="#" className="text-muted-foreground hover:text-primary">
//                 <Github size={20} />
//               </a>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Company</h3>
//             <ul className="space-y-2">
//               {["About", "Features", "Works", "Career"].map((item) => (
//                 <li key={item}>
//                   <a
//                     href="#"
//                     className="text-sm text-muted-foreground hover:text-primary"
//                   >
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Help</h3>
//             <ul className="space-y-2">
//               {[
//                 "Customer Support",
//                 "Delivery Details",
//                 "Terms & Conditions",
//                 "Privacy Policy",
//               ].map((item) => (
//                 <li key={item}>
//                   <a
//                     href="#"
//                     className="text-sm text-muted-foreground hover:text-primary"
//                   >
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4">Stay Updated</h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full"
//               />
//               {error && <p className="text-destructive text-sm">{error}</p>}
//               {success && (
//                 <p className="text-green-600 text-sm">
//                   Thank you for subscribing!
//                 </p>
//               )}
//               <Button type="submit" className="w-full">
//                 Subscribe
//               </Button>
//             </form>
//           </div>
//         </div>

//         <div className="mt-16 mb-4 flex justify-center items-center  pt-4 border-t border-border">
//           <p className="text-center text-sm text-muted-foreground">
//             © {new Date().getFullYear()} Your Company Name. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <img
                className="h-6 w-auto"
                src="https://res.cloudinary.com/dupo7yv88/image/upload/v1730692045/logo-no-background_poots9.png"
                alt="Company logo"
              />
            </div>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <MapPin className="h-5 w-5" /> Our Store Locations
              </h3>
              <div className="space-y-2 text-sm">
                <p>01. 29 Holles Place, Dublin 2 D02 YY46</p>
                <p>
                  02. 68 Jay Street, Suite 902 New Side
                  <br />
                  Brooklyn, NY 11201
                </p>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Top Categories
            </h3>
            <ul className="space-y-3">
              {[
                "Televisions",
                "Washing Machines",
                "Air Conditioners",
                "Laptops",
                "Accessories",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Important Links
            </h3>
            <ul className="space-y-3">
              {[
                "About us",
                "Contact Us",
                "Faq",
                "Latest Posts",
                "Order Track",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              Newsletter
            </h3>
            <p className="mb-4">
              Enter your email to receive our latest updates about our products.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">© 2024 TailGrids. All Rights Reserved.</p>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="PayPal"
              className="h-8"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Visa"
              className="h-8"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Mastercard"
              className="h-8"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="American Express"
              className="h-8"
            />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="Discover"
              className="h-8"
            />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm mr-2">Follow Us:</span>
            <a href="#" className="hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

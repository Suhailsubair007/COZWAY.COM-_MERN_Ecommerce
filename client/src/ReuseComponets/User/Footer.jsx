import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Here you would typically send the email to your server
    console.log("Subscribing email:", email);
    setSuccess(true);
    setEmail("");
  };

  return (
    <footer className="bg-gray-200 text-foreground">
      <div className="container mx-auto px-[120px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              className="h-6 w-auto"
              src="https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png"
              alt="Company logo"
            />
            <p className="text-sm text-muted-foreground">
              Empowering innovation through cutting-edge technology solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Features", "Works", "Career"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              {[
                "Customer Support",
                "Delivery Details",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm">
                  Thank you for subscribing!
                </p>
              )}
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16 mb-4 flex justify-center items-center  pt-4 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
